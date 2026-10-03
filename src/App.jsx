import { Navigate, Route, Routes } from 'react-router-dom';
import Landing from './pages/Landing.jsx';
import Login from './pages/authentication/Login.jsx';
import Signup from './pages/authentication/Signup.jsx';
import Profile from './pages/onboarding/Profile.jsx';
import ProfileReasons from './pages/onboarding/ProfileReasons.jsx';
import ProfileAbout from './pages/onboarding/ProfileAbout.jsx';
import PresencePersonalize from './pages/personalization/PresencePersonalize.jsx';
import PresenceName from './pages/personalization/PresenceName.jsx';
import PresenceAvatar from './pages/personalization/PresenceAvatar.jsx';
import PresencePersonality from './pages/personalization/PresencePersonality.jsx';
import Home from './pages/home/Home.jsx';

export default function App() {
  return <Routes>
    <Route path="/" element={<Landing />} />
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/profile" element={<Profile />} />
    <Route path="/profile/reasons" element={<ProfileReasons />} />
    <Route path="/profile/about" element={<ProfileAbout />} />
    <Route path="/presence/personalize" element={<PresencePersonalize />} />
    <Route path="/presence/name" element={<PresenceName />} />
    <Route path="/presence/avatar" element={<PresenceAvatar />} />
    <Route path="/presence/personality" element={<PresencePersonality />} />
    <Route path="/home" element={<Home />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>;
}
