// import React, { useEffect, useState } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { useForm } from 'react-hook-form';
// import { MapPin, CreditCard, Truck, ChevronRight, Plus, CheckCircle2 } from 'lucide-react';
// import { orderAPI, userAPI, paymentAPI } from '../services/api';
// import { fetchCart } from '../store/slices/cartSlice';
// import toast from 'react-hot-toast';

// const PAYMENT_METHODS = [
//   { id: 'CASH_ON_DELIVERY', label: 'Cash on Delivery', icon: '💵', desc: 'Pay when your order arrives' },
//   { id: 'SSLCOMMERZ',       label: 'SSLCommerz',       icon: '💳', desc: 'Cards, bKash, Nagad & more' },
//   { id: 'BKASH',            label: 'bKash',             icon: '📱', desc: 'Pay with bKash mobile banking' },
//   { id: 'NAGAD',            label: 'Nagad',             icon: '📲', desc: 'Pay with Nagad mobile banking' },
// ];

// const DELIVERY_SLOTS = ['Morning (9AM-12PM)', 'Afternoon (12PM-5PM)', 'Evening (5PM-9PM)'];

// export default function CheckoutPage() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const dispatch = useDispatch();
//   const { items } = useSelector(s => s.cart);
//   const { user } = useSelector(s => s.auth);
//   const { couponCode, discount = 0, shipping = 60, grandTotal } = location.state || {};

//   const [addresses, setAddresses] = useState([]);
//   const [selectedAddress, setSelectedAddress] = useState(null);
//   const [paymentMethod, setPaymentMethod] = useState('CASH_ON_DELIVERY');
//   const [deliverySlot, setDeliverySlot] = useState('');
//   const [showNewAddress, setShowNewAddress] = useState(false);
//   const [placing, setPlacing] = useState(false);
//   const [step, setStep] = useState(1); // 1=address, 2=payment, 3=review

//   const { register, handleSubmit, formState: { errors } } = useForm();

//   const activeItems = items.filter(i => !i.savedForLater);
//   const subtotal = activeItems.reduce((s, i) => s + (i.unitPrice || 0) * i.quantity, 0);
//   const total = grandTotal || (subtotal - discount + shipping);

//   useEffect(() => {
//     userAPI.getAddresses().then(r => {
//       const addrs = r.data.data || [];
//       setAddresses(addrs);
//       const def = addrs.find(a => a.defaultAddress) || addrs[0];
//       if (def) setSelectedAddress(def);
//       if (addrs.length === 0) setShowNewAddress(true);
//     }).catch(() => {});
//   }, []);

//   const addNewAddress = async (data) => {
//     try {
//       const { data: res } = await userAPI.addAddress(data);
//       const newAddr = res.data;
//       setAddresses(a => [...a, newAddr]);
//       setSelectedAddress(newAddr);
//       setShowNewAddress(false);
//       toast.success('Address saved!');
//     } catch { toast.error('Failed to save address'); }
//   };

//   const placeOrder = async () => {
//     if (!selectedAddress && !showNewAddress) { toast.error('Please select a delivery address'); return; }
//     setPlacing(true);
//     try {
//       const orderData = {
//         addressId: selectedAddress?.id,
//         paymentMethod,
//         couponCode: couponCode || null,
//         orderNotes: '',
//         deliverySlot,
//       };
//       const { data } = await orderAPI.place(orderData);
//       const order = data.data;
//       dispatch(fetchCart());

//       if (paymentMethod === 'SSLCOMMERZ') {
//         const { data: payData } = await paymentAPI.initSSLCommerz(order.id);
//         window.location.href = payData.data; // redirect to gateway
//       } else {
//         navigate(`/order/success/${order.orderNumber}`, { replace: true });
//       }
//     } catch (e) {
//       toast.error(e.response?.data?.message || 'Failed to place order');
//     } finally { setPlacing(false); }
//   };

//   return (
//     <div className="container-app py-6 max-w-5xl">
//       <h1 className="text-2xl font-bold text-gray-900 mb-2">Checkout</h1>

