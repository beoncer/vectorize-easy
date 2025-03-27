
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UserButton, SignInButton, SignUpButton } from '@clerk/clerk-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from './ui/button';

const Header: React.FC = () => {
  const location = useLocation();
  const { isLoggedIn, credits } = useAuth();

  // Helper function to determine if a link is active
  const isActive = (path: string) => {
    if (path === '/' && location.pathname !== '/') {
      return false;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and brand */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-tovector-red">tovector.ai</span>
          </Link>

          {/* Navigation links */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`nav-link ${isActive('/') ? 'after:scale-x-100 after:origin-bottom-left' : ''}`}
            >
              Home
            </Link>
            <Link
              to="/examples"
              className={`nav-link ${isActive('/examples') ? 'after:scale-x-100 after:origin-bottom-left' : ''}`}
            >
              Examples
            </Link>
            <Link
              to="/pricing"
              className={`nav-link ${isActive('/pricing') ? 'after:scale-x-100 after:origin-bottom-left' : ''}`}
            >
              Pricing
            </Link>
            <Link
              to="/faq"
              className={`nav-link ${isActive('/faq') ? 'after:scale-x-100 after:origin-bottom-left' : ''}`}
            >
              FAQ
            </Link>
            <Link
              to="/support"
              className={`nav-link ${isActive('/support') ? 'after:scale-x-100 after:origin-bottom-left' : ''}`}
            >
              Support
            </Link>
          </nav>

          {/* Auth buttons */}
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <Link
                  to="/dashboard"
                  className={`nav-link hidden md:inline-block ${isActive('/dashboard') ? 'after:scale-x-100 after:origin-bottom-left' : ''}`}
                >
                  Dashboard
                </Link>
                <div className="hidden md:flex items-center border rounded-full px-3 py-1 border-tovector-red">
                  <span className="text-sm font-medium">{credits} credits</span>
                </div>
                <UserButton afterSignOutUrl="/" />
              </>
            ) : (
              <>
                <SignInButton mode="modal">
                  <Button variant="outline" className="text-black border-tovector-red hover:bg-tovector-red/10">
                    Sign In
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button className="bg-tovector-red text-black hover:bg-tovector-red/90">
                    Get Started
                  </Button>
                </SignUpButton>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
