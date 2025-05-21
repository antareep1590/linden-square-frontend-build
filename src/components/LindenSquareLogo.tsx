
import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

const LindenSquareLogo: React.FC<LogoProps> = ({ 
  className = '', 
  size = 'medium' 
}) => {
  const sizeClasses = {
    small: 'h-8',
    medium: 'h-12',
    large: 'h-16'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <img 
        src="/lovable-uploads/72be48e2-c577-404f-8ce2-d99f837322ac.png" 
        alt="Linden Square" 
        className={`${sizeClasses[size]}`} 
      />
    </div>
  );
};

export default LindenSquareLogo;
