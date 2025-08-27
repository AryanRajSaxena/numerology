const STORAGE_KEY = 'numencoach_profile';

export function saveProfile(profile, results, timestamp) {
  const data = {
    profile,
    results,
    timestamp
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function loadProfile() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error loading profile:', error);
    return null;
  }
}

export function clearProfile() {
  localStorage.removeItem(STORAGE_KEY);
}