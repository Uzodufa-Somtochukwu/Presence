import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  getPresenceDisplay,
  readPresenceProfile,
  writePresenceProfile,
  readAppSettings,
  writeAppSettings
} from '../utils/storage.js';

const PresenceContext = createContext(null);

export function PresenceProvider({ children }) {
  const [profile, setProfile] = useState(readPresenceProfile);
  const [settings, setSettings] = useState(readAppSettings);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    const refreshProfile = () => setProfile(readPresenceProfile());
    const refreshSettings = () => setSettings(readAppSettings());

    window.addEventListener('presence-profile-change', refreshProfile);
    window.addEventListener('presence-settings-change', refreshSettings);
    window.addEventListener('storage', refreshProfile);

    return () => {
      window.removeEventListener('presence-profile-change', refreshProfile);
      window.removeEventListener('presence-settings-change', refreshSettings);
      window.removeEventListener('storage', refreshProfile);
    };
  }, []);

  // Sync theme to root class
  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    if (settings.largeText) {
      document.documentElement.style.fontSize = '17px';
    } else {
      document.documentElement.style.fontSize = '16px';
    }
  }, [settings.theme, settings.largeText]);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((cur) => (cur === message ? null : cur));
    }, 3200);
  };

  const updateProfile = (updates) => {
    const next = { ...readPresenceProfile(), ...updates };
    writePresenceProfile(next);
    setProfile(next);
    return next;
  };

  const updateSettings = (updates) => {
    const next = { ...readAppSettings(), ...updates };
    writeAppSettings(next);
    setSettings(next);
    return next;
  };

  const toggleTheme = () => {
    const nextTheme = settings.theme === 'dark' ? 'light' : 'dark';
    updateSettings({ theme: nextTheme });
    showToast(`Switched to ${nextTheme} mode`);
  };

  const toggleLargeText = () => {
    const nextVal = !settings.largeText;
    updateSettings({ largeText: nextVal });
    showToast(nextVal ? 'Larger text mode enabled' : 'Standard text size restored');
  };

  const value = useMemo(() => ({
    profile,
    presence: getPresenceDisplay(profile),
    settings,
    toastMessage,
    showToast,
    updateProfile,
    updateSettings,
    toggleTheme,
    toggleLargeText,
  }), [profile, settings, toastMessage]);

  return (
    <PresenceContext.Provider value={value}>
      {children}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-full text-sm font-medium shadow-xl backdrop-blur-md bg-[#173a34]/95 text-[#fffaf2] border border-white/20 transition-all duration-300 animate-in fade-in slide-in-from-bottom-2"
        >
          {toastMessage}
        </div>
      )}
    </PresenceContext.Provider>
  );
}

export function usePresence() {
  const context = useContext(PresenceContext);
  if (!context) throw new Error('usePresence must be used inside PresenceProvider');
  return context;
}
