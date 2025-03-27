
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen?: boolean;
  toggleOpen?: () => void;
  index: number;
}

const FAQItem: React.FC<FAQItemProps> = ({ 
  question, 
  answer, 
  isOpen = false, 
  toggleOpen,
  index
}) => {
  const [internalOpen, setInternalOpen] = useState(isOpen);
  const isEven = index % 2 === 0;
  
  const handleToggle = () => {
    if (toggleOpen) {
      toggleOpen();
    } else {
      setInternalOpen(!internalOpen);
    }
  };

  const open = toggleOpen ? isOpen : internalOpen;

  return (
    <div className={`transition-all duration-300 overflow-hidden
      ${isEven ? 'bg-tovector-white' : 'bg-tovector-black'}
      ${open ? 'shadow-md' : 'hover:shadow-sm'}`}
    >
      <button
        className="w-full text-left px-6 py-5 flex justify-between items-center"
        onClick={handleToggle}
        aria-expanded={open}
      >
        <h3 className={`font-medium text-lg ${isEven ? 'text-tovector-black' : 'text-tovector-white'}`}>
          {question}
        </h3>
        {open ? (
          <ChevronUp className={`flex-shrink-0 ml-2 ${isEven ? 'text-tovector-red' : 'text-tovector-red'}`} />
        ) : (
          <ChevronDown className={`flex-shrink-0 ml-2 ${isEven ? 'text-tovector-red' : 'text-tovector-red'}`} />
        )}
      </button>

      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out
        ${open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="px-6 pb-5">
          <div className="w-12 h-0.5 bg-tovector-red mb-4"></div>
          <p className={`text-sm ${isEven ? 'text-gray-700' : 'text-gray-300'}`}>
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FAQItem;
