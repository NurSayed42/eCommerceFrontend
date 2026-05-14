import React from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { User, Package, Heart, MapPin, Lock, Bell, LogOut } from 'lucide-react';
import { logout } from '../store/slices/authSlice';
import ProfileTab from '../components/account/ProfileTab';
import AddressTab from '../components/account/AddressTab';
import SecurityTab from '../components/account/SecurityTab';

const NAV_ITEMS = [
  { path: '', label: 'Profile',   icon: User },
  { path: 'addresses', label: 'Addresses', icon: MapPin },
  { path: 'security',  label: 'Security',  icon: Lock },
];

export default function AccountPage() {
  const { user } = useSelector(s => s.auth);
  const dispatch = useDispatch();
  const location = useLocation();

  return (
    <div className="container-app py-6 max-w-5xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Account</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="card p-5">
            {/* Avatar */}
            <div className="flex flex-col items-center mb-5">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-2">
                <span className="text-2xl font-bold text-primary-600">{user?.fullName?.charAt(0).toUpperCase()}</span>
              </div>
              <p className="font-semibold text-gray-800 text-sm text-center">{user?.fullName}</p>
              <p className="text-xs text-gray-500 text-center truncate w-full">{user?.email || user?.phone}</p>
            </div>

            <nav className="space-y-1">
              {NAV_ITEMS.map(item => {
                const Icon = item.icon;
                const isActive = location.pathname.endsWith(item.path) || (item.path === '' && location.pathname === '/account');
                return (
                  <Link key={item.path} to={`/account/${item.path}`}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'}`}>
                    <Icon size={16} /> {item.label}
                  </Link>
                );
              })}
              <Link to="/orders" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">
                <Package size={16} /> My Orders
              </Link>
              <Link to="/wishlist" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">
                <Heart size={16} /> Wishlist
              </Link>
              <button onClick={() => dispatch(logout())}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 w-full text-left mt-2">
                <LogOut size={16} /> Logout
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="md:col-span-3">
          <Routes>
            <Route index element={<ProfileTab />} />
            <Route path="addresses" element={<AddressTab />} />
            <Route path="security"  element={<SecurityTab />} />
            <Route path="*" element={<Navigate to="/account" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
