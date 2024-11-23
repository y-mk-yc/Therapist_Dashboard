import React from 'react';

interface MarkerProps {
  top: string;
  left: string;
}

export const Marker: React.FC<MarkerProps> = ({ top, left }) => {
  return (
    <div className="absolute pointer-events-none" style={{ top, left }}>
      <div className="w-5 h-5 bg-red-500 rounded-full opacity-65"></div>
    </div>
  );
};
