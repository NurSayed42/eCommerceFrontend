import React from 'react';
import { Link } from 'react-router-dom';
import { Package, Phone, Mail, MapPin, Facebook, Instagram, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="container-app py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <Package size={18} className="text-white" />
              </div>
              <span className="text-xl font-black text-white">Shop<span className="text-primary-400">BD</span></span>
            </Link>
            <p className="text-sm leading-relaxed mb-4 text-gray-400">
              Bangladesh's most trusted online marketplace. Quality products, fast delivery, and amazing deals every day.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors">
                <Facebook size={16} />
              </a>
              <a href="#" className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors">
                <Instagram size={16} />
              </a>
              <a href="#" className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors">
                <Youtube size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {[['/', 'Home'], ['/products', 'All Products'], ['/products?flashSale=true', 'Flash Sale'], ['/wishlist', 'Wishlist'], ['/orders', 'Track Order']].map(([to, label]) => (
                <li key={to}><Link to={to} className="hover:text-primary-400 transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-white font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2 text-sm">
              {[['#', 'Help Center'], ['#', 'Return Policy'], ['#', 'Shipping Info'], ['#', 'Privacy Policy'], ['#', 'Terms & Conditions']].map(([to, label]) => (
                <li key={label}><a href={to} className="hover:text-primary-400 transition-colors">{label}</a></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={15} className="text-primary-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-400">123 Shopping Complex, Dhaka 1212, Bangladesh</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={15} className="text-primary-400 flex-shrink-0" />
                <a href="tel:+8801700000000" className="hover:text-primary-400">+880 1700-000000</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={15} className="text-primary-400 flex-shrink-0" />
                <a href="mailto:support@shopbd.com" className="hover:text-primary-400">support@shopbd.com</a>
              </li>
            </ul>
            <div className="mt-4 p-3 bg-gray-800 rounded-lg">
              <p className="text-xs text-gray-400 mb-1">Working Hours</p>
              <p className="text-sm text-white">Sat – Thu: 9AM – 10PM</p>
              <p className="text-xs text-gray-400">Friday: 2PM – 10PM</p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods & Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container-app py-5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">© 2024 ShopBD. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 mr-2">We Accept:</span>
            {['COD', 'bKash', 'Nagad', 'SSL'].map(m => (
              <span key={m} className="px-2.5 py-1 bg-gray-800 rounded text-xs text-gray-300 font-medium">{m}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
