import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Calendar, Target, AlertTriangle } from 'lucide-react';
import { PINNACLE_MEANINGS, CHALLENGE_MEANINGS, KARMIC_DEBT_MEANINGS } from '../../data/meanings';

interface AdvancedNumbersProps {
  results: any;
}

const AdvancedNumbers: React.FC<AdvancedNumbersProps> = ({ results }) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="space-y-6">
      {/* Personal Year/Month/Day */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Personal Cycles</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
            <div className="text-3xl font-bold text-blue-700 mb-2">{results.personalYear}</div>
            <div className="text-sm font-medium text-blue-600 mb-1">Personal Year</div>
            <div className="text-xs text-blue-600">Your theme for {new Date().getFullYear()}</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
            <div className="text-3xl font-bold text-purple-700 mb-2">{results.personalMonth}</div>
            <div className="text-sm font-medium text-purple-600 mb-1">Personal Month</div>
            <div className="text-xs text-purple-600">Current monthly energy</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
            <div className="text-3xl font-bold text-green-700 mb-2">{results.personalDay}</div>
            <div className="text-sm font-medium text-green-600 mb-1">Personal Day</div>
            <div className="text-xs text-green-600">Today's specific energy</div>
          </div>
        </div>
      </div>

      {/* Pinnacle Numbers */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
        <button
          onClick={() => toggleSection('pinnacles')}
          className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-100 p-2 rounded-lg">
              <Calendar className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Pinnacle Numbers</h3>
              <p className="text-sm text-gray-600">Life phases and their themes</p>
            </div>
          </div>
          {expandedSections.pinnacles ? (
            <ChevronUp className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-400" />
          )}
        </button>
        
        {expandedSections.pinnacles && (
          <div className="px-6 pb-6 border-t border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {Object.entries(results.pinnacles).map(([key, pinnacle]: [string, any]) => (
                <div key={key} className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-2xl font-bold text-indigo-700">{pinnacle.value}</div>
                    <div className="text-xs text-indigo-600 font-medium">{pinnacle.ages}</div>
                  </div>
                  <div className="text-sm font-medium text-indigo-800 mb-2 capitalize">
                    {key} Pinnacle
                  </div>
                  <div className="text-xs text-indigo-700">
                    {PINNACLE_MEANINGS[pinnacle.value] || 'Focus on personal growth and development'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Challenge Numbers */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
        <button
          onClick={() => toggleSection('challenges')}
          className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <div className="bg-orange-100 p-2 rounded-lg">
              <Target className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Challenge Numbers</h3>
              <p className="text-sm text-gray-600">Areas for growth and development</p>
            </div>
          </div>
          {expandedSections.challenges ? (
            <ChevronUp className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-400" />
          )}
        </button>
        
        {expandedSections.challenges && (
          <div className="px-6 pb-6 border-t border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {Object.entries(results.challenges).map(([key, value]: [string, any]) => (
                <div key={key} className="p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl border border-orange-200">
                  <div className="text-2xl font-bold text-orange-700 mb-2">{value}</div>
                  <div className="text-sm font-medium text-orange-800 mb-2 capitalize">
                    {key} Challenge
                  </div>
                  <div className="text-xs text-orange-700">
                    {CHALLENGE_MEANINGS[value] || 'Focus on overcoming limitations and growing stronger'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Special Numbers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-700 mb-2">{results.balanceNumber}</div>
            <div className="text-sm font-medium text-green-600 mb-1">Balance Number</div>
            <div className="text-xs text-gray-600">How you handle pressure</div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-700 mb-2">{results.hiddenPassion.value}</div>
            <div className="text-sm font-medium text-purple-600 mb-1">Hidden Passion</div>
            <div className="text-xs text-gray-600">Your secret strength (appears {results.hiddenPassion.count}x)</div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-700 mb-2">{results.subconsciousSelf}</div>
            <div className="text-sm font-medium text-blue-600 mb-1">Subconscious Self</div>
            <div className="text-xs text-gray-600">Your confidence level</div>
          </div>
        </div>
      </div>

      {/* Karmic Debt */}
      {results.karmicDebt && results.karmicDebt.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="bg-red-100 p-2 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Karmic Debt Numbers</h3>
                <p className="text-sm text-gray-600">Special lessons from past lives</p>
              </div>
            </div>
          </div>
          
          <div className="p-6 space-y-4">
            {results.karmicDebt.map((debt: any, idx: number) => (
              <div key={idx} className="p-4 bg-gradient-to-br from-red-50 to-orange-50 rounded-xl border border-red-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-2xl font-bold text-red-700">{debt.number}</div>
                  <div className="text-xs text-red-600 font-medium capitalize">{debt.type} Number</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-red-800">
                    {KARMIC_DEBT_MEANINGS[debt.number]?.summary}
                  </div>
                  <div className="text-xs text-red-700">
                    {KARMIC_DEBT_MEANINGS[debt.number]?.meaning}
                  </div>
                  <div className="text-xs text-red-600 font-medium">
                    Lesson: {KARMIC_DEBT_MEANINGS[debt.number]?.lesson}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedNumbers;