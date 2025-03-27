
import React, { useState } from 'react';

interface ExampleCardProps {
  beforeImage: string;
  afterImage: string;
  title: string;
  description: string;
  index: number;
}

const ExampleCard: React.FC<ExampleCardProps> = ({ 
  beforeImage, 
  afterImage, 
  title, 
  description,
  index
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const isEven = index % 2 === 0;

  return (
    <div 
      className={`rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-500 transform hover:-translate-y-1 ${
        isEven ? 'bg-tovector-white' : 'bg-tovector-black'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-64 overflow-hidden">
        {/* Before Image */}
        <img 
          src={beforeImage} 
          alt={`Before - ${title}`} 
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
            isHovered ? 'opacity-0' : 'opacity-100'
          }`}
        />
        
        {/* After Image */}
        <img 
          src={afterImage} 
          alt={`After - ${title}`} 
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        />
        
        {/* Hover Overlay */}
        <div className={`absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <span className="text-tovector-white text-lg font-medium">
            {isHovered ? 'After' : 'Before'}
          </span>
        </div>
        
        {/* "Hover to see" text */}
        <div className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300 ${
          isHovered ? 'opacity-0' : 'opacity-100'
        }`}>
          <span className="bg-tovector-black/70 text-tovector-white text-sm px-3 py-1 rounded-full backdrop-blur-sm">
            Hover to see result
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className={`text-xl font-bold ${isEven ? 'text-tovector-black' : 'text-tovector-white'}`}>
          {title}
        </h3>
        <div className="w-12 h-1 bg-tovector-red mt-2 mb-4"></div>
        <p className={`text-sm ${isEven ? 'text-gray-700' : 'text-gray-300'}`}>
          {description}
        </p>
      </div>
    </div>
  );
};

export default ExampleCard;
