
import React, { useState } from 'react';
import FAQItem from '../components/FAQItem';

// FAQ data
const faqItems = [
  {
    question: 'What file formats can I upload?',
    answer: 'We currently support PNG and JPG/JPEG formats for vectorization. We recommend using high-resolution images for the best results. The maximum file size is 35MB.'
  },
  {
    question: 'How long does the vectorization process take?',
    answer: 'Most images are processed within seconds, but complex images may take up to a minute. Pro and Enterprise plans receive priority processing for faster results.'
  },
  {
    question: 'What vector formats can I export to?',
    answer: 'Free users can export to SVG format only. Pro and Enterprise users can export to SVG, EPS, AI (Adobe Illustrator), PDF, and DXF formats.'
  },
  {
    question: 'How accurate is the vectorization?',
    answer: 'Our AI-powered engine delivers industry-leading accuracy. The quality depends on the input image - clearer images with good contrast will produce better results. Pro users get access to enhanced algorithms for higher quality output.'
  },
  {
    question: 'Can I use the vectors commercially?',
    answer: 'Free users can use vectors for personal projects only. Pro and Enterprise plans include commercial usage rights, allowing you to use the vectors in commercial products, client work, and merchandise.'
  },
  {
    question: 'Do you offer refunds?',
    answer: "Yes, we offer a 30-day money-back guarantee for Pro subscriptions if you're not satisfied with our service. Enterprise plans have custom refund policies specified in the contract."
  },
  {
    question: 'Is there an API available for integration?',
    answer: 'Yes, API access is available for Enterprise plans only. This allows you to integrate our vectorization technology directly into your workflow or application. Contact our sales team for details.'
  }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  
  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-tovector-black to-tovector-darkgray py-24">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-tovector-white mb-4">
            Frequently Asked <span className="text-tovector-red">Questions</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Find answers to the most common questions about tovector.ai and our vectorization service.
          </p>
          <div className="w-20 h-1 bg-tovector-red mx-auto mt-6"></div>
        </div>
        
        {/* FAQ List */}
        <div className="max-w-3xl mx-auto divide-y divide-gray-800 rounded-lg overflow-hidden">
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
          <h2 className="text-2xl font-bold text-tovector-white mb-4">
            Still have questions?
          </h2>
          <p className="text-gray-300 mb-6">
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