//       {/* Steps indicator */}
//       <div className="flex items-center gap-2 mb-8 text-sm">
//         {[['1', 'Delivery'], ['2', 'Payment'], ['3', 'Review']].map(([n, label], i) => (
//           <React.Fragment key={n}>
//             <div className={`flex items-center gap-1.5 font-medium ${step >= i+1 ? 'text-primary-600' : 'text-gray-400'}`}>
//               <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step >= i+1 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'}`}>{n}</div>
//               <span className="hidden sm:inline">{label}</span>
//             </div>
//             {i < 2 && <ChevronRight size={14} className="text-gray-300 flex-shrink-0" />}
//           </React.Fragment>
//         ))}
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <div className="lg:col-span-2 space-y-5">

//           {/* ─── STEP 1: ADDRESS ─── */}
//           <div className="card p-5">
//             <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
//               <MapPin size={18} className="text-primary-600" /> Delivery Address
//             </h2>

//             {/* Saved addresses */}
//             {addresses.length > 0 && (
//               <div className="space-y-3 mb-4">
//                 {addresses.map(addr => (
//                   <label key={addr.id}
//                          className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${selectedAddress?.id === addr.id ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'}`}>
//                     <input type="radio" name="address" className="mt-1 accent-primary-600"
//                            checked={selectedAddress?.id === addr.id}
//                            onChange={() => { setSelectedAddress(addr); setShowNewAddress(false); }} />
//                     <div className="text-sm">
//                       <div className="flex items-center gap-2 mb-0.5">
//                         <span className="font-semibold text-gray-800">{addr.fullName}</span>
//                         <span className="badge-gray text-[10px]">{addr.type}</span>
//                         {addr.defaultAddress && <span className="badge-green text-[10px]">Default</span>}
//                       </div>
//                       <p className="text-gray-600">{addr.streetAddress}, {addr.city}, {addr.district}</p>
//                       <p className="text-gray-500 text-xs">{addr.phone}</p>
//                     </div>
//                   </label>
//                 ))}
//               </div>
//             )}

//             {/* Add new address toggle */}
//             <button onClick={() => { setShowNewAddress(v => !v); setSelectedAddress(null); }}
//                     className="flex items-center gap-2 text-sm text-primary-600 font-medium hover:underline mb-3">
//               <Plus size={15} /> {showNewAddress ? 'Cancel' : 'Add New Address'}
//             </button>

//             {showNewAddress && (
//               <form onSubmit={handleSubmit(addNewAddress)} className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-gray-50 rounded-xl">
//                 <div>
//                   <label className="label">Full Name *</label>
//                   <input className={errors.fullName ? 'input-error' : 'input'} {...register('fullName', { required: true })}
//                          defaultValue={user?.fullName} placeholder="Full name" />
//                 </div>
//                 <div>
//                   <label className="label">Phone *</label>
//                   <input className={errors.phone ? 'input-error' : 'input'} {...register('phone', { required: true })}
//                          defaultValue={user?.phone} placeholder="01XXXXXXXXX" />
//                 </div>
//                 <div className="sm:col-span-2">
//                   <label className="label">Street Address *</label>
//                   <input className={errors.streetAddress ? 'input-error' : 'input'} {...register('streetAddress', { required: true })}
//                          placeholder="House no, road, area..." />
//                 </div>
//                 <div>
//                   <label className="label">City *</label>
//                   <input className={errors.city ? 'input-error' : 'input'} {...register('city', { required: true })} placeholder="City" />
//                 </div>
//                 <div>
//                   <label className="label">District *</label>
//                   <select className="input" {...register('district', { required: true })}>
//                     <option value="">Select District</option>
//                     {['Dhaka','Chittagong','Rajshahi','Khulna','Barishal','Sylhet','Rangpur','Mymensingh',
//                       'Gazipur','Narayanganj','Comilla','Bogura','Narsingdi','Jessore','Tangail'].map(d => (
//                       <option key={d} value={d}>{d}</option>
//                     ))}
//                   </select>
//                 </div>
//                 <div>
//                   <label className="label">Address Type</label>
//                   <select className="input" {...register('type')}>
//                     <option value="HOME">Home</option>
//                     <option value="OFFICE">Office</option>
//                     <option value="OTHER">Other</option>
//                   </select>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <input type="checkbox" {...register('defaultAddress')} id="setDefault" className="accent-primary-600 w-4 h-4" />
//                   <label htmlFor="setDefault" className="text-sm text-gray-700">Set as default address</label>
//                 </div>
//                 <div className="sm:col-span-2">
//                   <button type="submit" className="btn-primary text-sm py-2 px-5">Save Address</button>
//                 </div>
//               </form>
//             )}

