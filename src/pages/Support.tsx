
import React from 'react';
import ContactForm from '../components/ContactForm';

const Support = () => {
  return (
    <div className="min-h-screen bg-white py-24">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
            We're Here to <span className="text-tovector-red">Help</span>
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Have a question or need assistance? Our support team is ready to help you.
          </p>
          <div className="w-20 h-1 bg-tovector-red mx-auto mt-6"></div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <div>
            <ContactForm />
          </div>
          
          {/* Support Information */}
          <div className="bg-white text-black rounded-xl overflow-hidden shadow-md border border-gray-200">
            <div className="p-8">
              <h2 className="text-2xl font-bold mb-6">Support Information</h2>
              
              <div className="space-y-8">
                {/* Support Hours */}
                <div>
                  <h3 className="font-bold text-lg mb-2">Support Hours</h3>
                  <div className="space-y-2 text-gray-600">
                    <p>Monday - Friday: 9:00 AM - 6:00 PM EST</p>
                    <p>Saturday: 10:00 AM - 4:00 PM EST</p>
                    <p>Sunday: Closed</p>
                  </div>
                </div>
                
                {/* Contact Methods */}
                <div>
                  <h3 className="font-bold text-lg mb-2">Contact Methods</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <svg className="w-6 h-6 text-tovector-red mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <div>
                        <p className="font-medium">Email</p>
                        <a href="mailto:support@tovector.ai" className="text-tovector-red hover:underline">
                          support@tovector.ai
                        </a>
                        <p className="text-gray-600 mt-1">
                          We'll get back to you within 24 hours
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* FAQ Link */}
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                  <h3 className="font-bold text-lg mb-2">
                    Check our FAQ
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Find quick answers to common questions in our frequently asked questions section.
                  </p>
                  <a 
                    href="/faq" 
                    className="inline-flex items-center font-medium text-tovector-red hover:underline"
                  >
                    View FAQ
                    <svg className="ml-1 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
