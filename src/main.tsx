import { createRoot } from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App.tsx';
import './index.css';
import { AuthProvider } from './contexts/AuthContext';

// Get Clerk publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Clerk Publishable Key. Add VITE_CLERK_PUBLISHABLE_KEY to your environment variables.');
}

// Get the current URL for Clerk configuration
const currentUrl = window.location.origin;
const ngrokUrl = 'https://4f26-2001-7d0-8224-e00-4090-148-9305-b2a0.ngrok-free.app';
const allowedUrls = [
  currentUrl,
  'http://localhost:8082',
  ngrokUrl,
  `${ngrokUrl}/sign-in`,
  `${ngrokUrl}/sign-up`,
  `${ngrokUrl}/dashboard`
];

createRoot(document.getElementById("root")!).render(
  <ClerkProvider
    publishableKey={PUBLISHABLE_KEY}
    navigate={(to) => window.location.href = to}
    afterSignInUrl="/dashboard"
    afterSignUpUrl="/"
    signInUrl="/sign-in"
    signUpUrl="/sign-up"
    appearance={{
      baseTheme: undefined,
      variables: {
        colorBackground: "white",
        colorInputBackground: "white",
        colorAlphaShade: "black",
      },
    }}
    allowedRedirectOrigins={allowedUrls}
  >
    <AuthProvider>
      <App />
    </AuthProvider>
  </ClerkProvider>
);
