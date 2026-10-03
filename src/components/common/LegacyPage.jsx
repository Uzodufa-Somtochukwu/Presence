import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const routeMap = {
  'login.html': '/login', 'signup.html': '/signup', 'profile.html': '/profile',
  'profile-reasons.html': '/profile/reasons', 'profile-about.html': '/profile/about',
  'presence-personalize.html': '/presence/personalize', 'presence-name.html': '/presence/name',
  'presence-avatar.html': '/presence/avatar', 'presence-personality.html': '/presence/personality',
  'home.html': '/home', 'index.html': '/',
};

export default function LegacyPage({ file, title }) {
  const container = useRef(null);
  const [page, setPage] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    let active = true;
    fetch(`/legacy/${file}`).then((response) => {
      if (!response.ok) throw new Error(`Could not load ${file}`);
      return response.text();
    }).then((html) => {
      if (!active) return;
      const parsed = new DOMParser().parseFromString(html, 'text/html');
      const styles = [...parsed.querySelectorAll('style')].map((node) => node.textContent).join('\n');
      const scripts = [...parsed.querySelectorAll('script')].map((node) => node.textContent).filter(Boolean);
      parsed.querySelectorAll('style, script').forEach((node) => node.remove());
      const body = parsed.body.innerHTML
        .replaceAll('presence-logo-cream.png', '/assets/presence-logo-cream.png')
        .replace(/(?:href|action)="([^"]+\.html)"/g, (match, target) => {
          const route = routeMap[target];
          return route ? match.replace(target, route) : match;
        });
      const rewrittenScripts = scripts.map((script) => script.replace(/(['"])([a-z-]+\.html)\1/g, (whole, quote, target) => routeMap[target] ? `${quote}${routeMap[target]}${quote}` : whole));
      setPage({ styles, body, scripts: rewrittenScripts, title: parsed.title || title });
    }).catch((error) => setPage({ error: error.message }));
    return () => { active = false; };
  }, [file, title]);

  useEffect(() => {
    if (!page || page.error || !container.current) return undefined;
    document.title = page.title;
    const style = document.createElement('style');
    style.dataset.legacyPage = file;
    style.textContent = page.styles;
    document.head.appendChild(style);
    container.current.innerHTML = page.body;
    for (const code of page.scripts) {
      const script = document.createElement('script');
      script.textContent = code;
      container.current.appendChild(script);
    }
    const handleClick = (event) => {
      const anchor = event.target.closest('a[href]');
      if (!anchor) return;
      const target = anchor.getAttribute('href');
      if (Object.values(routeMap).includes(target)) {
        event.preventDefault();
        navigate(target);
      }
    };
    container.current.addEventListener('click', handleClick);
    return () => {
      container.current?.removeEventListener('click', handleClick);
      style.remove();
      if (container.current) container.current.replaceChildren();
    };
  }, [page, file, navigate]);

  if (!page) return <div aria-live="polite" className="page-loading">Loading…</div>;
  if (page.error) return <main className="migration-error"><h1>Page unavailable</h1><p>{page.error}</p></main>;
  return <div ref={container} />;
}
