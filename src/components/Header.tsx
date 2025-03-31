import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from './ui/button';
import { Menu, X } from 'lucide-react';

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, credits, signOut, isLoading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Helper function to determine if a link is active
  const isActive = (path: string) => {
    if (path === '/' && location.pathname !== '/') {
      return false;
    }
    return location.pathname.startsWith(path);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Navigation links component to avoid duplication
  const NavLinks = ({ className = '' }: { className?: string }) => (
    <>
      <Link
        to="/"
        className={`nav-link ${className} ${isActive('/') ? 'after:scale-x-100 after:origin-bottom-left' : ''}`}
        onClick={closeMobileMenu}
      >
        Home
      </Link>
      <Link
        to="/examples"
        className={`nav-link ${className} ${isActive('/examples') ? 'after:scale-x-100 after:origin-bottom-left' : ''}`}
        onClick={closeMobileMenu}
      >
        Examples
      </Link>
      <Link
        to="/pricing"
        className={`nav-link ${className} ${isActive('/pricing') ? 'after:scale-x-100 after:origin-bottom-left' : ''}`}
        onClick={closeMobileMenu}
      >
        Pricing
      </Link>
      <Link
        to="/faq"
        className={`nav-link ${className} ${isActive('/faq') ? 'after:scale-x-100 after:origin-bottom-left' : ''}`}
        onClick={closeMobileMenu}
      >
        FAQ
      </Link>
      <Link
        to="/support"
        className={`nav-link ${className} ${isActive('/support') ? 'after:scale-x-100 after:origin-bottom-left' : ''}`}
        onClick={closeMobileMenu}
      >
        Support
      </Link>
    </>
  );

  // Auth buttons component to avoid duplication
  const AuthButtons = ({ className = '' }: { className?: string }) => (
    <div className={`flex items-center space-x-4 ${className}`}>
      {isAuthenticated ? (
        <>
          <Link
            to="/dashboard"
            className={`nav-link ${isActive('/dashboard') ? 'after:scale-x-100 after:origin-bottom-left' : ''}`}
            onClick={closeMobileMenu}
          >
            Dashboard
          </Link>
          <div className="flex items-center border rounded-full px-3 py-1 border-tovector-red">
            <span className="text-sm font-medium">{credits.credit_balance} credits</span>
          </div>
          <Button
            variant="outline"
            className="text-black border-tovector-red hover:bg-tovector-red/10"
            onClick={handleSignOut}
          >
            Log out
          </Button>
        </>
      ) : (
        <>
          <Link to="/sign-in" onClick={closeMobileMenu}>
            <Button variant="outline" className="text-black border-tovector-red hover:bg-tovector-red/10">
              Sign In
            </Button>
          </Link>
          <Link to="/sign-up" onClick={closeMobileMenu}>
            <Button className="bg-tovector-red text-black hover:bg-tovector-red/90">
              Get Started
            </Button>
          </Link>
        </>
      )}
    </div>
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and brand */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-tovector-red">tovector.ai</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavLinks />
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex">
            <AuthButtons />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <div className="flex flex-col space-y-4">
              <NavLinks className="block" />
              <div className="pt-4 border-t border-gray-200">
                <AuthButtons className="flex-col space-y-4" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-tovector-red"></div>
        </div>
      )}
    </header>
  );
};

export default Header;
