
import React from 'react';
import { Check } from 'lucide-react';

interface PricingFeature {
  text: string;
  included: boolean;
}

interface PricingCardProps {
  title: string;
  price: string;
  description: string;
  features: PricingFeature[];
  isPopular?: boolean;
  buttonText: string;
  index: number;
}

const PricingCard: React.FC<PricingCardProps> = ({
  title,
  price,
  description,
  features,
  isPopular = false,
  buttonText,
  index
}) => {
  const isEven = index % 2 === 0;

  return (
    <div className={`relative rounded-2xl overflow-hidden transition-all duration-300 h-full flex flex-col ${
      isPopular ? 'shadow-xl scale-105 z-10' : 'shadow-md hover:shadow-lg'
    } ${isEven ? 'bg-tovector-white' : 'bg-tovector-black'}`}
    >
      {isPopular && (
        <div className="absolute top-0 inset-x-0 text-center text-sm font-medium text-tovector-white bg-tovector-red py-1.5">
          Most Popular
        </div>
      )}
      
      <div className={`p-8 ${isPopular ? 'pt-12' : ''}`}>
        <h3 className={`text-xl font-bold ${isEven ? 'text-tovector-black' : 'text-tovector-white'}`}>
          {title}
        </h3>
        
        <div className="mt-4 flex items-baseline">
          <span className={`text-4xl font-extrabold tracking-tight ${isEven ? 'text-tovector-black' : 'text-tovector-white'}`}>
            {price}
          </span>
          {price !== 'Custom' && (
            <span className={`ml-1 text-xl font-medium ${isEven ? 'text-gray-500' : 'text-gray-400'}`}>
              /month
            </span>
          )}
        </div>
        
        <p className={`mt-2 text-sm ${isEven ? 'text-gray-500' : 'text-gray-400'}`}>
          {description}
        </p>
        
        <ul className="mt-6 space-y-4">
          {features.map((feature, i) => (
            <li key={i} className="flex items-start">
              <Check 
                size={20} 
                className={`flex-shrink-0 ${
                  feature.included 
                    ? 'text-tovector-red' 
                    : isEven ? 'text-gray-300' : 'text-gray-700'
                }`} 
              />
              <span 
                className={`ml-3 text-sm ${
                  isEven 
                    ? feature.included ? 'text-gray-700' : 'text-gray-400' 
                    : feature.included ? 'text-gray-200' : 'text-gray-600'
                }`}
              >
                {feature.text}
              </span>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="mt-auto p-8 pt-0">
        <button 
          className={`w-full py-3 px-4 rounded-md text-tovector-white font-medium transition-colors ${
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

export default PricingCard;
