
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

createRoot(document.getElementById("root")!).render(
  <ClerkProvider
    publishableKey={PUBLISHABLE_KEY}
    navigate={(to) => window.location.href = to}
    afterSignInUrl="/dashboard"
    afterSignUpUrl="/dashboard"
    signInUrl="/sign-in"
    signUpUrl="/sign-up"
    appearance={{
      baseTheme: undefined,
      variables: {
        colorBackground: "white",
        colorInputBackground: "white",
        colorAlphaShade: "black",
        colorPrimary: "#ff0000"  // Using tovector red as primary color
      },
      elements: {
        formButtonPrimary: "bg-tovector-red text-black hover:bg-tovector-red/90",
        footerActionLink: "text-tovector-red hover:text-tovector-red/90"
      }
    }}
  >
    <AuthProvider>
      <App />
    </AuthProvider>
  </ClerkProvider>
);
