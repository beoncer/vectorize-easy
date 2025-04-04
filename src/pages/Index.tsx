
import React from 'react';
import { ArrowRight, Star } from 'lucide-react';
import FileUploader from '../components/FileUploader';
import { Link } from 'react-router-dom';

// New component for testimonials
const Testimonial = ({ quote, name, stars }: { quote: string; name: string; stars: number }) => (
  <div className="bg-white rounded-lg shadow-md p-6 flex flex-col h-full">
    <p className="text-lg mb-4 flex-grow">"{quote}"</p>
    <div>
      <div className="flex text-tovector-red mb-2">
        {[...Array(stars)].map((_, i) => (
          <Star key={i} fill="#FF3A46" size={18} />
        ))}
      </div>
      <p className="font-medium">{name}</p>
    </div>
  </div>
);

const Index = () => {
  // Testimonial data
  const testimonials = [
    {
      quote: "Transformed my logo design in seconds! The vector quality is outstanding.",
      name: "John D.",
      stars: 5
    },
    {
      quote: "Perfect for my illustrations. I can now scale them to any size without losing quality.",
      name: "Sarah K.",
      stars: 5
    },
    {
      quote: "So easy to use! I've tried other vectorization tools but none are as fast and accurate as tovector.",
      name: "Mike P.",
      stars: 5
    }
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white text-black min-h-[90vh] flex items-center">
        <div className="container mx-auto px-6 py-24 z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight animate-fade-in">
              Convert Your Images to <span className="text-tovector-red">Vectors</span> Instantly
            </h1>
            <p className="text-lg md:text-xl text-gray-700 mb-10 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Upload your PNG or JPG and get high-quality vectors in seconds. Perfect for designers, developers, and creatives.
            </p>
            
            <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <FileUploader />
            </div>
          </div>
        </div>
        
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-tovector-red to-white"></div>
          <div className="absolute inset-0" style={{ 
            backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(0, 0, 0, 0.2) 2px, transparent 0)', 
            backgroundSize: '50px 50px' 
          }}></div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What Our <span className="text-tovector-red">Users Say</span>
            </h2>
            <div className="w-20 h-1 bg-tovector-red mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Testimonial 
                key={index}
                quote={testimonial.quote}
                name={testimonial.name}
                stars={testimonial.stars}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose <span className="text-tovector-red">tovector.ai</span>
            </h2>
            <div className="w-20 h-1 bg-tovector-red mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Feature 1 */}
            <div className="text-center p-6 transition-transform duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-tovector-red/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-tovector-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Lightning Fast</h3>
              <p className="text-gray-700">
                Get your vectors in seconds, not minutes or hours. Our AI-powered engine works at lightning speed.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="text-center p-6 transition-transform duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-tovector-red/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-tovector-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">High Quality</h3>
              <p className="text-gray-700">
                Our advanced algorithms ensure clean, precise vectors with perfect curves and edges.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="text-center p-6 transition-transform duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-tovector-red/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-tovector-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Multiple Formats</h3>
              <p className="text-gray-700">
                Export your vectors in SVG, EPS, AI, and other popular formats for use in any design software.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gray-50 text-black py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to transform your images?
          </h2>
          <p className="text-xl text-gray-700 mb-10 max-w-2xl mx-auto">
            Join thousands of designers and illustrators who are saving time with tovector.ai
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/examples" className="btn-secondary min-w-[160px] px-6 py-3 text-center">
              See Examples
            </Link>
            <Link to="/pricing" className="btn-primary min-w-[160px] px-6 py-3 text-center flex items-center justify-center">
              Get Started <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
