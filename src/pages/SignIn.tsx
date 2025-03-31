
import React from 'react';
import { SignIn as ClerkSignIn } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-white">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-black">
            Sign in to tovector.ai
          </CardTitle>
          <CardDescription>
            Or{' '}
            <button 
              onClick={() => navigate('/sign-up')}
              className="font-medium text-tovector-red hover:text-tovector-red/90"
            >
              create a new account
            </button>
          </CardDescription>
        </CardHeader>
        
        <CardContent className="mt-4">
          <ClerkSignIn 
            routing="path" 
            path="/sign-in" 
            signUpUrl="/sign-up"
            afterSignInUrl="/dashboard"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default SignIn;
