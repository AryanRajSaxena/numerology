import React from 'react';
import { Lock, Sparkles, ArrowRight } from 'lucide-react';
import { NUMBER_MEANINGS, LUCKY_COLORS, LUCKY_DAYS } from '../data/meanings';
import NumberCard from './NumberCard';

interface PreviewCardProps {
  results: any;
  profile: any;
  onSignupClick: () => void;
}

const PreviewCard: React.FC<PreviewCardProps> = ({ results, profile, onSignupClick }) => {
  const lifePathMeaning = NUMBER_MEANINGS[results.lifePath.value];
  const expressionMeaning = NUMBER_MEANINGS[results.expression.value];

  const lockedNumbers = [
    { key: 'soulUrge', label: 'Soul Urge', value: results.soulUrge.value },
    { key: 'personality', label: 'Personality', value: results.personality.value },
    { key: 'birthday', label: 'Birthday', value: results.birthday },
    { key: 'maturity', label: 'Maturity', value: results.maturity }
  ];

  return (
    <div className="space-y-6">
      {/* Preview Numbers */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Your Numerology Preview</h2>
          <div className="flex items-center space-x-1 text-sm text-green-600 font-medium">
            <Sparkles className="h-4 w-4" />
            <span>Free Preview</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {/* Life Path - Full Preview */}
          <div className="col-span-2 md:col-span-1">
            <NumberCard
              label="Life Path"
              value={results.lifePath.value}
              summary={lifePathMeaning?.summary || 'Unique path'}
            />
          </div>

          {/* Expression - Teaser */}
          <NumberCard
            label="Expression"
            value={results.expression.value}
            summary={expressionMeaning?.summary || 'Special talents'}
          />

          {/* Locked Numbers */}
          {lockedNumbers.map((num) => (
            <div key={num.key} className="relative">
              <div className="p-4 rounded-xl border-2 border-gray-200 bg-gray-50 opacity-60">
                <div className="text-center">
                  <div className="text-2xl font-bold mb-1 text-gray-400 blur-sm">
                    {num.value}
                  </div>
                  <div className="text-xs font-medium mb-2 text-gray-500">
                    {num.label}
                  </div>
                  <div className="text-xs text-gray-400">
                    Unlock to reveal
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white rounded-full p-2 shadow-md">
                  <Lock className="h-4 w-4 text-gray-500" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Life Path Detailed Preview */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Life Path Number: {results.lifePath.value}
        </h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Calculation Trace */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">How we calculated this</h4>
            <div className="bg-gray-50 p-4 rounded-lg text-sm">
              <p className="mb-2">Date: {profile.dob}</p>
              <p className="mb-2">Digits: {results.lifePath.intermediate.digits.join(' + ')}</p>
              <p className="mb-2">Sum: {results.lifePath.intermediate.sum}</p>
              <p>Reduced: {results.lifePath.value}</p>
              <p className="text-xs text-gray-500 mt-2">
                Source: Classical numerology (Phillips/Sepharial methods)
              </p>
            </div>
          </div>

          {/* Life Path Insights */}
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-green-700 mb-2">Strengths</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                {lifePathMeaning?.strengths.slice(0, 2).map((strength, idx) => (
                  <li key={idx}>• {strength}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-amber-700 mb-2">Areas for Growth</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                {lifePathMeaning?.weaknesses.slice(0, 2).map((weakness, idx) => (
                  <li key={idx}>• {weakness}</li>
                ))}
              </ul>
            </div>

            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-3 rounded-lg">
              <h4 className="font-medium text-orange-800 mb-1">Cultural Guidance</h4>
              <p className="text-sm text-orange-700">
                Lucky day: {LUCKY_DAYS[results.lifePath.value]} | 
                Favorable color: {LUCKY_COLORS[results.lifePath.value]}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Expression Number Teaser */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Expression Number: {results.expression.value}
        </h3>
        <p className="text-gray-600 mb-4">
          {expressionMeaning?.summary || 'Your unique talents and abilities'}
        </p>
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg border border-indigo-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-indigo-700 font-medium">
                Want to see your detailed Expression analysis?
              </p>
              <p className="text-xs text-indigo-600 mt-1">
                Unlock strengths, weaknesses, and action steps
              </p>
            </div>
            <Lock className="h-5 w-5 text-indigo-500" />
          </div>
        </div>
      </div>

      {/* CTA Card */}
      <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-xl p-8 text-white text-center">
        <div className="mb-4">
          <Sparkles className="h-12 w-12 mx-auto mb-3 text-yellow-300" />
          <h3 className="text-2xl font-bold mb-2">
            ✨ Want your full detailed numerology report?
          </h3>
          <p className="text-indigo-100 text-lg">
            Signup free to unlock all 6 core numbers with detailed insights
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
          <div className="bg-white/10 rounded-lg p-3">
            <div className="font-semibold">Soul Urge Number</div>
            <div className="text-indigo-200">Your inner desires</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <div className="font-semibold">Personality Number</div>
            <div className="text-indigo-200">How others see you</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <div className="font-semibold">Birthday Number</div>
            <div className="text-indigo-200">Special talents</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <div className="font-semibold">Maturity Number</div>
            <div className="text-indigo-200">Life's later purpose</div>
          </div>
        </div>

        <button
          onClick={onSignupClick}
          className="bg-white text-indigo-600 font-bold py-4 px-8 rounded-xl text-lg hover:bg-gray-50 transition-colors inline-flex items-center space-x-2 shadow-lg"
        >
          <span>Signup Free to Unlock Now</span>
          <ArrowRight className="h-5 w-5" />
        </button>

        <p className="text-xs text-indigo-200 mt-4">
          No credit card required • Instant access • 100% free
        </p>
      </div>

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

export default PreviewCard;