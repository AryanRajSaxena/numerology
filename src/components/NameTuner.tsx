import React from 'react';
import { Lightbulb, ArrowUpDown } from 'lucide-react';
import { generateNameSuggestions } from '../utils/numerology';

interface NameTunerProps {
  profile: any;
  currentExpression: number;
}

const NameTuner: React.FC<NameTunerProps> = ({ profile, currentExpression }) => {
  const suggestions = generateNameSuggestions(profile.fullName, profile.system, profile.preserveMasters);

  if (suggestions.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <div className="flex items-center space-x-3 mb-4">
        <div className="bg-yellow-100 p-2 rounded-lg">
          <Lightbulb className="h-5 w-5 text-yellow-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Name Tuner</h3>
      </div>
      
      <p className="text-sm text-gray-600 mb-4">
        Small spelling variations that could shift your Expression number:
      </p>

      <div className="space-y-3">
        {suggestions.map((suggestion, idx) => (
          <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <span className="font-medium text-gray-900">{suggestion.name}</span>
              <span className="text-sm text-gray-500 ml-2">({suggestion.change})</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Expression:</span>
              <span className="font-semibold text-indigo-600">{suggestion.newExpression}</span>
              <ArrowUpDown className="h-4 w-4 text-gray-400" />
              <span className={`text-sm font-medium ${
                suggestion.delta > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {suggestion.delta > 0 ? '+' : ''}{suggestion.delta}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      <p className="text-xs text-gray-500 mt-3">
        These are algorithmic suggestions. Use your judgment for meaningful changes.
      </p>
    </div>
  );
};

export default NameTuner;