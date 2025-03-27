
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// New simplified example data
const examples = [
  {
    title: 'Logo',
    beforeImage: 'https://images.unsplash.com/photo-1572177812156-58036aae439c?q=80&w=800&h=600&auto=format&fit=crop',
    afterImage: 'https://d2jq2hx2dbkw6t.cloudfront.net/625/vector-trace-of-dog.JPG',
    description: 'Transform your logos into clean vector art for perfect scalability. Ideal for branding materials and marketing collateral.'
  },
  {
    title: 'Illustration',
    beforeImage: 'https://images.unsplash.com/photo-1519052537078-e6302a4968d4?q=80&w=800&h=600&auto=format&fit=crop',
    afterImage: 'https://d2jq2hx2dbkw6t.cloudfront.net/625/vector-trace-of-cat.jpg',
    description: 'Convert detailed illustrations into scalable vectors with precision and accuracy. Perfect for print and digital media.'
  },
  {
    title: 'Photo',
    beforeImage: 'https://images.unsplash.com/photo-1598128558393-70ff21433be0?q=80&w=800&h=600&auto=format&fit=crop',
    afterImage: 'https://d2jq2hx2dbkw6t.cloudfront.net/625/vector-trace-of-scenery.jpg',
    description: 'Turn photographs into vector art ideal for artistic projects, backgrounds and environmental design.'
  }
];

// New component for each example
const ExampleItem = ({ 
  title, 
  beforeImage, 
  afterImage, 
  description 
}: { 
  title: string; 
  beforeImage: string; 
  afterImage: string; 
  description: string;
}) => {
  const [isAfterVisible, setIsAfterVisible] = useState(false);
  
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden mb-12">
      <h3 className="text-2xl font-bold text-tovector-red p-6">
        {title}
      </h3>
      
      <div className="flex flex-col md:flex-row">
        <div className="relative md:w-1/2 h-72">
          <div className="absolute top-4 left-4 bg-black/70 text-white text-sm px-3 py-1 rounded-full">
            Before
          </div>
          <img 
            src={beforeImage} 
            alt={`Before - ${title}`}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="relative md:w-1/2 h-72">
          <div className="absolute top-4 left-4 bg-tovector-red text-black text-sm px-3 py-1 rounded-full">
            After
          </div>
          <img 
            src={afterImage} 
            alt={`After - ${title}`}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      
      <div className="p-6">
        <p className="text-black">{description}</p>
      </div>
    </div>
  );
};

const Examples = () => {
  return (
    <div className="bg-white min-h-screen py-24">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
            See The <span className="text-tovector-red">Results</span>
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Check out these impressive before and after examples of our vectorization technology.
          </p>
          <div className="w-20 h-1 bg-tovector-red mx-auto mt-6"></div>
        </div>
        
        {/* Examples */}
        <div className="max-w-4xl mx-auto">
          {examples.map((example, index) => (
            <ExampleItem
              key={index}
              title={example.title}
              beforeImage={example.beforeImage}
              afterImage={example.afterImage}
              description={example.description}
            />
          ))}
        </div>
        
        {/* CTA Section */}
        <div className="mt-20 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-black mb-6">
            Ready to create your own vectors?
          </h2>
          <Link to="/" className="btn-primary inline-flex items-center">
            Try It Yourself
            <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Examples;
