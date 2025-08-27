import React, { useState } from 'react';
import { Heart, Users, Calculator } from 'lucide-react';
import { calculateCompatibility } from '../../utils/numerology';
import { validateDOB } from '../../utils/validation';

interface CompatibilitySectionProps {
  userProfile: any;
}

const CompatibilitySection: React.FC<CompatibilitySectionProps> = ({ userProfile }) => {
  const [partnerProfile, setPartnerProfile] = useState({
    fullName: '',
    dob: '',
    system: 'chaldean',
    preserveMasters: true
  });
  const [compatibility, setCompatibility] = useState<any>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    setPartnerProfile({ ...partnerProfile, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const handleCalculate = () => {
    const newErrors: Record<string, string> = {};

    if (!partnerProfile.fullName.trim()) {
      newErrors.fullName = 'Partner name is required';
    }

    if (!partnerProfile.dob) {
      newErrors.dob = 'Partner date of birth is required';
    } else if (!validateDOB(partnerProfile.dob)) {
      newErrors.dob = 'Please enter a valid date in DD/MM/YYYY format';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const result = calculateCompatibility(userProfile, partnerProfile);
    setCompatibility(result);
  };

  const getCompatibilityColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (percentage >= 60) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (percentage >= 40) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 rounded-2xl p-8 text-white">
        <div className="flex items-center space-x-3 mb-4">
          <Heart className="h-8 w-8" />
          <h1 className="text-3xl font-bold">Compatibility Analysis</h1>
        </div>
        <p className="text-pink-100 text-lg">
          Discover how your numerology numbers align with your partner's for deeper relationship insights.
        </p>
      </div>

      {/* Input Form */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-pink-100 p-2 rounded-lg">
            <Users className="h-5 w-5 text-pink-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Partner Information</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Partner's Full Name *
            </label>
            <input
              type="text"
              value={partnerProfile.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              placeholder="Enter partner's full name"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors ${
                errors.fullName ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
            />
            {errors.fullName && (
              <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Partner's Date of Birth *
            </label>
            <input
              type="text"
              value={partnerProfile.dob}
              onChange={(e) => handleInputChange('dob', e.target.value)}
              placeholder="DD/MM/YYYY"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors ${
                errors.dob ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
            />
            {errors.dob && (
              <p className="mt-1 text-sm text-red-600">{errors.dob}</p>
            )}
          </div>
        </div>

        <button
          onClick={handleCalculate}
          className="mt-6 w-full bg-gradient-to-r from-pink-600 to-red-600 text-white py-3 px-6 rounded-lg font-medium hover:from-pink-700 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center space-x-2"
        >
          <Calculator className="h-5 w-5" />
          <span>Calculate Compatibility</span>
        </button>
      </div>

      {/* Results */}
      {compatibility && (
        <div className="space-y-6">
          {/* Compatibility Score */}
          <div className={`rounded-2xl p-8 border-2 ${getCompatibilityColor(compatibility.percentage)}`}>
            <div className="text-center">
              <div className="text-6xl font-bold mb-4">{compatibility.percentage}%</div>
              <h3 className="text-2xl font-semibold mb-2">Compatibility Score</h3>
              <p className="text-lg">{compatibility.analysis}</p>
            </div>
          </div>

          {/* Detailed Comparison */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Number Comparison</h3>
            
            <div className="space-y-6">
              {/* Life Path Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <div className="text-2xl font-bold text-blue-700">{compatibility.person1.lifePath.value}</div>
                  <div className="text-sm text-blue-600">Your Life Path</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-600">Life Path Compatibility</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {Math.abs(compatibility.person1.lifePath.value - compatibility.person2.lifePath.value) <= 2 ? 'Excellent' : 'Good'}
                  </div>
                </div>
                <div className="text-center p-4 bg-pink-50 rounded-xl">
                  <div className="text-2xl font-bold text-pink-700">{compatibility.person2.lifePath.value}</div>
                  <div className="text-sm text-pink-600">Partner's Life Path</div>
                </div>
              </div>

              {/* Expression Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <div className="text-2xl font-bold text-blue-700">{compatibility.person1.expression.value}</div>
                  <div className="text-sm text-blue-600">Your Expression</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-600">Expression Compatibility</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {Math.abs(compatibility.person1.expression.value - compatibility.person2.expression.value) <= 2 ? 'Excellent' : 'Good'}
                  </div>
                </div>
                <div className="text-center p-4 bg-pink-50 rounded-xl">
                  <div className="text-2xl font-bold text-pink-700">{compatibility.person2.expression.value}</div>
                  <div className="text-sm text-pink-600">Partner's Expression</div>
                </div>
              </div>

              {/* Soul Urge Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <div className="text-2xl font-bold text-blue-700">{compatibility.person1.soulUrge.value}</div>
                  <div className="text-sm text-blue-600">Your Soul Urge</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-600">Soul Urge Compatibility</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {Math.abs(compatibility.person1.soulUrge.value - compatibility.person2.soulUrge.value) <= 2 ? 'Excellent' : 'Good'}
                  </div>
                </div>
                <div className="text-center p-4 bg-pink-50 rounded-xl">
                  <div className="text-2xl font-bold text-pink-700">{compatibility.person2.soulUrge.value}</div>
                  <div className="text-sm text-pink-600">Partner's Soul Urge</div>
                </div>
              </div>
            </div>
          </div>

          {/* Relationship Advice */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
            <h3 className="text-lg font-semibold text-purple-900 mb-4">Relationship Guidance</h3>
            <div className="space-y-3 text-purple-800">
              <p>• Focus on understanding each other's core motivations and life purposes</p>
              <p>• Celebrate your differences as opportunities for growth and learning</p>
              <p>• Communicate openly about your individual goals and dreams</p>
              <p>• Support each other's personal development and spiritual journey</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompatibilitySection;