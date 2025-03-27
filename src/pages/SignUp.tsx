
import React from 'react';
import { SignUp as ClerkSignUp } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-white">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-black">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Already have an account?{' '}
            <button 
              onClick={() => navigate('/sign-in')}
              className="font-medium text-tovector-red hover:text-tovector-red/90"
            >
              Sign in
            </button>
          </p>
        </div>
        
        <div className="mt-8">
          <ClerkSignUp 
            routing="path" 
            path="/sign-up" 
            signInUrl="/sign-in"
          />
        </div>
      </div>
    </div>
  );
};

export default SignUp;
