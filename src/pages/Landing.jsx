import { Link } from 'react-router-dom';
import '../styles/landing.css';

export default function Landing() {
  return <main className="landing-page">
    <img src="/assets/presence-logo-cream.png" alt="Presence" />
    <h1>Presence</h1>
    <p>A space to feel heard, supported, and understood.</p>
    <div className="landing-actions"><Link to="/signup">Get started</Link><Link to="/login">Log in</Link></div>
  </main>;
}