//             {/* Delivery slot */}
//             <div className="mt-4">
//               <label className="label">Preferred Delivery Slot (Optional)</label>
//               <div className="flex flex-wrap gap-2">
//                 {DELIVERY_SLOTS.map(slot => (
//                   <button key={slot} type="button"
//                           onClick={() => setDeliverySlot(s => s === slot ? '' : slot)}
//                           className={`text-xs px-3 py-1.5 rounded-lg border transition-all font-medium ${deliverySlot === slot ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
//                     {slot}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* ─── STEP 2: PAYMENT ─── */}
//           <div className="card p-5">
//             <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
//               <CreditCard size={18} className="text-primary-600" /> Payment Method
//             </h2>
//             <div className="space-y-3">
//               {PAYMENT_METHODS.map(method => (
//                 <label key={method.id}
//                        className={`flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === method.id ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'}`}>
//                   <input type="radio" name="payment" className="accent-primary-600"
//                          checked={paymentMethod === method.id}
//                          onChange={() => setPaymentMethod(method.id)} />
//                   <span className="text-xl">{method.icon}</span>
//                   <div>
//                     <p className="font-medium text-sm text-gray-800">{method.label}</p>
//                     <p className="text-xs text-gray-500">{method.desc}</p>
//                   </div>
//                   {method.id === 'CASH_ON_DELIVERY' && (
//                     <span className="ml-auto badge-green text-[10px]">Recommended</span>
//                   )}
//                 </label>
//               ))}
//             </div>
//           </div>

//           {/* ─── ITEMS REVIEW ─── */}
//           <div className="card p-5">
//             <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
//               <Truck size={18} className="text-primary-600" /> Order Items ({activeItems.length})
//             </h2>
//             <div className="space-y-3">
//               {activeItems.map(item => (
//                 <div key={item.id} className="flex gap-3 text-sm">
//                   <div className="w-12 h-12 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
//                     <img src={item.product?.images?.[0] || 'https://placehold.co/48?text=Img'} alt=""
//                          className="w-full h-full object-contain"
//                          onError={e => e.target.src = 'https://placehold.co/48?text=Img'} />
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <p className="font-medium text-gray-800 line-clamp-1">{item.productName || item.product?.name}</p>
//                     {(item.size || item.color) && (
//                       <p className="text-xs text-gray-400">{[item.size, item.color].filter(Boolean).join(' / ')}</p>
//                     )}
//                   </div>
//                   <div className="text-right flex-shrink-0">
//                     <p className="font-semibold text-gray-900">৳{((item.unitPrice || 0) * item.quantity).toLocaleString('en-BD')}</p>
//                     <p className="text-xs text-gray-400">×{item.quantity}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* ─── ORDER TOTAL ─── */}
//         <div className="space-y-4">
//           <div className="card p-5 sticky top-24">
//             <h3 className="font-semibold text-gray-800 mb-4">Order Total</h3>
//             <div className="space-y-2.5 text-sm">
//               <div className="flex justify-between text-gray-600">
//                 <span>Subtotal</span>
//                 <span>৳{subtotal.toLocaleString('en-BD')}</span>
//               </div>
//               {discount > 0 && (
//                 <div className="flex justify-between text-green-600 font-medium">
//                   <span>Discount ({couponCode})</span>
//                   <span>-৳{discount.toLocaleString('en-BD')}</span>
//                 </div>
//               )}
//               <div className="flex justify-between text-gray-600">
//                 <span>Shipping</span>
//                 <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>
//                   {shipping === 0 ? 'FREE' : `৳${shipping}`}
//                 </span>
//               </div>
//               <div className="border-t border-gray-100 pt-2.5 flex justify-between font-bold text-base text-gray-900">
//                 <span>Grand Total</span>
//                 <span>৳{total.toLocaleString('en-BD')}</span>
//               </div>
//             </div>

