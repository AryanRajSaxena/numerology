import React from 'react';

interface NumberCardProps {
  label: string;
  value: number;
  summary: string;
}

const NumberCard: React.FC<NumberCardProps> = ({ label, value, summary }) => {
  const isMaster = value === 11 || value === 22 || value === 33;
  
  return (
    <div className={`p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-md ${
      isMaster 
        ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-orange-200' 
        : 'bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200'
    }`}>
      <div className="text-center">
        <div className={`text-2xl font-bold mb-1 ${
          isMaster ? 'text-orange-700' : 'text-indigo-700'
        }`}>
          {value}
        </div>
        <div className={`text-xs font-medium mb-2 ${
          isMaster ? 'text-orange-600' : 'text-indigo-600'
        }`}>
          {label}
          {isMaster && <span className="ml-1">✨</span>}
        </div>
        <div className="text-xs text-gray-600 leading-tight">
          {summary}
        </div>
      </div>
    </div>
  );
};

export default NumberCard;