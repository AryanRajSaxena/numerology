import React from 'react';
import { Calendar, Star, TrendingUp, Heart } from 'lucide-react';
import NumberCard from '../NumberCard';

interface DashboardHomeProps {
  profile: any;
  results: any;
}

const DashboardHome: React.FC<DashboardHomeProps> = ({ profile, results }) => {
  const getZodiacSign = (dob: string) => {
    const [day, month] = dob.split('/').map(Number);
    const signs = [
      'Capricorn', 'Aquarius', 'Pisces', 'Aries', 'Taurus', 'Gemini',
      'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius'
    ];
    const dates = [20, 19, 20, 20, 21, 21, 22, 23, 23, 23, 22, 22];
    return signs[month - 1 + (day < dates[month - 1] ? -1 : 0)] || 'Capricorn';
  };

  const getDailyHoroscope = (sign: string) => {
    const horoscopes = {
      'Aries': 'Today brings new opportunities for leadership. Trust your instincts and take bold action.',
      'Taurus': 'Focus on building stable foundations. Your patience will be rewarded with lasting success.',
      'Gemini': 'Communication is key today. Share your ideas and connect with like-minded people.',
      'Cancer': 'Trust your intuition in emotional matters. Family connections bring comfort and joy.',
      'Leo': 'Your natural charisma shines bright today. Use it to inspire and motivate others.',
      'Virgo': 'Attention to detail pays off. Organize your thoughts and tackle tasks methodically.',
      'Libra': 'Seek balance in all areas of life. Harmony in relationships brings inner peace.',
      'Scorpio': 'Deep transformation is possible today. Embrace change and trust the process.',
      'Sagittarius': 'Adventure calls to you. Expand your horizons through learning and exploration.',
      'Capricorn': 'Hard work leads to recognition. Stay focused on your long-term goals.',
      'Aquarius': 'Innovation and originality set you apart. Think outside the box today.',
      'Pisces': 'Your compassion and creativity flow freely. Help others while expressing yourself.'
    };
    return horoscopes[sign] || horoscopes['Aries'];
  };

  const zodiacSign = getZodiacSign(profile.dob);
  const dailyHoroscope = getDailyHoroscope(zodiacSign);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {profile.fullName?.split(' ')[0] || 'Friend'}! ✨
            </h1>
            <p className="text-indigo-100 text-lg leading-relaxed">
              Your numerology journey continues. Here's what the numbers reveal today.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="bg-white/20 p-6 rounded-2xl backdrop-blur-sm">
              <Star className="h-16 w-16 text-yellow-300 animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Life Path</p>
              <p className="text-3xl font-bold text-indigo-600">{results.lifePath.value}</p>
            </div>
            <div className="bg-indigo-100 p-3 rounded-xl">
              <TrendingUp className="h-8 w-8 text-indigo-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Personal Year</p>
              <p className="text-3xl font-bold text-purple-600">{results.personalYear}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-xl">
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Personal Month</p>
              <p className="text-3xl font-bold text-pink-600">{results.personalMonth}</p>
            </div>
            <div className="bg-pink-100 p-3 rounded-xl">
              <Calendar className="h-8 w-8 text-pink-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Personal Day</p>
              <p className="text-3xl font-bold text-orange-600">{results.personalDay}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-xl">
              <Calendar className="h-8 w-8 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Daily Horoscope */}
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-3 rounded-xl">
            <Star className="h-5 w-5 text-yellow-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            Daily Guidance - {zodiacSign}
          </h3>
        </div>
        <p className="text-gray-700 leading-relaxed text-lg">{dailyHoroscope}</p>
      </div>

      {/* Core Numbers Summary */}
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Your Core Numbers</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <NumberCard
            label="Life Path"
            value={results.lifePath.value}
            summary="Your life's purpose and journey"
          />
          <NumberCard
            label="Expression"
            value={results.expression.value}
            summary="Your natural talents and abilities"
          />
          <NumberCard
            label="Soul Urge"
            value={results.soulUrge.value}
            summary="Your inner desires and motivations"
          />
          <NumberCard
            label="Personality"
            value={results.personality.value}
            summary="How others perceive you"
          />
          <NumberCard
            label="Birthday"
            value={results.birthday}
            summary="Your special gift and talent"
          />
          <NumberCard
            label="Maturity"
            value={results.maturity}
            summary="Your life's later purpose"
          />
        </div>
      </div>

      {/* Karmic Debt Alert */}
      {results.karmicDebt && results.karmicDebt.length > 0 && (
        <div className="bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200 rounded-2xl p-8 shadow-lg">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-orange-100 p-3 rounded-xl">
              <Heart className="h-5 w-5 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-orange-900">Karmic Debt Numbers Detected</h3>
          </div>
          <div className="space-y-2">
            {results.karmicDebt.map((debt: any, idx: number) => (
              <p key={idx} className="text-orange-800 font-medium">
                <strong>{debt.number}</strong> in your {debt.type} - Focus on spiritual growth and service
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardHome;