
import React from 'react';
import { Check } from 'lucide-react';

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
    buttonText: 'Select Plan',
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
    buttonText: 'Select Plan',
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
    buttonText: 'Select Plan',
    isPopular: false
  }
];

const PricingCard = ({ 
  title, 
  price, 
  description, 
  features, 
  buttonText, 
  isPopular 
}: {
  title: string;
  price: string;
  description: string;
  features: { text: string; included: boolean }[];
  buttonText: string;
  isPopular: boolean;
}) => {
  return (
    <div className={`relative rounded-2xl overflow-hidden transition-all duration-300 h-full flex flex-col bg-white border ${
      isPopular ? 'shadow-xl scale-105 z-10 border-tovector-red' : 'shadow-md hover:shadow-lg border-gray-200'
    }`}
    >
      {isPopular && (
        <div className="absolute top-0 inset-x-0 text-center text-sm font-medium text-black bg-tovector-red py-1.5">
          Most Popular
        </div>
      )}
      
      <div className={`p-8 ${isPopular ? 'pt-12' : ''}`}>
        <h3 className="text-xl font-bold text-black">
          {title}
        </h3>
        
        <div className="mt-4 flex items-baseline">
          <span className="text-4xl font-extrabold tracking-tight text-black">
            {price}
          </span>
        </div>
        
        <p className="mt-2 text-sm text-gray-500">
          {description}
        </p>
        
        <ul className="mt-6 space-y-4">
          {features.map((feature, i) => (
            <li key={i} className="flex items-start">
              <Check 
                size={20} 
                className="flex-shrink-0 text-tovector-red"
              />
              <span className="ml-3 text-sm text-gray-700">
                {feature.text}
              </span>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="mt-auto p-8 pt-0">
        <button 
          className={`w-full py-3 px-4 rounded-md text-black font-medium transition-colors ${
            isPopular 
              ? 'bg-tovector-red hover:bg-tovector-red/90'
              : 'bg-tovector-red/90 hover:bg-tovector-red'
          }`}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

const Pricing = () => {
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
        
        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <PricingCard
              key={index}
              title={plan.title}
              price={plan.price}
              description={plan.description}
              features={plan.features}
              buttonText={plan.buttonText}
              isPopular={plan.isPopular}
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
            <a href="/faq" className="btn-secondary">
              View FAQ
            </a>
            <a href="/support" className="btn-primary">
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
