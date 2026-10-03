const PROFILE_KEY = 'presenceProfile';
const LEGACY_KEY = 'presencePersonalization';

export function readPresenceProfile() {
  try {
    const current = JSON.parse(localStorage.getItem(PROFILE_KEY) || '{}');
    const legacy = JSON.parse(localStorage.getItem(LEGACY_KEY) || '{}');
    return { ...legacy, ...current };
  } catch {
    return {};
  }
}

export function writePresenceProfile(profile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  window.dispatchEvent(new Event('presence-profile-change'));
}

export function clearPresenceProfile() {
  localStorage.removeItem(PROFILE_KEY);
  localStorage.removeItem(LEGACY_KEY);
  localStorage.removeItem('presencePersonalizationComplete');
  window.dispatchEvent(new Event('presence-profile-change'));
}

export function getPresenceDisplay(profile = readPresenceProfile()) {
  const personalized = localStorage.getItem('presencePersonalizationComplete') === 'true';
  return {
    ...profile,
    displayName: personalized && profile.presenceName ? profile.presenceName : 'Lumi',
    isPersonalized: personalized,
  };
}
