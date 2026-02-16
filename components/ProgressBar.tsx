
import React from 'react';

interface ProgressBarProps {
  status: string;
  message: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ status, message }) => {
  const getProgressWidth = () => {
    switch (status) {
      case 'generating-image': return '33%';
      case 'generating-3d': return '66%';
      case 'completed': return '100%';
      default: return '0%';
    }
  };

  return (
    <div className="w-full mt-6">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-blue-400 uppercase tracking-wider">{message}</span>
        <span className="text-sm font-medium text-blue-400">{getProgressWidth()}</span>
      </div>
      <div className="w-full bg-slate-800 rounded-full h-2.5">
        <div 
          className="bg-blue-500 h-2.5 rounded-full transition-all duration-500 ease-out" 
          style={{ width: getProgressWidth() }}
        ></div>
      </div>
    </div>
  );
};
