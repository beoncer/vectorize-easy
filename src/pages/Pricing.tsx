
import React from 'react';
import PricingCard from '../components/PricingCard';

// Pricing data
const pricingPlans = [
  {
    title: 'Free',
    price: '$0',
    description: 'Perfect for trying out our services',
    features: [
      { text: '3 conversions per day', included: true },
      { text: 'Basic quality vectors', included: true },
      { text: 'SVG export format', included: true },
      { text: 'Max 5MB file size', included: true },
      { text: 'Standard processing speed', included: true },
      { text: 'Advanced editing tools', included: false },
      { text: 'Batch processing', included: false },
      { text: 'Commercial usage rights', included: false }
    ],
    buttonText: 'Start Free',
    isPopular: false
  },
  {
    title: 'Pro',
    price: '$19',
    description: 'Best for individuals and small teams',
    features: [
      { text: 'Unlimited conversions', included: true },
      { text: 'High-quality vectors', included: true },
      { text: 'All export formats', included: true },
      { text: 'Max 20MB file size', included: true },
      { text: 'Priority processing', included: true },
      { text: 'Advanced editing tools', included: true },
      { text: 'Batch processing', included: true },
      { text: 'Commercial usage rights', included: true }
    ],
    buttonText: 'Subscribe Now',
    isPopular: true
  },
  {
    title: 'Enterprise',
    price: 'Custom',
    description: 'For large teams and organizations',
    features: [
      { text: 'Everything in Pro plan', included: true },
      { text: 'Unlimited team members', included: true },
      { text: 'Max 35MB file size', included: true },
      { text: 'Dedicated support', included: true },
      { text: 'API access', included: true },
      { text: 'Custom integration', included: true },
      { text: 'SLA guarantee', included: true },
      { text: 'Custom branding', included: true }
    ],
    buttonText: 'Contact Sales',
    isPopular: false
  }
];

const Pricing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-tovector-black to-tovector-darkgray py-24">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-tovector-white mb-4">
            Simple, Transparent <span className="text-tovector-red">Pricing</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Choose the plan that's right for you. All plans include a 7-day trial period with no credit card required.
          </p>
          <div className="w-20 h-1 bg-tovector-red mx-auto mt-6"></div>
        </div>
        
        {/* Toggle Annual/Monthly */}
        <div className="flex justify-center mb-12">
          <div className="bg-tovector-black/50 backdrop-blur-sm p-1 rounded-full inline-flex">
            <button className="px-6 py-2 rounded-full bg-tovector-red text-tovector-white font-medium">
              Monthly
            </button>
            <button className="px-6 py-2 rounded-full text-gray-300 font-medium">
              Annual (Save 20%)
            </button>
          </div>
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
              index={index}
            />
          ))}
        </div>
        
        {/* FAQ Section */}
        <div className="mt-24 text-center">
          <h2 className="text-2xl font-bold text-tovector-white mb-6">
            Have questions about our pricing?
          </h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
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