//             <button onClick={placeOrder} disabled={placing || (!selectedAddress && !showNewAddress)}
//                     className="btn-primary w-full mt-5 py-3.5 text-sm font-semibold gap-2 disabled:opacity-60">
//               {placing
//                 ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Placing...</>
//                 : <><CheckCircle2 size={18} />Place Order — ৳{total.toLocaleString('en-BD')}</>
//               }
//             </button>

//             <p className="text-xs text-gray-400 text-center mt-3">
//               🔒 Your data is secure & encrypted
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }















// CheckoutPage.js
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { MapPin, CreditCard, Truck, ChevronRight, Plus, CheckCircle2 } from 'lucide-react';
import { orderAPI, userAPI, paymentAPI, authAPI } from '../services/api';
import { fetchCart } from '../store/slices/cartSlice';
import toast from 'react-hot-toast';
import OtpModal from '../components/auth/OtpModal';

const PAYMENT_METHODS = [
  { id: 'CASH_ON_DELIVERY', label: 'Cash on Delivery', icon: '💵', desc: 'Pay when your order arrives' },
  { id: 'SSLCOMMERZ',       label: 'SSLCommerz',       icon: '💳', desc: 'Cards, bKash, Nagad & more' },
  { id: 'BKASH',            label: 'bKash',             icon: '📱', desc: 'Pay with bKash mobile banking' },
  { id: 'NAGAD',            label: 'Nagad',             icon: '📲', desc: 'Pay with Nagad mobile banking' },
];

