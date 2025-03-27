
import React from 'react';
import { SignIn as ClerkSignIn } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-white">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-black">
            Sign in to tovector.ai
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{' '}
            <button 
              onClick={() => navigate('/sign-up')}
              className="font-medium text-tovector-red hover:text-tovector-red/90"
            >
              create a new account
            </button>
          </p>
        </div>
        
        <div className="mt-8">
          <ClerkSignIn 
            routing="path" 
            path="/sign-in" 
            signUpUrl="/sign-up"
          />
        </div>
      </div>
    </div>
  );
};

export default SignIn;
