import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="text-center">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full animate-pulse"></div>
          </div>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading NumenCoach</h2>
        <p className="text-gray-600">Preparing your numerology experience...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;