const DELIVERY_SLOTS = ['Morning (9AM-12PM)', 'Afternoon (12PM-5PM)', 'Evening (5PM-9PM)'];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { items } = useSelector(s => s.cart);
  const { user } = useSelector(s => s.auth);
  const { couponCode, discount = 0, shipping = 60, grandTotal } = location.state || {};

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('CASH_ON_DELIVERY');
  const [deliverySlot, setDeliverySlot] = useState('');
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [step, setStep] = useState(1);
  const [showOtpModal, setShowOtpModal] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const activeItems = items.filter(i => !i.savedForLater);
  const subtotal = activeItems.reduce((s, i) => s + (i.unitPrice || 0) * i.quantity, 0);
  const total = grandTotal || (subtotal - discount + shipping);

  useEffect(() => {
    userAPI.getAddresses().then(r => {
      const addrs = r.data.data || [];
      setAddresses(addrs);
      const def = addrs.find(a => a.defaultAddress) || addrs[0];
      if (def) setSelectedAddress(def);
      if (addrs.length === 0) setShowNewAddress(true);
    }).catch(() => {});
  }, []);

  const addNewAddress = async (data) => {
    try {
      const { data: res } = await userAPI.addAddress(data);
      const newAddr = res.data;
      setAddresses(a => [...a, newAddr]);
      setSelectedAddress(newAddr);
      setShowNewAddress(false);
      toast.success('Address saved!');
    } catch { toast.error('Failed to save address'); }
  };

  const doPlaceOrder = async () => {
    setPlacing(true);
    try {
      const orderData = {
        addressId: selectedAddress?.id,
        paymentMethod,
        couponCode: couponCode || null,
        orderNotes: '',
        deliverySlot,
      };
      const { data } = await orderAPI.place(orderData);
      const order = data.data;
      dispatch(fetchCart());

      if (paymentMethod === 'SSLCOMMERZ') {
        const { data: payData } = await paymentAPI.initSSLCommerz(order.id);
        window.location.href = payData.data;
      } else {
        navigate(`/order/success/${order.orderNumber}`, { replace: true });
      }
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to place order');
    } finally { setPlacing(false); }
  };

  const placeOrder = async () => {
    if (!selectedAddress && !showNewAddress) {
      toast.error('Please select a delivery address');
      return;
    }

    // Email verified কিনা check করো
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (!storedUser.emailVerified) {
      // OTP পাঠাও এবং modal দেখাও
      try {
        await authAPI.sendVerificationOtp(storedUser.email || user?.email);
        setShowOtpModal(true);
      } catch {
        toast.error('Failed to send verification OTP');
      }
      return;
    }

    await doPlaceOrder();
  };

  const getUserEmail = () => {
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    return storedUser.email || user?.email || '';
  };

  return (
    <div className="container-app py-6 max-w-5xl">
      {/* OTP Verification Modal */}

      {showOtpModal && (
        <OtpModal
          email={user?.email || JSON.parse(localStorage.getItem('user') || '{}').email}
          type="verify"         // ← 'verify' দাও — 'reset' না
          onSuccess={() => {
            setShowOtpModal(false);
            // localStorage এ emailVerified = true করো
            try {
              const stored = JSON.parse(localStorage.getItem('user') || '{}');
              stored.emailVerified = true;
              localStorage.setItem('user', JSON.stringify(stored));
            } catch {}
            // Order place করো
            doPlaceOrder();
          }}
          onClose={() => setShowOtpModal(false)}
        />
      )}

      <h1 className="text-2xl font-bold text-gray-900 mb-2">Checkout</h1>

      {/* Steps indicator */}
      <div className="flex items-center gap-2 mb-8 text-sm">
        {[['1', 'Delivery'], ['2', 'Payment'], ['3', 'Review']].map(([n, label], i) => (
          <React.Fragment key={n}>
            <div className={`flex items-center gap-1.5 font-medium ${step >= i+1 ? 'text-primary-600' : 'text-gray-400'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step >= i+1 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'}`}>{n}</div>
              <span className="hidden sm:inline">{label}</span>
            </div>
            {i < 2 && <ChevronRight size={14} className="text-gray-300 flex-shrink-0" />}
          </React.Fragment>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">

          {/* ─── STEP 1: ADDRESS ─── */}
          <div className="card p-5">
            <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <MapPin size={18} className="text-primary-600" /> Delivery Address
            </h2>

            {/* Saved addresses */}
            {addresses.length > 0 && (
              <div className="space-y-3 mb-4">
                {addresses.map(addr => (
                  <label key={addr.id}
                         className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${selectedAddress?.id === addr.id ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <input type="radio" name="address" className="mt-1 accent-primary-600"
                           checked={selectedAddress?.id === addr.id}
                           onChange={() => { setSelectedAddress(addr); setShowNewAddress(false); }} />
                    <div className="text-sm">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-semibold text-gray-800">{addr.fullName}</span>
                        <span className="badge-gray text-[10px]">{addr.type}</span>
                        {addr.defaultAddress && <span className="badge-green text-[10px]">Default</span>}
                      </div>
                      <p className="text-gray-600">{addr.streetAddress}, {addr.city}, {addr.district}</p>
                      <p className="text-gray-500 text-xs">{addr.phone}</p>
                    </div>
                  </label>
                ))}
              </div>
            )}

            {/* Add new address toggle */}
            <button onClick={() => { setShowNewAddress(v => !v); setSelectedAddress(null); }}
                    className="flex items-center gap-2 text-sm text-primary-600 font-medium hover:underline mb-3">
              <Plus size={15} /> {showNewAddress ? 'Cancel' : 'Add New Address'}
            </button>

            {showNewAddress && (
              <form onSubmit={handleSubmit(addNewAddress)} className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-gray-50 rounded-xl">
                <div>
                  <label className="label">Full Name *</label>
                  <input className={errors.fullName ? 'input-error' : 'input'} {...register('fullName', { required: true })}
                         defaultValue={user?.fullName} placeholder="Full name" />
                </div>
                <div>
                  <label className="label">Phone *</label>
                  <input className={errors.phone ? 'input-error' : 'input'} {...register('phone', { required: true })}
                         defaultValue={user?.phone} placeholder="01XXXXXXXXX" />
                </div>
                <div className="sm:col-span-2">
                  <label className="label">Street Address *</label>
                  <input className={errors.streetAddress ? 'input-error' : 'input'} {...register('streetAddress', { required: true })}
                         placeholder="House no, road, area..." />
                </div>
                <div>
                  <label className="label">City *</label>
                  <input className={errors.city ? 'input-error' : 'input'} {...register('city', { required: true })} placeholder="City" />
                </div>
                <div>
                  <label className="label">District *</label>
                  <select className="input" {...register('district', { required: true })}>
                    <option value="">Select District</option>
                    {['Dhaka','Chittagong','Rajshahi','Khulna','Barishal','Sylhet','Rangpur','Mymensingh',
                      'Gazipur','Narayanganj','Comilla','Bogura','Narsingdi','Jessore','Tangail'].map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">Address Type</label>
                  <select className="input" {...register('type')}>
                    <option value="HOME">Home</option>
                    <option value="OFFICE">Office</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" {...register('defaultAddress')} id="setDefault" className="accent-primary-600 w-4 h-4" />
                  <label htmlFor="setDefault" className="text-sm text-gray-700">Set as default address</label>
                </div>
                <div className="sm:col-span-2">
                  <button type="submit" className="btn-primary text-sm py-2 px-5">Save Address</button>
                </div>
              </form>
            )}

            {/* Delivery slot */}
            <div className="mt-4">
              <label className="label">Preferred Delivery Slot (Optional)</label>
              <div className="flex flex-wrap gap-2">
                {DELIVERY_SLOTS.map(slot => (
                  <button key={slot} type="button"
                          onClick={() => setDeliverySlot(s => s === slot ? '' : slot)}
                          className={`text-xs px-3 py-1.5 rounded-lg border transition-all font-medium ${deliverySlot === slot ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ─── STEP 2: PAYMENT ─── */}
          <div className="card p-5">
            <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <CreditCard size={18} className="text-primary-600" /> Payment Method
            </h2>
            <div className="space-y-3">
              {PAYMENT_METHODS.map(method => (
                <label key={method.id}
                       className={`flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === method.id ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <input type="radio" name="payment" className="accent-primary-600"
                         checked={paymentMethod === method.id}
                         onChange={() => setPaymentMethod(method.id)} />
                  <span className="text-xl">{method.icon}</span>
                  <div>
                    <p className="font-medium text-sm text-gray-800">{method.label}</p>
                    <p className="text-xs text-gray-500">{method.desc}</p>
                  </div>
                  {method.id === 'CASH_ON_DELIVERY' && (
                    <span className="ml-auto badge-green text-[10px]">Recommended</span>
                  )}
                </label>
              ))}
            </div>
          </div>

          {/* ─── ITEMS REVIEW ─── */}
          <div className="card p-5">
            <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Truck size={18} className="text-primary-600" /> Order Items ({activeItems.length})
            </h2>
            <div className="space-y-3">
              {activeItems.map(item => (
                <div key={item.id} className="flex gap-3 text-sm">
                  <div className="w-12 h-12 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={item.product?.images?.[0] || 'https://placehold.co/48?text=Img'} alt=""
                         className="w-full h-full object-contain"
                         onError={e => e.target.src = 'https://placehold.co/48?text=Img'} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 line-clamp-1">{item.productName || item.product?.name}</p>
                    {(item.size || item.color) && (
                      <p className="text-xs text-gray-400">{[item.size, item.color].filter(Boolean).join(' / ')}</p>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-semibold text-gray-900">৳{((item.unitPrice || 0) * item.quantity).toLocaleString('en-BD')}</p>
                    <p className="text-xs text-gray-400">×{item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ─── ORDER TOTAL ─── */}
        <div className="space-y-4">
          <div className="card p-5 sticky top-24">
            <h3 className="font-semibold text-gray-800 mb-4">Order Total</h3>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>৳{subtotal.toLocaleString('en-BD')}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600 font-medium">
                  <span>Discount ({couponCode})</span>
                  <span>-৳{discount.toLocaleString('en-BD')}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>
                  {shipping === 0 ? 'FREE' : `৳${shipping}`}
                </span>
              </div>
              <div className="border-t border-gray-100 pt-2.5 flex justify-between font-bold text-base text-gray-900">
                <span>Grand Total</span>
                <span>৳{total.toLocaleString('en-BD')}</span>
              </div>
            </div>

            <button onClick={placeOrder} disabled={placing || (!selectedAddress && !showNewAddress)}
                    className="btn-primary w-full mt-5 py-3.5 text-sm font-semibold gap-2 disabled:opacity-60">
              {placing
                ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Placing...</>
                : <><CheckCircle2 size={18} />Place Order — ৳{total.toLocaleString('en-BD')}</>
              }
            </button>

            <p className="text-xs text-gray-400 text-center mt-3">
              🔒 Your data is secure & encrypted
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}









