const PROFILE_KEY = 'presenceProfile';
const LEGACY_KEY = 'presencePersonalization';
const CHAT_KEY = 'presenceChatHistory';
const MOOD_KEY = 'presenceMoodEntries';
const SETTINGS_KEY = 'presenceAppSettings';

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
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    window.dispatchEvent(new Event('presence-profile-change'));
  } catch (e) {
    console.error('Failed to write presence profile', e);
  }
}

export function clearPresenceProfile() {
  localStorage.removeItem(PROFILE_KEY);
  localStorage.removeItem(LEGACY_KEY);
  localStorage.removeItem('presencePersonalizationComplete');
  localStorage.removeItem(CHAT_KEY);
  localStorage.removeItem(MOOD_KEY);
  window.dispatchEvent(new Event('presence-profile-change'));
}

export function getPresenceDisplay(profile = readPresenceProfile()) {
  const personalized = localStorage.getItem('presencePersonalizationComplete') === 'true';
  const name = profile.presenceName || profile.name;
  return {
    ...profile,
    displayName: name && name.trim() ? name.trim() : 'Lumi',
    isPersonalized: personalized || Boolean(name),
    userName: profile.userName || profile.fullName || 'Somto',
    avatar: profile.avatar || 'garden',
    personality: profile.personality || 'warm, attentive, and calming',
    ageGroup: profile.ageGroup || '25–34',
    pronouns: profile.pronouns || 'They / Them',
    reasons: profile.reasons || ['I want someone to talk to', 'I want someone to listen'],
    lookingFor: profile.lookingFor || ['A friend', 'Someone to talk things through with'],
  };
}

export function readChatHistory(companionName = 'Lumi', userName = 'Somto') {
  try {
    const data = localStorage.getItem(CHAT_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error(e);
  }

  return [
    {
      id: 'init-1',
      sender: 'companion',
      text: `Hello ${userName}. I'm ${companionName}. I'm here whenever you need a peaceful chat, a thoughtful listener, or simply warm company.`,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
    {
      id: 'init-2',
      sender: 'companion',
      text: "How has your heart been feeling today?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ];
}

export function writeChatHistory(messages) {
  try {
    localStorage.setItem(CHAT_KEY, JSON.stringify(messages));
  } catch (e) {
    console.error(e);
  }
}

export function readMoodEntries() {
  try {
    const data = localStorage.getItem(MOOD_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error(e);
  }
  return [
    { id: '1', mood: 'Peaceful', note: 'Took a morning walk in the crisp air.', date: 'Yesterday' }
  ];
}

export function writeMoodEntries(entries) {
  try {
    localStorage.setItem(MOOD_KEY, JSON.stringify(entries));
  } catch (e) {
    console.error(e);
  }
}

export function readAppSettings() {
  try {
    const data = localStorage.getItem(SETTINGS_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error(e);
  }
  return {
    theme: 'light',
    largeText: false,
    streak: 7,
    points: 1240,
  };
}

export function writeAppSettings(settings) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    window.dispatchEvent(new Event('presence-settings-change'));
  } catch (e) {
    console.error(e);
  }
}
