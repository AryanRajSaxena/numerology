import React, { useState } from 'react';
import { Download, Save, ChevronDown, ChevronUp, Share2 } from 'lucide-react';
import NumberCard from './NumberCard';
import NameTuner from './NameTuner';
import { generatePDF } from '../utils/pdf';
import { NUMBER_MEANINGS, LUCKY_COLORS, LUCKY_DAYS } from '../data/meanings';

interface FullResultsCardProps {
  results: any;
  profile: any;
}

const FullResultsCard: React.FC<FullResultsCardProps> = ({ results, profile }) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleDownloadPDF = () => {
    generatePDF(results, profile);
  };

  const handleWhatsAppShare = () => {
    const message = `🌟 My Numerology Report from NumenCoach:\n\n` +
      `Life Path: ${results.lifePath.value}\n` +
      `Expression: ${results.expression.value}\n` +
      `Soul Urge: ${results.soulUrge.value}\n` +
      `Personality: ${results.personality.value}\n\n` +
      `Get your free report at numencoach.app`;
    
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const coreNumbers = [
    { key: 'lifePath', label: 'Life Path', value: results.lifePath.value },
    { key: 'expression', label: 'Expression', value: results.expression.value },
    { key: 'soulUrge', label: 'Soul Urge', value: results.soulUrge.value },
    { key: 'personality', label: 'Personality', value: results.personality.value },
    { key: 'birthday', label: 'Birthday', value: results.birthday },
    { key: 'maturity', label: 'Maturity', value: results.maturity }
  ];

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleDownloadPDF}
          className="flex items-center justify-center space-x-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
        >
          <Download className="h-4 w-4" />
          <span>Download PDF Report</span>
        </button>
        <button
          onClick={handleWhatsAppShare}
          className="flex items-center justify-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          <Share2 className="h-4 w-4" />
          <span>Share via WhatsApp</span>
        </button>
        <button
          onClick={() => {
            localStorage.setItem('numencoach_favorite', JSON.stringify({ profile, results }));
            alert('Profile saved to favorites!');
          }}
          className="flex items-center justify-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
        >
          <Save className="h-4 w-4" />
          <span>Save to Profile</span>
        </button>
      </div>

      {/* Core Numbers Grid */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Complete Numerology Profile</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {coreNumbers.map((num) => (
            <NumberCard
              key={num.key}
              label={num.label}
              value={num.value}
              summary={NUMBER_MEANINGS[num.value]?.summary || 'Unique path'}
            />
          ))}
        </div>
      </div>

      {/* Detailed Sections */}
      {coreNumbers.map((num) => (
        <div key={`detail-${num.key}`} className="bg-white rounded-2xl shadow-lg border border-gray-100">
          <button
            onClick={() => toggleSection(num.key)}
            className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{num.label} Number: {num.value}</h3>
              <p className="text-sm text-gray-600 mt-1">{NUMBER_MEANINGS[num.value]?.summary}</p>
            </div>
            {expandedSections[num.key] ? (
              <ChevronUp className="h-5 w-5 text-gray-400" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-400" />
            )}
          </button>
          
          {expandedSections[num.key] && (
            <div className="px-6 pb-6 border-t border-gray-100">
              <div className="grid md:grid-cols-2 gap-6 mt-6">
                {/* Calculation Trace */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">How we calculated this</h4>
                  <div className="bg-gray-50 p-4 rounded-lg text-sm">
                    {num.key === 'lifePath' && (
                      <div>
                        <p className="mb-2">Date: {profile.dob}</p>
                        <p className="mb-2">Digits: {results.lifePath.intermediate.digits.join(' + ')}</p>
                        <p className="mb-2">Sum: {results.lifePath.intermediate.sum}</p>
                        <p>Reduced: {results.lifePath.value}</p>
                      </div>
                    )}
                    {(num.key === 'expression' || num.key === 'soulUrge' || num.key === 'personality') && (
                      <div>
                        <p className="mb-2">Name: {profile.fullName}</p>
                        <p className="mb-2">System: {profile.system}</p>
                        <p className="mb-2">Raw sum: {results[num.key].raw}</p>
                        <p>Reduced: {results[num.key].value}</p>
                      </div>
                    )}
                    {num.key === 'birthday' && (
                      <p>Birth day ({profile.dob.split('/')[0]}) reduced to: {num.value}</p>
                    )}
                    {num.key === 'maturity' && (
                      <p>Life Path ({results.lifePath.value}) + Expression ({results.expression.value}) = {num.value}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                      Source: Classical numerology (Phillips/Sepharial methods)
                    </p>
                  </div>
                </div>

                {/* Coaching Content */}
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-green-700 mb-2">Strengths</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      {NUMBER_MEANINGS[num.value]?.strengths.map((strength, idx) => (
                        <li key={idx}>• {strength}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-amber-700 mb-2">Areas for Growth</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      {NUMBER_MEANINGS[num.value]?.weaknesses.map((weakness, idx) => (
                        <li key={idx}>• {weakness}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-blue-700 mb-2">Action Steps</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      {NUMBER_MEANINGS[num.value]?.coaching.map((action, idx) => (
                        <li key={idx}>• {action}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-3 rounded-lg">
                    <h4 className="font-medium text-orange-800 mb-1">Cultural Guidance</h4>
                    <p className="text-sm text-orange-700">
                      Lucky day: {LUCKY_DAYS[num.value]} | 
                      Favorable color: {LUCKY_COLORS[num.value]}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Name Tuner */}
      <NameTuner profile={profile} currentExpression={results.expression.value} />

      {/* Lo-Shu Grid */}
      {results.loShu && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Lo-Shu Grid Analysis</h3>
          <div className="grid grid-cols-3 gap-2 w-48 mx-auto mb-4">
            {[4, 9, 2, 3, 5, 7, 8, 1, 6].map((num) => (
              <div
                key={num}
                className={`aspect-square flex items-center justify-center border-2 rounded-lg text-lg font-semibold ${
                  results.loShu.counts[num] > 0
                    ? 'bg-indigo-100 border-indigo-300 text-indigo-800'
                    : 'bg-gray-100 border-gray-300 text-gray-400'
                }`}
              >
                {num}
                {results.loShu.counts[num] > 1 && (
                  <span className="text-xs ml-1">×{results.loShu.counts[num]}</span>
                )}
              </div>
            ))}
          </div>
          {results.loShu.missing.length > 0 && (
            <p className="text-sm text-gray-600 text-center">
              Missing numbers: {results.loShu.missing.join(', ')} - opportunities for growth
            </p>
          )}
        </div>
      )}

      {/* Disclaimer */}
      <div className="text-center">
        <p className="text-sm text-gray-500 max-w-2xl mx-auto">
          Guidance based on deterministic numerology rules (Chaldean/Pythagorean). 
          Treat as reflection, not guarantee. All calculations are transparent and reproducible.
        </p>
      </div>
    </div>
  );
};

export default FullResultsCard;