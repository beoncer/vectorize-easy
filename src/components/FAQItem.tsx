
import React from 'react';
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
  const open = toggleOpen ? isOpen : false;

  return (
    <div className="transition-all duration-300 overflow-hidden bg-white border-gray-200">
      <button
        className="w-full text-left px-6 py-5 flex justify-between items-center"
        onClick={toggleOpen}
        aria-expanded={open}
      >
        <h3 className="font-bold text-lg text-tovector-red">
          {question}
        </h3>
        {open ? (
          <ChevronUp className="flex-shrink-0 ml-2 text-tovector-red" />
        ) : (
          <ChevronDown className="flex-shrink-0 ml-2 text-tovector-red" />
        )}
      </button>

      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out
        ${open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="px-6 pb-5">
          <div className="w-12 h-0.5 bg-tovector-red mb-4"></div>
          <p className="text-black">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FAQItem;
