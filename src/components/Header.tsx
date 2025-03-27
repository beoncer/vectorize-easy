
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when changing routes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-tovector-black/90 backdrop-blur-lg py-3 shadow-md' : 'bg-tovector-black py-5'
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <span className="font-bold text-2xl text-tovector-red tracking-tight">tovector.ai</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/examples" className="nav-link">Examples</Link>
          <Link to="/pricing" className="nav-link">Pricing</Link>
          <Link to="/faq" className="nav-link">FAQ</Link>
          <Link to="/support" className="nav-link">Support</Link>
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <Link to="/login" className="btn-secondary">Log In</Link>
          <Link to="/signup" className="btn-primary">Get Started</Link>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-tovector-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`fixed inset-0 bg-tovector-black z-40 transition-transform duration-300 pt-20 px-6 md:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <nav className="flex flex-col space-y-6 text-center">
          <Link to="/" className="text-xl font-medium text-tovector-white hover:text-tovector-red">Home</Link>
          <Link to="/examples" className="text-xl font-medium text-tovector-white hover:text-tovector-red">Examples</Link>
          <Link to="/pricing" className="text-xl font-medium text-tovector-white hover:text-tovector-red">Pricing</Link>
          <Link to="/faq" className="text-xl font-medium text-tovector-white hover:text-tovector-red">FAQ</Link>
          <Link to="/support" className="text-xl font-medium text-tovector-white hover:text-tovector-red">Support</Link>
          
          <div className="pt-6 flex flex-col space-y-4">
            <Link to="/login" className="btn-secondary w-full">Log In</Link>
            <Link to="/signup" className="btn-primary w-full">Get Started</Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
