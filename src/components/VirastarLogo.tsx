import React from 'react';

interface VirastarLogoProps {
  className?: string;
  size?: number;
}

export const VirastarLogo: React.FC<VirastarLogoProps> = ({ className = '', size = 40 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      id="virastar-custom-logo"
    >
      {/* 
        This path represents the highly precise stylized "V" / "و" logo of Virastar.
        It is rendered as a solid filled shape that matches the brand's primary/accent color perfectly.
      */}
      <path
        d="M 28,38 
           C 33,37 41,37 47,38 
           C 47,38 39,40 35,43 
           C 33,48 41,56 47,56 
           C 51,56 53,49 55,41 
           C 59,29 64,22 71,22 
           C 77,22 81,26 79,33 
           C 76,43 67,55 59,64 
           C 54,70 47,72 41,67 
           C 33,60 27,48 28,38 Z"
        fill="currentColor"
        id="logo-path"
      />
    </svg>
  );
};
