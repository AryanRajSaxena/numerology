import React from 'react';

interface NumberCardProps {
  label: string;
  value: number;
  summary: string;
}

const NumberCard: React.FC<NumberCardProps> = ({ label, value, summary }) => {
  const isMaster = value === 11 || value === 22 || value === 33;
  
  return (
    <div className={`p-6 rounded-2xl border-2 transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer group ${
      isMaster 
        ? 'bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 border-amber-300 hover:border-amber-400' 
        : 'bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 border-indigo-300 hover:border-indigo-400'
    }`}>
      <div className="text-center">
        <div className={`text-3xl font-bold mb-2 transition-colors group-hover:scale-110 transform duration-200 ${
          isMaster ? 'text-amber-700 group-hover:text-amber-800' : 'text-indigo-700 group-hover:text-indigo-800'
        }`}>
          {value}
        </div>
        <div className={`text-sm font-semibold mb-3 ${
          isMaster ? 'text-amber-600' : 'text-indigo-600'
        }`}>
          {label}
          {isMaster && <span className="ml-1 text-yellow-500">✨</span>}
        </div>
        <div className="text-xs text-gray-700 leading-relaxed">
          {summary}
        </div>
      </div>
    </div>
  );
};

export default NumberCard;