import React, { useEffect, useState } from 'react';
import { supabase } from './lib/supabase'; // Corrected import
import Dashboard from './components/Dashboard';
import DashboardHome from './components/sections/DashboardHome';
import FullResultsCard from './components/FullResultsCard';
import AdvancedNumbers from './components/sections/AdvancedNumbers';
import CompatibilitySection from './components/sections/CompatibilitySection';
import InputCard from './components/InputCard';
import AuthModal from './components/AuthModal';
import PreviewCard from './components/PreviewCard'; // Added import
import { calculateAllNumbers } from './utils/numerology';
import { loadProfile, saveProfile as saveProfileLocal } from './utils/storage';
import { runTests } from './utils/tests.js';

type Profile = {
  fullName: string;
  preferredName?: string;
  dob: string;
  gender?: string;
  system: 'chaldean' | 'pythagorean' | string;
  preserveMasters: boolean;
  preferences?: string[]; // NEW: user-selected insight categories

};

export default function App(): JSX.Element {
  const [user, setUser] = useState<any | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [currentSection, setCurrentSection] = useState('dashboard');
  const [profile, setProfile] = useState<Profile>({
    fullName: '',
    preferredName: '',
    dob: '',
    gender: '',
    system: 'chaldean',
    preserveMasters: true
  });
  const [results, setResults] = useState<any | null>(null);
  const [lastCalculated, setLastCalculated] = useState<string | null>(null);

  // Load local saved profile on mount first (fast)
  useEffect(() => {
    const saved = loadProfile();
    if (saved) {
      setProfile(saved.profile);
      setResults(saved.results ?? null);
      setLastCalculated(saved.timestamp ?? null);
    }
  }, []);

  // Auth session + fetch profile from Supabase profiles table when logged in
  useEffect(() => {
    let subscription: any = null;

    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);

      // subscribe to auth changes
      const authSub = supabase.auth.onAuthStateChange(async (_event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchProfileFromServer(session.user.id);
        } else {
          // logged out - keep local storage but clear server-loaded results/profile in memory
          // keep local saved values (user might want to continue offline)
        }
      });
      subscription = authSub.data.subscription;

      // if there is already a logged in user, fetch server profile
      if (session?.user) {
        await fetchProfileFromServer(session.user.id);
      }
    };

    init();

    return () => {
      if (subscription) subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-calc if profile valid and results missing
  useEffect(() => {
    if (user && profile && profile.fullName && profile.dob && !results) {
      try {
        const newResults = calculateAllNumbers(profile);
        if (newResults) {
          setResults(newResults);
          const timestamp = new Date().toLocaleString('en-IN');
          setLastCalculated(timestamp);
          saveBoth(profile, newResults, timestamp);
        }
      } catch (err) {
        console.error('Auto-calc error', err);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, profile, results]);

  // Dev tests
  useEffect(() => {
    if (import.meta.env.DEV) runTests();
  }, []);

  // Fetch profile stored in Supabase 'profiles' table (if exists)
  const fetchProfileFromServer = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        // PGRST116: No rows found - ignore
        console.warn('Profile fetch error', error);
      }

      if (data) {
        const serverProfile: Profile = {
          fullName: data.full_name ?? '',
          preferredName: data.preferred_name ?? '',
          dob: data.dob ?? '',
          gender: data.gender ?? '',
          system: data.system ?? 'chaldean',
          preserveMasters: data.preserve_masters ?? true
        };
        setProfile(serverProfile);

        if (data.results) {
          setResults(data.results);
        } else {
          // if server has no results but local does, keep local; otherwise auto-calc will run via effect
        }

        if (data.last_calculated) {
          setLastCalculated(data.last_calculated);
        }
      }
    } catch (e) {
      console.error('fetchProfileFromServer error', e);
    }
  };

  // Save to both local storage and Supabase (if logged in)
  const saveBoth = async (p: Profile, r: any, timestamp: string) => {
    try {
      // save locally
      saveProfileLocal(p, r, timestamp);

      // save to server if logged in
      if (user?.id) {
        const payload = {
          id: user.id,
          email: user.email ?? null,
          full_name: p.fullName,
          preferred_name: p.preferredName ?? null,
          dob: p.dob,
          gender: p.gender ?? null,
          system: p.system,
          preserve_masters: p.preserveMasters,
          results: r,
          last_calculated: timestamp
        };
        const { error } = await supabase.from('profiles').upsert(payload, { returning: 'minimal' });
        if (error) console.warn('Supabase save error', error);
      }
    } catch (e) {
      console.error('saveBoth error', e);
    }
  };

  // Handlers
  const handleCalculate = (calculationResults: any) => {
    setResults(calculationResults);
    const timestamp = new Date().toLocaleString('en-IN');
    setLastCalculated(timestamp);
    saveBoth(profile, calculationResults, timestamp);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
  };

  // Main render: always render header/main layout to avoid blank-screen issues.
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-xl font-bold">NumenCoach</div>
            {lastCalculated && (
              <div className="text-sm text-gray-500">Last calculated: {lastCalculated}</div>
            )}
          </div>
          <div>
            {user ? (
              <div className="flex items-center space-x-2">
                <div className="text-sm text-gray-700">{user.email}</div>
                <button
                  onClick={handleSignOut}
                  className="text-sm text-indigo-600 hover:underline"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button onClick={() => setShowAuthModal(true)} className="text-sm text-indigo-600 hover:underline">
                  Sign in
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {user ? (
          // Logged-in experience
          <>
            {/* If profile incomplete, prompt for details */}
            {(!profile.fullName || !profile.dob) ? (
              <div className="min-h-[60vh] flex items-center justify-center">
                <div className="max-w-lg w-full">
                  <InputCard
                    profile={profile}
                    setProfile={setProfile}
                    onCalculate={(r) => {
                      handleCalculate(r);
                    }}
                  />
                </div>
              </div>
            ) : results ? (
              // Dashboard with sections
              <Dashboard
                user={user}
                profile={profile}
                results={results}
                onSectionChange={setCurrentSection}
                currentSection={currentSection}
              >
                {(() => {
                  switch (currentSection) {
                    case 'dashboard':
                      return <DashboardHome profile={profile} results={results} />;
                    case 'insights':
                      return <FullResultsCard results={results} profile={profile} />;
                    case 'loshu':
                      return (
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                          <h2 className="text-xl font-semibold text-gray-900 mb-6">Lo-Shu Grid Analysis</h2>
                          <div className="grid grid-cols-3 gap-2 w-64 mx-auto mb-6">
                            {[4, 9, 2, 3, 5, 7, 8, 1, 6].map((num) => (
                              <div
                                key={num}
                                className={`aspect-square flex items-center justify-center border-2 rounded-lg text-lg font-semibold ${
                                  results.loShu?.counts?.[num] > 0
                                    ? 'bg-indigo-100 border-indigo-300 text-indigo-800'
                                    : 'bg-gray-100 border-gray-300 text-gray-400'
                                }`}
                              >
                                {num}
                                {results.loShu?.counts?.[num] > 1 && (
                                  <span className="text-xs ml-1">×{results.loShu.counts[num]}</span>
                                )}
                              </div>
                            ))}
                          </div>
                          {results.loShu?.missing?.length > 0 && (
                            <p className="text-sm text-gray-600 text-center">
                              Missing numbers: {results.loShu.missing.join(', ')} - opportunities for growth
                            </p>
                          )}
                        </div>
                      );
                    case 'advanced':
                      return <AdvancedNumbers results={results} />;
                    case 'tuner':
                      return (
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                          <h2 className="text-xl font-semibold text-gray-900 mb-6">Name Tuner</h2>
                          <p className="text-gray-600">Name tuning suggestions will appear here.</p>
                        </div>
                      );
                    case 'compatibility':
                      return <CompatibilitySection userProfile={profile} />;
                    case 'reports':
                      return (
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                          <h2 className="text-xl font-semibold text-gray-900 mb-6">Reports</h2>
                          <p className="text-gray-600">Report generation options will appear here.</p>
                        </div>
                      );
                    case 'profile':
                      return (
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                          <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Settings</h2>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                              <input
                                type="text"
                                value={profile.fullName}
                                onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                              <input
                                type="text"
                                value={profile.dob}
                                onChange={(e) => setProfile({ ...profile, dob: e.target.value })}
                                placeholder="DD/MM/YYYY"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                              />
                            </div>
                            <button
                              onClick={() => {
                                const newResults = calculateAllNumbers(profile);
                                setResults(newResults);
                                const timestamp = new Date().toLocaleString('en-IN');
                                setLastCalculated(timestamp);
                                saveBoth(profile, newResults, timestamp);
                              }}
                              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
                            >
                              Update Profile
                            </button>
                          </div>
                        </div>
                      );
                    default:
                      return <DashboardHome profile={profile} results={results} />;
                  }
                })()}
              </Dashboard>
            ) : (
              // results missing but profile is present -> show input card so user can calculate
              <div className="min-h-[60vh] flex items-center justify-center">
                <div className="max-w-lg w-full">
                  <InputCard
                    profile={profile}
                    setProfile={setProfile}
                    onCalculate={handleCalculate}
                  />
                </div>
              </div>
            )}
          </>
        ) : (
          // Not logged in: landing / input + preview
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <InputCard profile={profile} setProfile={setProfile} onCalculate={handleCalculate} />
            </div>
            <div className="space-y-6">
              {/* If results exist show preview, else show placeholder */}
              {results ? (
                // lightweight preview component exists in codebase
                // @ts-ignore
                <div>
                  {/* keep PreviewCard usage if available in your project */}
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
                  <div className="bg-gray-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <div className="text-gray-400">🔢</div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to discover your numbers?</h3>
                  <p className="text-gray-600">Enter your information on the left to get started with your numerology analysis.</p>
                </div>
              )}
            </div>
          </div>
        )}

        <footer className="mt-16 text-center">
          <div className="text-sm text-gray-500">Guidance based on deterministic numerology rules. Treat as reflection.</div>
        </footer>
      </main>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} onSuccess={handleAuthSuccess} />
    </div>
  );
}