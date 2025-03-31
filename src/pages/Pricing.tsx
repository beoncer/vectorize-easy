import React from 'react';
import { Check } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

// New pricing data
const pricingPlans = [
  {
    title: '10 Credits',
    price: '$12.99',
    description: 'Perfect for occasional use',
    features: [
      { text: '10 image conversions', included: true },
      { text: 'High quality vectors', included: true },
      { text: 'All export formats', included: true },
      { text: 'Max 20MB file size', included: true },
      { text: 'Credits never expire', included: true },
      { text: 'Basic support', included: true },
      { text: 'Commercial usage rights', included: true }
    ],
    credits: 10,
    isPopular: false
  },
  {
    title: '25 Credits',
    price: '$24.99',
    description: 'Best value for most users',
    features: [
      { text: '25 image conversions', included: true },
      { text: 'High quality vectors', included: true },
      { text: 'All export formats', included: true },
      { text: 'Max 25MB file size', included: true },
      { text: 'Credits never expire', included: true },
      { text: 'Priority support', included: true },
      { text: 'Commercial usage rights', included: true }
    ],
    credits: 25,
    isPopular: true
  },
  {
    title: '50 Credits',
    price: '$39.99',
    description: 'For professionals and teams',
    features: [
      { text: '50 image conversions', included: true },
      { text: 'Highest quality vectors', included: true },
      { text: 'All export formats', included: true },
      { text: 'Max 35MB file size', included: true },
      { text: 'Credits never expire', included: true },
      { text: 'Premium support', included: true },
      { text: 'Commercial usage rights', included: true }
    ],
    credits: 50,
    isPopular: false
  }
];

const PricingCard = ({ 
  plan,
  isLoggedIn,
  onSelect
}: {
  plan: typeof pricingPlans[0],
  isLoggedIn: boolean,
  onSelect: (credits: number) => void
}) => (
  <div className={`relative rounded-2xl h-full flex flex-col bg-white border ${
    plan.isPopular ? 'shadow-xl scale-105 border-tovector-red' : 'shadow-md border-gray-200'
  }`}>
    {plan.isPopular && (
      <div className="absolute top-0 inset-x-0 text-center text-sm font-medium text-black bg-tovector-red py-1.5">
        Most Popular
      </div>
    )}
    
    <div className={`p-8 ${plan.isPopular ? 'pt-12' : ''}`}>
      <h3 className="text-xl font-bold text-black">{plan.title}</h3>
      <div className="mt-4">
        <span className="text-4xl font-extrabold text-black">{plan.price}</span>
      </div>
      <p className="mt-2 text-sm text-gray-500">{plan.description}</p>
      
      <ul className="mt-6 space-y-4">
        {plan.features.map((feature, i) => (
          <li key={i} className="flex items-start">
            <Check size={20} className="flex-shrink-0 text-tovector-red" />
            <span className="ml-3 text-sm text-gray-700">{feature.text}</span>
          </li>
        ))}
      </ul>
    </div>
    
    <div className="mt-auto p-8 pt-0">
      {isLoggedIn ? (
        <button 
          onClick={() => onSelect(plan.credits)}
          className="w-full py-3 px-4 rounded-md text-black font-medium bg-tovector-red hover:bg-tovector-red/90 cursor-pointer"
        >
          Purchase Credits
        </button>
      ) : (
        <div className="flex items-center space-x-4">
          <Link to="/sign-up">
            <Button className="bg-tovector-red text-black hover:bg-tovector-red/90">
              Select Plan
            </Button>
          </Link>
        </div>
      )}
    </div>
  </div>
);

const Pricing = () => {
  const { userId } = useAuth();
  const navigate = useNavigate();

  const handleSelectPlan = (credits: number) => {
    console.log('handleSelectPlan called with credits:', credits);
    navigate(`/purchase?credits=${credits}`);
  };

  return (
    <div className="min-h-screen bg-white py-24">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
            Simple, Transparent <span className="text-tovector-red">Pricing</span>
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Choose the plan that's right for you. Pay only for what you need with our credit-based system.
          </p>
          <div className="w-20 h-1 bg-tovector-red mx-auto mt-6"></div>
        </div>

        {/* Test button outside pricing cards */}
        <div className="text-center mb-8">
          <Link to="/sign-up">
            <Button className="bg-tovector-red text-black hover:bg-tovector-red/90">
              Test Sign Up Button
            </Button>
          </Link>
        </div>
        
        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <PricingCard
              key={index}
              plan={plan}
              isLoggedIn={!!userId}
              onSelect={handleSelectPlan}
            />
          ))}
        </div>
        
        {/* FAQ Section */}
        <div className="mt-24 text-center">
          <h2 className="text-2xl font-bold text-black mb-6">
            Have questions about our pricing?
          </h2>
          <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
            Check out our FAQ section for more information or contact our support team for personalized assistance.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/faq" className="btn-secondary">
              View FAQ
            </Link>
            <Link to="/support" className="btn-primary">
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
