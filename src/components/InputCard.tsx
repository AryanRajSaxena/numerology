import React, { useState } from 'react';
import { Calculator, AlertCircle } from 'lucide-react';
import { calculateAllNumbers } from '../utils/numerology';
import { validateDOB } from '../utils/validation';

interface InputCardProps {
  profile: any;
  setProfile: (profile: any) => void;
  onCalculate: (results: any) => void;
}

const InputCard: React.FC<InputCardProps> = ({ profile, setProfile, onCalculate }) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isCalculating, setIsCalculating] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const INSIGHT_OPTIONS = [
  { key: 'love', label: 'Love Life' },
  { key: 'finance', label: 'Financial Growth' },
  { key: 'career', label: 'Career & Opportunities' },
  { key: 'obstacles', label: 'Obstacles & Challenges' },
  { key: 'family', label: 'Family & Relationships' },
  { key: 'future', label: 'Past & Future Highlights' },
];

  const handleInputChange = (field: string, value: string) => {
    setProfile({ ...profile, [field]: value });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    // Validate required fields
    if (!profile.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (!/^[A-Za-z\s\u00C0-\u017F]+$/.test(profile.fullName)) {
      newErrors.fullName = 'Please enter letters only';
    }

    if (!profile.dob) {
      newErrors.dob = 'Date of birth is required';
    } else if (!validateDOB(profile.dob)) {
      newErrors.dob = 'Please enter a valid date in DD/MM/YYYY format';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsCalculating(true);
    
    try {
      const results = calculateAllNumbers(profile);
      onCalculate(results);
    } catch (error) {
      setErrors({ general: 'Calculation error. Please check your inputs.' });
    } finally {
      setIsCalculating(false);
    }
  };

  function handlePreferenceChange(key: string): void {
    const currentPreferences = profile.preferences || [];
    let updatedPreferences;
    if (currentPreferences.includes(key)) {
      updatedPreferences = currentPreferences.filter((k: string) => k !== key);
    } else {
      updatedPreferences = [...currentPreferences, key];
    }
    setProfile({ ...profile, preferences: updatedPreferences });
  }
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 backdrop-blur-sm">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-gradient-to-r from-indigo-100 to-purple-100 p-3 rounded-xl">
          <Calculator className="h-5 w-5 text-indigo-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Your Information</h2>
          <p className="text-sm text-gray-600">Enter your details for personalized numerology insights</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Full Name */}
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            id="fullName"
            value={profile.fullName}
            onChange={(e) => handleInputChange('fullName', e.target.value)}
            placeholder="Full name as per documents"
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
              errors.fullName ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
          />
          {errors.fullName && (
            <div className="mt-1 flex items-center space-x-1 text-red-600">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{errors.fullName}</span>
            </div>
          )}
        </div>

        {/* Preferred Name */}
        <div>
          <label htmlFor="preferredName" className="block text-sm font-medium text-gray-700 mb-2">
            Preferred Name (Optional)
          </label>
          <input
            type="text"
            id="preferredName"
            value={profile.preferredName}
            onChange={(e) => handleInputChange('preferredName', e.target.value)}
            placeholder="Name you use daily"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
          />
        </div>

        {/* Date of Birth */}
        <div>
          <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-2">
            Date of Birth *
          </label>
          <input
            type="text"
            id="dob"
            value={profile.dob}
            onChange={(e) => handleInputChange('dob', e.target.value)}
            placeholder="DD/MM/YYYY"
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
              errors.dob ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
          />
          {errors.dob && (
            <div className="mt-1 flex items-center space-x-1 text-red-600">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{errors.dob}</span>
            </div>
          )}
        </div>

        {/* Gender */}
        <div>
          <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
            Gender (Optional)
          </label>
          <select
            id="gender"
            value={profile.gender}
            onChange={(e) => handleInputChange('gender', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          What insights interest you most? (Optional)
        </label>
        <div className="grid grid-cols-2 gap-3">
          {INSIGHT_OPTIONS.map(opt => (
            <label key={opt.key} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
              <input
                type="checkbox"
                checked={profile.preferences?.includes(opt.key) || false}
                onChange={() => handlePreferenceChange(opt.key)}
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

        {/* Advanced Options Toggle */}
        <div>
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center space-x-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
          >
            <span>{showAdvanced ? 'Hide' : 'Show'} Advanced Options</span>
            <div className={`transform transition-transform ${showAdvanced ? 'rotate-180' : ''}`}>
              ▼
            </div>
          </button>
          
          {showAdvanced && (
            <div className="mt-4 p-4 bg-gray-50 rounded-xl space-y-4">
              {/* Name System Toggle */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Numerology System
                </label>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="system"
                      value="chaldean"
                      checked={profile.system === 'chaldean'}
                      onChange={(e) => handleInputChange('system', e.target.value)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">Chaldean (Recommended)</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="system"
                      value="pythagorean"
                      checked={profile.system === 'pythagorean'}
                      onChange={(e) => handleInputChange('system', e.target.value)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">Pythagorean</span>
                  </label>
                </div>
              </div>

              {/* Master Numbers */}
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={profile.preserveMasters}
                    onChange={(e) => setProfile({ ...profile, preserveMasters: e.target.checked })}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Preserve master numbers (11, 22, 33)
                  </span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isCalculating}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          {isCalculating ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Calculating...</span>
            </div>
          ) : (
            'Calculate My Numbers ✨'
          )}
        </button>

        {errors.general && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-center space-x-2 text-red-700">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{errors.general}</span>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default InputCard;