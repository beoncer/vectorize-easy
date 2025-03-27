
import React, { useState } from 'react';
import FAQItem from '../components/FAQItem';

// FAQ data
const faqItems = [
  {
    question: 'What file types are supported?',
    answer: 'PNG and JPG files up to 35MB. For best results, we recommend using high-resolution images with clear edges.'
  },
  {
    question: 'How many credits do I need?',
    answer: 'One credit per conversion. Each successful vectorization consumes one credit from your account.'
  },
  {
    question: 'What vector formats can I download?',
    answer: 'All users can download SVG files. Premium users can also access EPS, AI, and PDF formats.'
  },
  {
    question: 'How accurate is the vectorization?',
    answer: 'Our AI-powered engine delivers industry-leading accuracy. The quality depends on the input image - clearer images with good contrast will produce better results.'
  },
  {
    question: 'Can I use the vectors commercially?',
    answer: 'Yes, all vectors created with tovector.ai are license-free and can be used for both personal and commercial projects.'
  }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  
  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white py-24">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
            Frequently Asked <span className="text-tovector-red">Questions</span>
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Find answers to the most common questions about tovector.ai and our vectorization service.
          </p>
          <div className="w-20 h-1 bg-tovector-red mx-auto mt-6"></div>
        </div>
        
        {/* FAQ List */}
        <div className="max-w-3xl mx-auto divide-y divide-gray-200 rounded-lg overflow-hidden">
          {faqItems.map((item, index) => (
            <FAQItem
              key={index}
              question={item.question}
              answer={item.answer}
              isOpen={openIndex === index}
              toggleOpen={() => toggleFAQ(index)}
              index={index}
            />
          ))}
        </div>
        
        {/* Contact Section */}
        <div className="text-center mt-16">
          <h2 className="text-2xl font-bold text-black mb-4">
            Still have questions?
          </h2>
          <p className="text-gray-700 mb-6">
            Can't find the answer you're looking for? Please contact our support team.
          </p>
          <a href="/support" className="btn-primary inline-flex items-center">
            Get in Touch
            <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
