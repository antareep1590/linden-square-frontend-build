
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
    <div className={`flex items-center ${className}`}>
      <img 
        src="/lovable-uploads/72be48e2-c577-404f-8ce2-d99f837322ac.png" 
        alt="Linden Square" 
        className={`${sizeClasses[size]} object-contain`}
        onError={(e) => {
          console.error('Logo failed to load:', e);
          // Fallback text if image fails to load
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          target.parentElement!.innerHTML = '<span class="font-bold text-linden-blue">Linden Square</span>';
        }}
      />
    </div>
  );
};

export default LindenSquareLogo;
