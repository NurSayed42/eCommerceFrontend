import React from 'react';
import { useForm } from 'react-hook-form';

const divisions = ['Dhaka', 'Chattogram', 'Rajshahi', 'Sylhet', 'Khulna', 'Barishal', 'Rangpur', 'Mymensingh'];

export default function AddressForm({ onSubmit, defaultValues = {}, loading }) {
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="label">Full Name *</label>
          <input {...register('fullName', { required: 'Name is required' })}
                 className={`input ${errors.fullName ? 'border-red-400' : ''}`}
                 placeholder="John Doe" />
          {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
        </div>
        <div>
          <label className="label">Phone *</label>
          <input {...register('phone', { required: 'Phone is required', pattern: { value: /^(\+88)?01[3-9]\d{8}$/, message: 'Invalid phone number' } })}
                 className={`input ${errors.phone ? 'border-red-400' : ''}`}
                 placeholder="01XXXXXXXXX" />
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
        </div>
      </div>

      <div>
        <label className="label">Address Line *</label>
        <input {...register('addressLine', { required: 'Address is required' })}
               className={`input ${errors.addressLine ? 'border-red-400' : ''}`}
               placeholder="House/Road/Block" />
        {errors.addressLine && <p className="text-red-500 text-xs mt-1">{errors.addressLine.message}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="label">City *</label>
          <input {...register('city', { required: 'City is required' })}
                 className={`input ${errors.city ? 'border-red-400' : ''}`}
                 placeholder="Dhaka" />
          {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
        </div>
        <div>
          <label className="label">Division</label>
          <select {...register('state')} className="input">
            <option value="">Select</option>
            {divisions.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Postal Code</label>
          <input {...register('postalCode')} className="input" placeholder="1216" />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input type="checkbox" id="isDefault" {...register('isDefault')}
               className="w-4 h-4 text-primary-600 rounded" />
        <label htmlFor="isDefault" className="text-sm text-gray-600">Set as default address</label>
      </div>

      <button type="submit" disabled={loading}
              className="btn-primary w-full py-3 text-sm font-semibold disabled:opacity-50">
        {loading ? 'Saving...' : 'Save Address'}
      </button>
    </form>
  );
}
