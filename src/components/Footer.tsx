
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-tovector-black text-tovector-white py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* Logo & Tagline */}
          <div className="flex flex-col">
            <Link to="/" className="font-bold text-2xl text-tovector-red">tovector.ai</Link>
            <p className="mt-2 text-sm text-tovector-white/70">Convert your images to vectors instantly</p>
          </div>
          
          {/* Quick Links */}
          <div className="flex justify-center md:justify-center">
            <nav className="grid grid-cols-2 gap-x-8 gap-y-2">
              <Link to="/" className="text-sm hover:text-tovector-red transition-colors">Home</Link>
              <Link to="/examples" className="text-sm hover:text-tovector-red transition-colors">Examples</Link>
              <Link to="/pricing" className="text-sm hover:text-tovector-red transition-colors">Pricing</Link>
              <Link to="/faq" className="text-sm hover:text-tovector-red transition-colors">FAQ</Link>
              <Link to="/support" className="text-sm hover:text-tovector-red transition-colors">Support</Link>
              <Link to="/login" className="text-sm hover:text-tovector-red transition-colors">Log In</Link>
            </nav>
          </div>
          
          {/* Copyright */}
          <div className="text-right text-sm text-tovector-white/70 flex justify-center md:justify-end">
            <p>© {currentYear} tovector.ai. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
