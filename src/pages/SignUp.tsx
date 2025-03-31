
import React from 'react';
import { SignUp as ClerkSignUp } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-white">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-black">
            Create your account
          </CardTitle>
          <CardDescription>
            Already have an account?{' '}
            <button 
              onClick={() => navigate('/sign-in')}
              className="font-medium text-tovector-red hover:text-tovector-red/90"
            >
              Sign in
            </button>
          </CardDescription>
        </CardHeader>
        
        <CardContent className="mt-4">
          <ClerkSignUp 
            routing="path" 
            path="/sign-up" 
            signInUrl="/sign-in"
            afterSignUpUrl="/dashboard"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUp;
