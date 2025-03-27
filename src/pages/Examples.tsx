
import React from 'react';
import ExampleCard from '../components/ExampleCard';

// Sample data
const examples = [
  {
    beforeImage: 'https://images.unsplash.com/photo-1572177812156-58036aae439c?q=80&w=800&h=600&auto=format&fit=crop',
    afterImage: 'https://d2jq2hx2dbkw6t.cloudfront.net/625/vector-trace-of-dog.JPG',
    title: 'Pet Portraits',
    description: 'Transform your pet photos into clean vector art that can be used for logos, merchandise, and more.'
  },
  {
    beforeImage: 'https://images.unsplash.com/photo-1519052537078-e6302a4968d4?q=80&w=800&h=600&auto=format&fit=crop',
    afterImage: 'https://d2jq2hx2dbkw6t.cloudfront.net/625/vector-trace-of-cat.jpg',
    title: 'Wildlife',
    description: 'Convert detailed wildlife photos into scalable vectors with precision and accuracy.'
  },
  {
    beforeImage: 'https://images.unsplash.com/photo-1598128558393-70ff21433be0?q=80&w=800&h=600&auto=format&fit=crop',
    afterImage: 'https://d2jq2hx2dbkw6t.cloudfront.net/625/vector-trace-of-scenery.jpg',
    title: 'Landscapes',
    description: 'Turn beautiful landscapes into vector art perfect for backgrounds and environmental design.'
  },
  {
    beforeImage: 'https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?q=80&w=800&h=600&auto=format&fit=crop',
    afterImage: 'https://d2jq2hx2dbkw6t.cloudfront.net/625/vector-trace-of-flower.jpg',
    title: 'Botanical',
    description: 'Create stunning vector illustrations from botanical photos for print design or digital art.'
  },
  {
    beforeImage: 'https://images.unsplash.com/photo-1592621385612-4d7129426394?q=80&w=800&h=600&auto=format&fit=crop',
    afterImage: 'https://d2jq2hx2dbkw6t.cloudfront.net/625/vector-trace-of-logo.jpg',
    title: 'Logos & Branding',
    description: 'Vectorize your hand-drawn logo sketches for professional branding materials.'
  },
  {
    beforeImage: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?q=80&w=800&h=600&auto=format&fit=crop',
    afterImage: 'https://d2jq2hx2dbkw6t.cloudfront.net/625/vector-trace-of-building.jpg',
    title: 'Architecture',
    description: 'Convert architectural photos into clean line art for presentations and technical drawings.'
  }
];

const Examples = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-tovector-black to-tovector-darkgray">
      <div className="container mx-auto px-6 py-24">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-tovector-white mb-4">
            See The <span className="text-tovector-red">Results</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Check out these impressive before and after examples of our vectorization technology. 
            Hover over each image to see the transformation.
          </p>
          <div className="w-20 h-1 bg-tovector-red mx-auto mt-6"></div>
        </div>
        
        {/* Examples Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {examples.map((example, index) => (
            <ExampleCard
              key={index}
              beforeImage={example.beforeImage}
              afterImage={example.afterImage}
              title={example.title}
              description={example.description}
              index={index}
            />
          ))}
        </div>
        
        {/* CTA Section */}
        <div className="mt-20 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-tovector-white mb-6">
            Ready to create your own vectors?
          </h2>
          <a href="/" className="btn-primary inline-flex items-center">
            Try It Yourself
            <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Examples;
