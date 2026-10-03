import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getPresenceDisplay, readPresenceProfile, writePresenceProfile } from '../utils/storage.js';

const PresenceContext = createContext(null);

export function PresenceProvider({ children }) {
  const [profile, setProfile] = useState(readPresenceProfile);
  useEffect(() => {
    const refresh = () => setProfile(readPresenceProfile());
    window.addEventListener('presence-profile-change', refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener('presence-profile-change', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);
  const value = useMemo(() => ({
    profile,
    presence: getPresenceDisplay(profile),
    updateProfile: (updates) => {
      const next = { ...readPresenceProfile(), ...updates };
      writePresenceProfile(next);
      setProfile(next);
      return next;
    },
  }), [profile]);
  return <PresenceContext.Provider value={value}>{children}</PresenceContext.Provider>;
}

export function usePresence() {
  const context = useContext(PresenceContext);
  if (!context) throw new Error('usePresence must be used inside PresenceProvider');
  return context;
}
