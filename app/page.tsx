"use client";

import { useState, useEffect } from 'react';

type Font = { name: string; family: string; url?: string };
type LayoutTheme = { name: string; bg: string; border: string; text: string; accent: string; cardBg: string };
type Layout = {
  id: number; title: string; description: string; html: string;
  theme: LayoutTheme; font: Font; prompt: string; createdAt: string; variant: string;
};
type Project = { id: number; name: string; layouts: Layout[]; createdAt: string };
type ChatHistory = { prompt: string; layouts: Layout[]; date: string };

const APP_THEMES: Record<string, { name: string; sidebar: string; sidebarBorder: string; mainBg: string; cardBg: string; cardBorder: string; text: string; subtext: string; inputBg: string; inputBorder: string; btnPrimary: string; btnSecondary: string; accent: string }> = {
  dark: { name: 'Dark', sidebar: '#0d0d0f', sidebarBorder: '#1a1a2e', mainBg: '#050508', cardBg: '#111118', cardBorder: '#1e1e2e', text: '#f0f0ff', subtext: '#6b7280', inputBg: '#0d0d1a', inputBorder: '#2d2d4e', btnPrimary: 'linear-gradient(135deg,#6366f1,#8b5cf6)', btnSecondary: '#1e1e2e', accent: '#6366f1' },
  midnight: { name: 'Midnight', sidebar: '#0f172a', sidebarBorder: '#1e293b', mainBg: '#060b14', cardBg: '#0f172a', cardBorder: '#1e293b', text: '#e2e8f0', subtext: '#64748b', inputBg: '#0f172a', inputBorder: '#334155', btnPrimary: 'linear-gradient(135deg,#3b82f6,#2563eb)', btnSecondary: '#1e293b', accent: '#3b82f6' },
  forest: { name: 'Forest', sidebar: '#0a1a0f', sidebarBorder: '#14332b', mainBg: '#050f08', cardBg: '#0a1a0f', cardBorder: '#1a3320', text: '#d1fae5', subtext: '#6b9e7e', inputBg: '#0a1a0f', inputBorder: '#1a3320', btnPrimary: 'linear-gradient(135deg,#22c55e,#16a34a)', btnSecondary: '#1a3320', accent: '#22c55e' },
  sunset: { name: 'Sunset', sidebar: '#1a0a05', sidebarBorder: '#3b1a10', mainBg: '#0f0503', cardBg: '#1a0a05', cardBorder: '#3b1a10', text: '#fed7aa', subtext: '#92400e', inputBg: '#1a0a05', inputBorder: '#3b1a10', btnPrimary: 'linear-gradient(135deg,#f97316,#ef4444)', btnSecondary: '#3b1a10', accent: '#f97316' },
  aurora: { name: 'Aurora', sidebar: '#0a0a1a', sidebarBorder: '#1a1040', mainBg: '#050510', cardBg: '#0a0a1a', cardBorder: '#1a1040', text: '#e0d7ff', subtext: '#7c6fcd', inputBg: '#0a0a1a', inputBorder: '#2d2060', btnPrimary: 'linear-gradient(135deg,#a855f7,#ec4899)', btnSecondary: '#1a1040', accent: '#a855f7' },
  light: { name: 'Light', sidebar: '#f8fafc', sidebarBorder: '#e2e8f0', mainBg: '#ffffff', cardBg: '#f1f5f9', cardBorder: '#e2e8f0', text: '#0f172a', subtext: '#64748b', inputBg: '#ffffff', inputBorder: '#cbd5e1', btnPrimary: 'linear-gradient(135deg,#6366f1,#8b5cf6)', btnSecondary: '#e2e8f0', accent: '#6366f1' },
};

const LAYOUT_THEMES: LayoutTheme[] = [
  { name: 'Ocean', bg: '#eff6ff', border: '#3b82f6', text: '#1e3a5f', accent: '#2563eb', cardBg: '#dbeafe' },
  { name: 'Forest', bg: '#f0fdf4', border: '#22c55e', text: '#14532d', accent: '#16a34a', cardBg: '#dcfce7' },
  { name: 'Sunset', bg: '#fff7ed', border: '#f97316', text: '#7c2d12', accent: '#ea580c', cardBg: '#ffedd5' },
  { name: 'Lavender', bg: '#faf5ff', border: '#a855f7', text: '#4c1d95', accent: '#9333ea', cardBg: '#f3e8ff' },
  { name: 'Rose', bg: '#fff1f2', border: '#f43f5e', text: '#881337', accent: '#e11d48', cardBg: '#ffe4e6' },
  { name: 'Midnight', bg: '#0f172a', border: '#475569', text: '#e2e8f0', accent: '#94a3b8', cardBg: '#1e293b' },
  { name: 'Emerald', bg: '#ecfdf5', border: '#10b981', text: '#064e3b', accent: '#059669', cardBg: '#d1fae5' },
  { name: 'Amber', bg: '#fffbeb', border: '#f59e0b', text: '#78350f', accent: '#d97706', cardBg: '#fef3c7' },
  { name: 'Slate', bg: '#f8fafc', border: '#64748b', text: '#0f172a', accent: '#475569', cardBg: '#f1f5f9' },
  { name: 'Crimson', bg: '#fff5f5', border: '#dc2626', text: '#7f1d1d', accent: '#b91c1c', cardBg: '#fee2e2' },
];

const LAYOUT_FONTS: Font[] = [
  { name: 'Inter', family: 'Inter, sans-serif', url: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap' },
  { name: 'Poppins', family: 'Poppins, sans-serif', url: 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap' },
  { name: 'Playfair', family: '"Playfair Display", serif', url: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap' },
  { name: 'Space Mono', family: '"Space Mono", monospace', url: 'https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap' },
  { name: 'DM Sans', family: '"DM Sans", sans-serif', url: 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;600;700&display=swap' },
  { name: 'Raleway', family: 'Raleway, sans-serif', url: 'https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;600;700&display=swap' },
  { name: 'Nunito', family: 'Nunito, sans-serif', url: 'https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;600;700&display=swap' },
  { name: 'Josefin', family: '"Josefin Sans", sans-serif', url: 'https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@300;400;600;700&display=swap' },
];

const VARIANT_DESCRIPTIONS: Record<string, string> = {
  hero: 'Bold hero with gradient background, headline & dual CTA buttons',
  cards: 'Feature grid with icon cards and structured layout',
  minimal: 'Clean minimal design with badge, tagline, and dual CTA',
  dashboard: 'Dark analytics dashboard with live stats & bar chart',
  glass: 'Glassmorphism style with frosted background overlay',
  pricing: 'Side-by-side pricing tiers with highlighted popular plan',
};

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [layouts, setLayouts] = useState<Layout[]>([]);
  const [showLayouts, setShowLayouts] = useState(false);
  const [message, setMessage] = useState('');
  const [activeView, setActiveView] = useState<'Home' | 'Projects' | 'Chats' | 'Settings'>('Home');
  const [chats, setChats] = useState<ChatHistory[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedChat, setSelectedChat] = useState<ChatHistory | null>(null);
  const [expandedLayout, setExpandedLayout] = useState<Layout | null>(null);
  const [editingProjectName, setEditingProjectName] = useState<number | null>(null);
  const [newProjectName, setNewProjectName] = useState('');
  const [settings, setSettings] = useState({ autoSave: true, userName: 'User', layoutCount: '3', appTheme: 'dark' });

  const T = APP_THEMES[settings.appTheme] || APP_THEMES.dark;
  const suggestions = ['Landing page', 'Todo app', 'Dashboard', 'Blog', 'E-commerce', 'Portfolio', 'Chat app', 'Calculator'];

  useEffect(() => {
    LAYOUT_FONTS.forEach(font => {
      if (!font.url) return;
      if (document.querySelector(`link[href="${font.url}"]`)) return;
      const link = document.createElement('link');
      link.rel = 'stylesheet'; link.href = font.url;
      document.head.appendChild(link);
    });
  }, []);

  const showMsg = (msg: string, dur = 2500) => { setMessage(msg); setTimeout(() => setMessage(''), dur); };

  const buildHTML = (promptText: string, theme: LayoutTheme, font: Font, variant: string): string => {
    const { bg, border, text, accent, cardBg } = theme;
    const ff = font.family;
    if (variant === 'hero') return `<div style="font-family:${ff};min-height:185px;background:linear-gradient(135deg,${border},${accent});border-radius:14px;padding:26px;color:white;position:relative;overflow:hidden"><div style="position:absolute;top:-40px;right:-30px;width:130px;height:130px;background:rgba(255,255,255,0.07);border-radius:50%"></div><div style="position:absolute;bottom:-20px;right:50px;width:70px;height:70px;background:rgba(255,255,255,0.05);border-radius:50%"></div><p style="font-size:0.58rem;letter-spacing:0.15em;opacity:0.7;margin:0 0 8px;text-transform:uppercase">Introducing</p><h1 style="font-size:1.35rem;font-weight:700;margin:0 0 8px;line-height:1.2">${promptText}</h1><p style="font-size:0.76rem;margin:0 0 18px;opacity:0.85;max-width:220px;line-height:1.5">The smartest way to build modern interfaces fast.</p><div style="display:flex;gap:10px"><button style="background:white;color:${accent};padding:8px 18px;border-radius:8px;border:none;font-size:0.76rem;cursor:pointer;font-weight:700;font-family:${ff}">Get Started →</button><button style="background:rgba(255,255,255,0.15);color:white;padding:8px 14px;border-radius:8px;border:1px solid rgba(255,255,255,0.3);font-size:0.76rem;cursor:pointer;font-family:${ff}">Learn more</button></div></div>`;
    if (variant === 'cards') return `<div style="font-family:${ff};padding:12px;background:${bg};border-radius:14px;border:1px solid ${border}30"><p style="font-size:0.6rem;font-weight:700;color:${accent};letter-spacing:0.1em;text-transform:uppercase;margin:0 0 10px">${promptText}</p><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">${[['⚡','Lightning Fast','Blazing performance'],['🎨','Beautiful UI','Pixel perfect design'],['🔒','Secure','Enterprise grade'],['📱','Responsive','Works everywhere']].map(([ic,lb,ds])=>`<div style="background:${cardBg};border:1px solid ${border}40;border-radius:10px;padding:12px"><div style="font-size:1.1rem;margin-bottom:6px">${ic}</div><p style="font-weight:700;font-size:0.72rem;color:${text};margin:0 0 3px">${lb}</p><p style="font-size:0.62rem;color:${text};opacity:0.6;margin:0">${ds}</p></div>`).join('')}</div></div>`;
    if (variant === 'minimal') return `<div style="font-family:${ff};padding:24px;background:white;border-radius:14px;border:1px solid #e5e7eb"><div style="display:inline-block;background:${border}15;color:${accent};padding:4px 12px;border-radius:99px;font-size:0.62rem;font-weight:700;margin-bottom:14px;border:1px solid ${border}30">✦ NEW</div><h2 style="font-size:1.2rem;font-weight:300;color:#111;margin:0 0 10px;line-height:1.3">${promptText}</h2><p style="color:#6b7280;font-size:0.76rem;margin:0 0 18px;line-height:1.6">Clean, minimal, and powerful. Built for teams who care about craft.</p><div style="display:flex;gap:10px;align-items:center"><button style="padding:9px 20px;background:${accent};color:white;border-radius:8px;border:none;font-size:0.76rem;font-weight:700;cursor:pointer;font-family:${ff}">Start Free</button><button style="padding:9px 16px;background:transparent;color:#374151;border-radius:8px;border:1px solid #e5e7eb;font-size:0.76rem;cursor:pointer;font-family:${ff}">See demo →</button></div></div>`;
    if (variant === 'dashboard') return `<div style="font-family:${ff};background:#111827;color:white;padding:16px;border-radius:14px"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px"><h3 style="font-weight:700;font-size:0.82rem;margin:0">${promptText}</h3><span style="font-size:0.58rem;color:#22c55e;background:#052e16;padding:3px 10px;border-radius:99px;border:1px solid #15803d">● Live</span></div><div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px"><div style="background:#1f2937;padding:12px;border-radius:10px;border:1px solid #374151"><p style="font-size:0.58rem;color:#9ca3af;margin:0 0 4px;text-transform:uppercase;letter-spacing:0.05em">Users</p><p style="font-size:1.5rem;font-weight:800;margin:0;line-height:1">1.2K</p><p style="font-size:0.58rem;color:#22c55e;margin:4px 0 0">↑ 12%</p></div><div style="background:#1f2937;padding:12px;border-radius:10px;border:1px solid #374151"><p style="font-size:0.58rem;color:#9ca3af;margin:0 0 4px;text-transform:uppercase;letter-spacing:0.05em">Revenue</p><p style="font-size:1.5rem;font-weight:800;margin:0;line-height:1">$12K</p><p style="font-size:0.58rem;color:#22c55e;margin:4px 0 0">↑ 8%</p></div></div><div style="background:#1f2937;border-radius:10px;padding:10px;border:1px solid #374151"><div style="display:flex;justify-content:space-between;font-size:0.6rem;color:#9ca3af;margin-bottom:7px"><span>Activity</span><span>7 days</span></div><div style="display:flex;align-items:flex-end;gap:4px;height:38px">${[40,65,35,80,55,90,70].map(h=>`<div style="flex:1;background:${border};border-radius:3px 3px 0 0;height:${h}%;opacity:0.85"></div>`).join('')}</div></div></div>`;
    if (variant === 'glass') return `<div style="font-family:${ff};background:linear-gradient(135deg,#1e3a5f,#0f172a);padding:20px;border-radius:14px;min-height:170px"><div style="background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.12);border-radius:12px;padding:20px;color:white"><div style="display:flex;align-items:center;gap:8px;margin-bottom:12px"><div style="width:8px;height:8px;background:${border};border-radius:50%"></div><p style="font-size:0.58rem;color:rgba(255,255,255,0.5);letter-spacing:0.12em;margin:0;text-transform:uppercase">Introducing</p></div><h2 style="font-size:1.25rem;font-weight:700;margin:0 0 10px">${promptText}</h2><p style="font-size:0.74rem;color:rgba(255,255,255,0.55);margin:0 0 16px;line-height:1.5">Next-generation platform with glass morphism UI.</p><button style="background:rgba(255,255,255,0.15);color:white;padding:8px 18px;border-radius:8px;border:1px solid rgba(255,255,255,0.25);font-size:0.76rem;cursor:pointer;font-weight:600;font-family:${ff}">Explore →</button></div></div>`;
    if (variant === 'pricing') return `<div style="font-family:${ff};background:${bg};padding:14px;border-radius:14px;border:1px solid ${border}30"><p style="text-align:center;font-size:0.62rem;font-weight:700;color:${accent};letter-spacing:0.1em;text-transform:uppercase;margin:0 0 12px">${promptText} Pricing</p><div style="display:grid;grid-template-columns:1fr 1fr;gap:10px"><div style="background:white;border:1px solid ${border}30;border-radius:10px;padding:14px;text-align:center"><p style="font-size:0.68rem;font-weight:700;color:${text};margin:0 0 8px">Starter</p><p style="font-size:1.6rem;font-weight:800;color:${text};margin:0 0 4px">$9</p><p style="font-size:0.58rem;color:${text};opacity:0.5;margin:0 0 12px">/month</p><button style="width:100%;padding:6px;background:${cardBg};color:${accent};border:1px solid ${border}50;border-radius:6px;font-size:0.68rem;cursor:pointer;font-family:${ff}">Choose</button></div><div style="background:${accent};border-radius:10px;padding:14px;text-align:center;position:relative"><div style="position:absolute;top:-8px;left:50%;transform:translateX(-50%);background:#f59e0b;color:white;font-size:0.52rem;font-weight:700;padding:2px 8px;border-radius:99px;white-space:nowrap">POPULAR</div><p style="font-size:0.68rem;font-weight:700;color:white;margin:0 0 8px">Pro</p><p style="font-size:1.6rem;font-weight:800;color:white;margin:0 0 4px">$29</p><p style="font-size:0.58rem;color:rgba(255,255,255,0.6);margin:0 0 12px">/month</p><button style="width:100%;padding:6px;background:white;color:${accent};border:none;border-radius:6px;font-size:0.68rem;font-weight:700;cursor:pointer;font-family:${ff}">Choose</button></div></div></div>`;
    return '';
  };

  const makeLayouts = (promptText: string): Layout[] => {
    const count = parseInt(settings.layoutCount) || 3;
    const themes = [...LAYOUT_THEMES].sort(() => Math.random() - 0.5);
    const fonts = [...LAYOUT_FONTS].sort(() => Math.random() - 0.5);
    const variants = ['hero', 'cards', 'minimal', 'dashboard', 'glass', 'pricing'].sort(() => Math.random() - 0.5);
    const now = new Date().toLocaleString();
    return Array.from({ length: count }, (_, i) => {
      const variant = variants[i % variants.length];
      const theme = themes[i % themes.length];
      const font = fonts[i % fonts.length];
      return { id: i, title: `${promptText} — ${variant.charAt(0).toUpperCase() + variant.slice(1)}`, description: VARIANT_DESCRIPTIONS[variant], html: buildHTML(promptText, theme, font, variant), theme, font, prompt: promptText, createdAt: now, variant };
    });
  };

  const generateLayouts = (customPrompt?: string) => {
    const fp = customPrompt || prompt;
    if (!fp.trim()) { showMsg('❌ Please enter a prompt!'); return; }
    setLoading(true); setShowLayouts(true); setActiveView('Home');
    setSelectedProject(null); setSelectedChat(null); showMsg('🎨 Creating layouts...');
    setTimeout(() => {
      const nl = makeLayouts(fp); setLayouts(nl);
      const entry: ChatHistory = { prompt: fp, layouts: nl, date: new Date().toLocaleString() };
      setChats(prev => [entry, ...prev].slice(0, 30));
      if (settings.autoSave) setProjects(prev => [{ id: Date.now(), name: fp, layouts: nl, createdAt: new Date().toLocaleString() }, ...prev].slice(0, 30));
      showMsg('✅ Layouts ready!'); setLoading(false);
    }, 650);
  };

  const changeFont = (id: number) => {
    setLayouts(prev => prev.map(l => {
      if (l.id !== id) return l;
      const idx = LAYOUT_FONTS.findIndex(f => f.name === l.font.name);
      const nf = LAYOUT_FONTS[(idx + 1) % LAYOUT_FONTS.length];
      showMsg(`✏️ Font → ${nf.name}`, 1500);
      return { ...l, font: nf, html: buildHTML(l.prompt, l.theme, nf, l.variant) };
    }));
  };

  const changeColor = (id: number) => {
    setLayouts(prev => prev.map(l => {
      if (l.id !== id) return l;
      const idx = LAYOUT_THEMES.findIndex(t => t.name === l.theme.name);
      const nt = LAYOUT_THEMES[(idx + 1) % LAYOUT_THEMES.length];
      showMsg(`🎨 Theme → ${nt.name}`, 1500);
      return { ...l, theme: nt, html: buildHTML(l.prompt, nt, l.font, l.variant) };
    }));
  };

  const regenLayout = (id: number) => {
    setLayouts(prev => prev.map(l => {
      if (l.id !== id) return l;
      const nt = LAYOUT_THEMES[Math.floor(Math.random() * LAYOUT_THEMES.length)];
      const nf = LAYOUT_FONTS[Math.floor(Math.random() * LAYOUT_FONTS.length)];
      const vs = ['hero','cards','minimal','dashboard','glass','pricing'];
      const nv = vs[Math.floor(Math.random() * vs.length)];
      showMsg('🔄 Regenerated!', 1500);
      return { ...l, theme: nt, font: nf, variant: nv, title: `${l.prompt} — ${nv.charAt(0).toUpperCase()+nv.slice(1)}`, description: VARIANT_DESCRIPTIONS[nv], html: buildHTML(l.prompt, nt, nf, nv) };
    }));
  };

  const saveToProject = (layout: Layout) => {
    setProjects(prev => [{ id: Date.now(), name: layout.title, layouts: [layout], createdAt: layout.createdAt }, ...prev]);
    showMsg('💾 Saved to Projects!');
  };
  const deleteProject = (id: number) => { setProjects(prev => prev.filter(p => p.id !== id)); if (selectedProject?.id === id) setSelectedProject(null); showMsg('🗑️ Deleted'); };
  const deleteChat = (index: number) => { const c = chats[index]; setChats(prev => prev.filter((_, i) => i !== index)); if (selectedChat === c) setSelectedChat(null); showMsg('🗑️ Removed'); };
  const loadChat = (chat: ChatHistory) => { setLayouts(chat.layouts); setShowLayouts(true); setPrompt(chat.prompt); setSelectedChat(chat); setActiveView('Home'); };
  const loadProject = (project: Project) => { setLayouts(project.layouts); setShowLayouts(true); setPrompt(project.name); setSelectedProject(project); setActiveView('Home'); };
  const startNew = () => { setPrompt(''); setShowLayouts(false); setLayouts([]); setActiveView('Home'); setSelectedProject(null); setSelectedChat(null); showMsg('✨ New session'); };

  // --- LAYOUT CARD ---
  const LayoutCard = ({ layout, editable = true }: { layout: Layout; editable?: boolean }) => (
    <div style={{ background: T.cardBg, border: `1px solid ${T.cardBorder}`, borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '12px 14px', borderBottom: `1px solid ${T.cardBorder}` }}>
        <p style={{ fontWeight: 700, fontSize: '0.78rem', color: T.text, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{layout.title}</p>
        <p style={{ fontSize: '0.6rem', color: T.subtext, margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{layout.description}</p>
      </div>
      <div style={{ padding: '10px', background: T.mainBg }}>
        <div style={{ borderRadius: '8px', overflow: 'hidden', border: `1px solid ${T.cardBorder}` }}>
          <div dangerouslySetInnerHTML={{ __html: layout.html }} />
        </div>
      </div>
      <div style={{ padding: '8px 12px', display: 'flex', gap: '6px', borderBottom: `1px solid ${T.cardBorder}` }}>
        <span style={{ fontSize: '0.6rem', padding: '3px 9px', background: `${layout.theme.accent}25`, color: layout.theme.accent, borderRadius: '99px', border: `1px solid ${layout.theme.accent}45`, fontWeight: 600 }}>{layout.theme.name}</span>
        <span style={{ fontSize: '0.6rem', padding: '3px 9px', background: T.inputBg, color: T.subtext, borderRadius: '99px', border: `1px solid ${T.cardBorder}` }}>{layout.font.name}</span>
      </div>
      <div style={{ padding: '10px 10px', display: 'grid', gridTemplateColumns: editable ? '1fr 1fr 1fr 1fr' : '1fr', gap: '5px' }}>
        {editable ? (<>
          <button onClick={() => changeFont(layout.id)} style={bs('#3b82f6')}>✏️ Font</button>
          <button onClick={() => changeColor(layout.id)} style={bs('#a855f7')}>🎨 Color</button>
          <button onClick={() => regenLayout(layout.id)} style={bs('#0891b2')}>🔄 Regen</button>
          <button onClick={() => saveToProject(layout)} style={bs('#16a34a')}>💾 Save</button>
          <button onClick={() => setExpandedLayout(layout)} style={{ ...bs('#374151'), gridColumn: 'span 4' }}>🔍 Full Preview</button>
        </>) : (
          <button onClick={() => setExpandedLayout(layout)} style={bs('#374151')}>🔍 Full Preview</button>
        )}
      </div>
    </div>
  );
  const bs = (bg: string) => ({ padding: '7px 4px', background: bg, color: '#fff', border: 'none', borderRadius: '7px', fontSize: '0.68rem', fontWeight: 600, cursor: 'pointer' } as React.CSSProperties);

  // --- HOME ---
  const renderHome = () => (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '38px 34px' }}>
      {message && <div style={{ marginBottom: '18px', background: T.cardBg, border: `1px solid ${T.cardBorder}`, borderRadius: '10px', padding: '12px 20px', textAlign: 'center', fontSize: '0.82rem', color: T.text }}>{message}</div>}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '2.3rem', fontWeight: 300, background: 'linear-gradient(to right,#fff,#6b7280)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0, lineHeight: 1.2 }}>What can we build?</h2>
        <p style={{ color: T.subtext, marginTop: '8px', fontSize: '0.82rem' }}>Describe any UI — get {settings.layoutCount} unique layouts with live theme, font & color controls</p>
      </div>
      <div style={{ position: 'relative', marginBottom: '12px' }}>
        <input type="text" value={prompt} onChange={e => setPrompt(e.target.value)} onKeyDown={e => e.key === 'Enter' && generateLayouts()}
          style={{ width: '100%', boxSizing: 'border-box', background: T.inputBg, border: `1px solid ${T.inputBorder}`, borderRadius: '12px', padding: '15px 50px 15px 20px', fontSize: '1rem', color: T.text, outline: 'none' }}
          placeholder="e.g. Create a pricing page for a SaaS app..." />
        {prompt && <button onClick={() => setPrompt('')} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: T.subtext, cursor: 'pointer', fontSize: '1rem' }}>✕</button>}
      </div>
      <button onClick={() => generateLayouts()} disabled={loading} style={{ width: '100%', padding: '14px', background: T.btnPrimary, border: 'none', borderRadius: '12px', color: '#fff', fontWeight: 700, fontSize: '0.95rem', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.65 : 1, marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
        {loading ? (<><span style={{ width: '16px', height: '16px', border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }}></span>Generating...</>) : `✨ Generate ${settings.layoutCount} Layouts`}
      </button>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px', marginBottom: '32px' }}>
        {suggestions.map(s => <button key={s} onClick={() => { setPrompt(s); generateLayouts(s); }} style={{ padding: '7px 15px', background: T.cardBg, border: `1px solid ${T.cardBorder}`, borderRadius: '99px', color: T.text, fontSize: '0.78rem', cursor: 'pointer' }}>{s}</button>)}
      </div>
      {showLayouts && layouts.length > 0 ? (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: T.text, margin: 0 }}>✨ Generated Layouts</h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => generateLayouts(prompt)} style={{ padding: '8px 16px', background: T.btnPrimary, border: 'none', borderRadius: '8px', color: '#fff', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}>🔄 Regen All</button>
              <button onClick={startNew} style={{ padding: '8px 14px', background: T.btnSecondary, border: `1px solid ${T.cardBorder}`, borderRadius: '8px', color: T.text, fontSize: '0.78rem', cursor: 'pointer' }}>+ New</button>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(layouts.length, 3)}, 1fr)`, gap: '14px' }}>
            {layouts.map(l => <LayoutCard key={l.id} layout={l} editable />)}
          </div>
        </div>
      ) : !showLayouts && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: T.subtext }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '14px', opacity: 0.4 }}>✦</div>
          <p style={{ fontSize: '0.95rem' }}>Enter a prompt to generate layouts</p>
          <p style={{ fontSize: '0.78rem', marginTop: '6px', opacity: 0.65 }}>Or click a suggestion above</p>
        </div>
      )}
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  // --- PROJECTS ---
  const renderProjects = () => (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '38px 34px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div><h2 style={{ fontSize: '1.7rem', fontWeight: 300, color: T.text, margin: 0 }}>Projects</h2><p style={{ color: T.subtext, fontSize: '0.78rem', marginTop: '4px' }}>{projects.length} saved</p></div>
        {selectedProject && <button onClick={() => setSelectedProject(null)} style={{ padding: '7px 14px', background: T.btnSecondary, border: `1px solid ${T.cardBorder}`, borderRadius: '8px', color: T.text, fontSize: '0.78rem', cursor: 'pointer' }}>← Back</button>}
      </div>
      {message && <div style={{ marginBottom: '14px', background: T.cardBg, border: `1px solid ${T.cardBorder}`, borderRadius: '8px', padding: '10px', textAlign: 'center', fontSize: '0.78rem', color: T.text }}>{message}</div>}
      {projects.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0', color: T.subtext }}>
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>📁</div>
          <p style={{ fontSize: '0.95rem', color: T.text, marginBottom: '6px' }}>No projects yet</p>
          <p style={{ fontSize: '0.78rem', marginBottom: '18px' }}>Generate layouts and click 💾 Save</p>
          <button onClick={() => setActiveView('Home')} style={{ padding: '10px 22px', background: T.btnPrimary, border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer' }}>Go Generate →</button>
        </div>
      ) : selectedProject ? (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            {editingProjectName === selectedProject.id ? (
              <div style={{ display: 'flex', gap: '8px', flex: 1 }}>
                <input value={newProjectName} onChange={e => setNewProjectName(e.target.value)} style={{ flex: 1, background: T.inputBg, border: `1px solid ${T.inputBorder}`, borderRadius: '8px', padding: '8px 12px', color: T.text, fontSize: '0.82rem', outline: 'none' }} />
                <button onClick={() => { setProjects(p => p.map(x => x.id === selectedProject.id ? { ...x, name: newProjectName } : x)); setSelectedProject(p => p ? { ...p, name: newProjectName } : null); setEditingProjectName(null); showMsg('✅ Renamed!'); }} style={{ padding: '8px 14px', background: '#16a34a', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '0.78rem', cursor: 'pointer' }}>Save</button>
                <button onClick={() => setEditingProjectName(null)} style={{ padding: '8px 12px', background: T.btnSecondary, border: `1px solid ${T.cardBorder}`, borderRadius: '8px', color: T.text, fontSize: '0.78rem', cursor: 'pointer' }}>Cancel</button>
              </div>
            ) : (<>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: T.text, margin: 0, flex: 1 }}>{selectedProject.name}</h3>
              <button onClick={() => { setEditingProjectName(selectedProject.id); setNewProjectName(selectedProject.name); }} style={{ padding: '5px 12px', background: T.btnSecondary, border: `1px solid ${T.cardBorder}`, borderRadius: '6px', color: T.subtext, fontSize: '0.72rem', cursor: 'pointer' }}>✏️ Rename</button>
              <button onClick={() => loadProject(selectedProject)} style={{ padding: '5px 12px', background: T.btnPrimary, border: 'none', borderRadius: '6px', color: '#fff', fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer' }}>Load & Edit →</button>
            </>)}
          </div>
          <p style={{ color: T.subtext, fontSize: '0.68rem', marginBottom: '18px' }}>{selectedProject.createdAt} · {selectedProject.layouts.length} layout{selectedProject.layouts.length !== 1 ? 's' : ''}</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '14px' }}>
            {selectedProject.layouts.map(l => <LayoutCard key={l.id} layout={l} editable={false} />)}
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '12px' }}>
          {projects.map(p => (
            <div key={p.id} onClick={() => setSelectedProject(p)} style={{ background: T.cardBg, border: `1px solid ${T.cardBorder}`, borderRadius: '12px', padding: '16px', cursor: 'pointer' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{ fontWeight: 600, color: T.text, fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0 }}>{p.name}</h3>
                  <span style={{ color: T.subtext, fontSize: '0.62rem' }}>{p.createdAt}</span>
                </div>
                <button onClick={e => { e.stopPropagation(); deleteProject(p.id); }} style={{ background: 'none', border: 'none', color: T.subtext, cursor: 'pointer', fontSize: '0.82rem' }}>🗑️</button>
              </div>
              <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginBottom: '8px' }}>
                {p.layouts.slice(0, 4).map((l, i) => <span key={i} style={{ fontSize: '0.6rem', padding: '2px 7px', background: `${l.theme.accent}20`, color: l.theme.accent, borderRadius: '99px', border: `1px solid ${l.theme.accent}40` }}>{l.theme.name}</span>)}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.68rem', color: T.subtext }}>{p.layouts.length} layout{p.layouts.length !== 1 ? 's' : ''}</span>
                <span style={{ fontSize: '0.68rem', color: T.accent }}>View →</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // --- CHATS ---
  const renderChats = () => (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '38px 34px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div><h2 style={{ fontSize: '1.7rem', fontWeight: 300, color: T.text, margin: 0 }}>Chat History</h2><p style={{ color: T.subtext, fontSize: '0.78rem', marginTop: '4px' }}>{chats.length} session{chats.length !== 1 ? 's' : ''}</p></div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {selectedChat && <button onClick={() => setSelectedChat(null)} style={{ padding: '7px 12px', background: T.btnSecondary, border: `1px solid ${T.cardBorder}`, borderRadius: '8px', color: T.text, fontSize: '0.78rem', cursor: 'pointer' }}>← Back</button>}
          {chats.length > 0 && !selectedChat && <button onClick={() => { setChats([]); setSelectedChat(null); showMsg('🗑️ Cleared'); }} style={{ padding: '7px 12px', background: 'rgba(127,29,29,0.25)', border: '1px solid #991b1b', borderRadius: '8px', color: '#f87171', fontSize: '0.78rem', cursor: 'pointer' }}>Clear All</button>}
        </div>
      </div>
      {message && <div style={{ marginBottom: '14px', background: T.cardBg, border: `1px solid ${T.cardBorder}`, borderRadius: '8px', padding: '10px', textAlign: 'center', fontSize: '0.78rem', color: T.text }}>{message}</div>}
      {selectedChat ? (
        <div>
          <div style={{ marginBottom: '18px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: T.text, margin: '0 0 4px' }}>{selectedChat.prompt}</h3>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <span style={{ color: T.subtext, fontSize: '0.68rem' }}>{selectedChat.date}</span>
              <button onClick={() => loadChat(selectedChat)} style={{ padding: '4px 12px', background: T.btnPrimary, border: 'none', borderRadius: '6px', color: '#fff', fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer' }}>Load & Edit →</button>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '14px' }}>
            {selectedChat.layouts.map(l => <LayoutCard key={l.id} layout={l} editable={false} />)}
          </div>
        </div>
      ) : chats.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0', color: T.subtext }}>
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>💬</div>
          <p style={{ fontSize: '0.95rem', color: T.text, marginBottom: '6px' }}>No history yet</p>
          <p style={{ fontSize: '0.78rem', marginBottom: '18px' }}>Generate some layouts first</p>
          <button onClick={() => setActiveView('Home')} style={{ padding: '10px 22px', background: T.btnPrimary, border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer' }}>Start →</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {chats.map((chat, i) => (
            <div key={i} onClick={() => setSelectedChat(chat)} style={{ background: T.cardBg, border: `1px solid ${T.cardBorder}`, borderRadius: '12px', padding: '14px 16px', cursor: 'pointer' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{ fontWeight: 500, color: T.text, fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0 }}>{chat.prompt}</h3>
                  <p style={{ color: T.subtext, fontSize: '0.62rem', marginTop: '3px' }}>{chat.date} · {chat.layouts.length} layouts</p>
                </div>
                <div style={{ display: 'flex', gap: '5px', marginLeft: '10px' }}>
                  <button onClick={e => { e.stopPropagation(); loadChat(chat); }} style={{ padding: '4px 10px', background: T.btnPrimary, border: 'none', borderRadius: '6px', color: '#fff', fontSize: '0.68rem', fontWeight: 600, cursor: 'pointer' }}>Load</button>
                  <button onClick={e => { e.stopPropagation(); deleteChat(i); }} style={{ background: 'none', border: 'none', color: T.subtext, cursor: 'pointer', fontSize: '0.78rem' }}>🗑️</button>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '5px', marginTop: '8px', flexWrap: 'wrap' }}>
                {chat.layouts.map((l, j) => <span key={j} style={{ fontSize: '0.58rem', padding: '2px 7px', background: `${l.theme.accent}20`, color: l.theme.accent, borderRadius: '99px', border: `1px solid ${l.theme.accent}35` }}>{l.theme.name}</span>)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // --- SETTINGS ---
  const SC = { background: T.cardBg, border: `1px solid ${T.cardBorder}`, borderRadius: '14px', padding: '20px', marginBottom: '12px' };
  const SL = { display: 'block', fontSize: '0.75rem', color: T.subtext, marginBottom: '8px' } as React.CSSProperties;

  const renderSettings = () => (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '38px 34px' }}>
      <h2 style={{ fontSize: '1.7rem', fontWeight: 300, color: T.text, margin: '0 0 4px' }}>Settings</h2>
      <p style={{ color: T.subtext, fontSize: '0.78rem', marginBottom: '24px' }}>Customize your v0 Clone experience</p>
      {message && <div style={{ marginBottom: '14px', background: T.cardBg, border: `1px solid ${T.cardBorder}`, borderRadius: '8px', padding: '10px', textAlign: 'center', fontSize: '0.78rem', color: T.text }}>{message}</div>}

      {/* Profile */}
      <div style={SC}>
        <h3 style={{ fontWeight: 700, color: T.text, marginBottom: '14px', fontSize: '0.9rem' }}>👤 Profile</h3>
        <label style={SL}>Display Name</label>
        <input value={settings.userName} onChange={e => setSettings(s => ({ ...s, userName: e.target.value }))} style={{ width: '100%', boxSizing: 'border-box', background: T.inputBg, border: `1px solid ${T.inputBorder}`, borderRadius: '8px', padding: '9px 14px', color: T.text, fontSize: '0.82rem', outline: 'none' }} placeholder="Your name" />
      </div>

      {/* App Theme */}
      <div style={SC}>
        <h3 style={{ fontWeight: 700, color: T.text, marginBottom: '4px', fontSize: '0.9rem' }}>🖥️ App Theme</h3>
        <p style={{ ...SL, marginBottom: '14px' }}>Overall app appearance</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '8px' }}>
          {Object.entries(APP_THEMES).map(([key, theme]) => (
            <button key={key} onClick={() => { setSettings(s => ({ ...s, appTheme: key })); showMsg(`✅ Theme: ${theme.name}`); }}
              style={{ padding: '12px 8px', background: theme.sidebar, border: settings.appTheme === key ? `2px solid ${theme.accent}` : `1px solid ${theme.sidebarBorder}`, borderRadius: '10px', cursor: 'pointer', textAlign: 'center' as const }}>
              <div style={{ display: 'flex', gap: '3px', justifyContent: 'center', marginBottom: '6px' }}>
                <div style={{ width: '10px', height: '10px', background: theme.sidebar, borderRadius: '2px', border: `1px solid ${theme.sidebarBorder}` }}></div>
                <div style={{ width: '22px', height: '10px', background: theme.mainBg, borderRadius: '2px', border: `1px solid ${theme.cardBorder}` }}></div>
              </div>
              <p style={{ fontSize: '0.65rem', fontWeight: settings.appTheme === key ? 700 : 400, color: theme.text, margin: 0 }}>{theme.name}</p>
              {settings.appTheme === key && <div style={{ width: '5px', height: '5px', background: theme.accent, borderRadius: '50%', margin: '5px auto 0' }}></div>}
            </button>
          ))}
        </div>
      </div>

      {/* Layout Themes */}
      <div style={SC}>
        <h3 style={{ fontWeight: 700, color: T.text, marginBottom: '4px', fontSize: '0.9rem' }}>🎨 Layout Color Themes</h3>
        <p style={{ ...SL, marginBottom: '12px' }}>Cycle with 🎨 Color button on each layout</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
          {LAYOUT_THEMES.map(theme => (
            <div key={theme.name} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '5px 11px', background: theme.bg, border: `2px solid ${theme.border}`, borderRadius: '99px' }}>
              <div style={{ width: '8px', height: '8px', background: theme.accent, borderRadius: '50%' }}></div>
              <span style={{ fontSize: '0.65rem', fontWeight: 600, color: theme.text }}>{theme.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Layout Fonts */}
      <div style={SC}>
        <h3 style={{ fontWeight: 700, color: T.text, marginBottom: '4px', fontSize: '0.9rem' }}>✏️ Layout Fonts</h3>
        <p style={{ ...SL, marginBottom: '12px' }}>Cycle with ✏️ Font button on each layout</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
          {LAYOUT_FONTS.map(font => (
            <div key={font.name} style={{ padding: '5px 13px', background: T.inputBg, border: `1px solid ${T.inputBorder}`, borderRadius: '99px' }}>
              <span style={{ fontSize: '0.72rem', color: T.text, fontFamily: font.family }}>{font.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Behavior */}
      <div style={SC}>
        <h3 style={{ fontWeight: 700, color: T.text, marginBottom: '14px', fontSize: '0.9rem' }}>⚙️ Behavior</h3>
        {[{ key: 'autoSave', label: 'Auto-save to Projects', desc: 'Automatically save each generation as a project' }].map(({ key, label, desc }) => (
          <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div><p style={{ fontSize: '0.82rem', color: T.text, margin: 0 }}>{label}</p><p style={{ fontSize: '0.68rem', color: T.subtext, marginTop: '2px' }}>{desc}</p></div>
            <button onClick={() => { setSettings(s => ({ ...s, [key]: !s[key as keyof typeof s] })); showMsg('✅ Updated', 1200); }} style={{ width: '44px', height: '24px', borderRadius: '12px', background: settings[key as keyof typeof settings] ? T.accent : T.inputBorder, border: 'none', cursor: 'pointer', position: 'relative', flexShrink: 0 }}>
              <span style={{ position: 'absolute', top: '3px', left: settings[key as keyof typeof settings] ? '22px' : '3px', width: '18px', height: '18px', background: '#fff', borderRadius: '50%', transition: 'left 0.18s' }}></span>
            </button>
          </div>
        ))}
        <label style={SL}>Layouts per generation</label>
        <select value={settings.layoutCount} onChange={e => { setSettings(s => ({ ...s, layoutCount: e.target.value })); showMsg(`✅ Count: ${e.target.value}`, 1200); }} style={{ width: '100%', background: T.inputBg, border: `1px solid ${T.inputBorder}`, borderRadius: '8px', padding: '9px 14px', color: T.text, fontSize: '0.82rem', outline: 'none' }}>
          <option value="2">2 layouts</option>
          <option value="3">3 layouts</option>
          <option value="4">4 layouts</option>
          <option value="5">5 layouts</option>
        </select>
      </div>

      {/* Data */}
      <div style={SC}>
        <h3 style={{ fontWeight: 700, color: T.text, marginBottom: '14px', fontSize: '0.9rem' }}>🗄️ Data</h3>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
          {[{ v: projects.length, l: 'Projects' }, { v: chats.length, l: 'Sessions' }, { v: chats.reduce((a, c) => a + c.layouts.length, 0), l: 'Layouts' }].map(({ v, l }) => (
            <div key={l} style={{ flex: 1, background: T.inputBg, borderRadius: '10px', padding: '12px', textAlign: 'center', border: `1px solid ${T.inputBorder}` }}>
              <p style={{ fontSize: '1.5rem', fontWeight: 800, color: T.text, margin: 0 }}>{v}</p>
              <p style={{ fontSize: '0.65rem', color: T.subtext, marginTop: '3px' }}>{l}</p>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => { setChats([]); showMsg('🗑️ Chats cleared'); }} style={{ flex: 1, padding: '9px', background: 'rgba(127,29,29,0.18)', border: '1px solid #991b1b', borderRadius: '8px', color: '#f87171', fontSize: '0.78rem', cursor: 'pointer' }}>Clear Chats</button>
          <button onClick={() => { setProjects([]); setSelectedProject(null); showMsg('🗑️ Projects deleted'); }} style={{ flex: 1, padding: '9px', background: 'rgba(127,29,29,0.18)', border: '1px solid #991b1b', borderRadius: '8px', color: '#f87171', fontSize: '0.78rem', cursor: 'pointer' }}>Delete Projects</button>
        </div>
      </div>
      <p style={{ textAlign: 'center', color: T.subtext, fontSize: '0.65rem', marginTop: '8px' }}>v0 Clone · Powered by Next.js</p>
    </div>
  );

  // --- MODAL ---
  const renderModal = () => expandedLayout && (
    <div onClick={() => setExpandedLayout(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '28px' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: T.cardBg, border: `1px solid ${T.cardBorder}`, borderRadius: '18px', maxWidth: '700px', width: '100%', maxHeight: '92vh', overflow: 'auto', boxShadow: '0 30px 70px rgba(0,0,0,0.7)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 22px', borderBottom: `1px solid ${T.cardBorder}` }}>
          <div><h3 style={{ fontWeight: 700, fontSize: '0.95rem', color: T.text, margin: 0 }}>{expandedLayout.title}</h3><p style={{ color: T.subtext, fontSize: '0.68rem', marginTop: '2px' }}>{expandedLayout.description}</p></div>
          <button onClick={() => setExpandedLayout(null)} style={{ width: '28px', height: '28px', background: T.inputBg, border: `1px solid ${T.cardBorder}`, borderRadius: '50%', color: T.text, cursor: 'pointer', fontSize: '0.78rem' }}>✕</button>
        </div>
        <div style={{ padding: '20px' }}>
          <div style={{ borderRadius: '12px', overflow: 'hidden', border: `1px solid ${T.cardBorder}` }}>
            <div dangerouslySetInnerHTML={{ __html: expandedLayout.html }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginTop: '14px' }}>
            {[{ l: 'Theme', v: expandedLayout.theme.name }, { l: 'Font', v: expandedLayout.font.name }, { l: 'Variant', v: expandedLayout.variant }].map(({ l, v }) => (
              <div key={l} style={{ background: T.inputBg, borderRadius: '8px', padding: '10px', border: `1px solid ${T.inputBorder}` }}>
                <p style={{ fontSize: '0.58rem', color: T.subtext, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 3px' }}>{l}</p>
                <p style={{ color: T.text, fontWeight: 600, margin: 0, fontSize: '0.78rem' }}>{v}</p>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
            <button onClick={() => { saveToProject(expandedLayout); setExpandedLayout(null); }} style={{ flex: 1, padding: '11px', background: '#16a34a', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}>💾 Save to Projects</button>
            <button onClick={() => setExpandedLayout(null)} style={{ flex: 1, padding: '11px', background: T.btnSecondary, border: `1px solid ${T.cardBorder}`, borderRadius: '8px', color: T.text, fontSize: '0.82rem', cursor: 'pointer' }}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const menuItems: Array<'Home' | 'Projects' | 'Chats' | 'Settings'> = ['Home', 'Projects', 'Chats', 'Settings'];
  const menuIcons: Record<string, string> = { Home: '🏠', Projects: '📁', Chats: '💬', Settings: '⚙️' };

  const sidebarW = sidebarOpen ? '228px' : '56px';

  return (
    <div style={{ display: 'flex', height: '100vh', background: T.mainBg, color: T.text, overflow: 'hidden', fontFamily: 'system-ui,-apple-system,sans-serif' }}>

      {/* --- SIDEBAR --- */}
      <div style={{
        width: sidebarW, minWidth: sidebarW, maxWidth: sidebarW,
        background: T.sidebar, borderRight: `1px solid ${T.sidebarBorder}`,
        display: 'flex', flexDirection: 'column',
        padding: sidebarOpen ? '20px 13px' : '20px 8px',
        overflow: 'hidden',
        transition: 'width 0.22s ease, min-width 0.22s ease, max-width 0.22s ease, padding 0.22s ease',
      }}>

        {/* Top row: logo + toggle */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: sidebarOpen ? 'space-between' : 'center', marginBottom: '18px', minHeight: '32px' }}>
          {sidebarOpen && (
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, background: 'linear-gradient(135deg,#6366f1,#a855f7,#ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>v0 Clone</div>
              <div style={{ fontSize: '0.6rem', color: T.subtext, marginTop: '1px' }}>by {settings.userName}</div>
            </div>
          )}
          {/* Toggle button */}
          <button
            onClick={() => setSidebarOpen(o => !o)}
            title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            style={{
              width: '28px', height: '28px', borderRadius: '7px',
              background: T.cardBg, border: `1px solid ${T.cardBorder}`,
              color: T.subtext, cursor: 'pointer', fontSize: '0.75rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, transition: 'background 0.15s',
            }}>
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        {/* New Chat */}
        <button
          onClick={startNew}
          title="New Chat"
          style={{
            width: '100%', padding: sidebarOpen ? '9px' : '9px 0',
            background: T.btnPrimary, border: 'none', borderRadius: '9px',
            color: '#fff', fontWeight: 600, fontSize: '0.78rem', cursor: 'pointer',
            marginBottom: '14px', display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: '6px', whiteSpace: 'nowrap', overflow: 'hidden',
          }}>
          <span style={{ fontSize: '1rem', flexShrink: 0 }}>+</span>
          {sidebarOpen && 'New Chat'}
        </button>

        {/* Nav items */}
        <div style={{ marginBottom: '14px' }}>
          {menuItems.map(item => (
            <button
              key={item}
              onClick={() => setActiveView(item)}
              title={item}
              style={{
                width: '100%', padding: '8px', borderRadius: '8px', border: 'none',
                background: activeView === item ? T.cardBg : 'transparent',
                color: activeView === item ? T.text : T.subtext,
                fontSize: '0.78rem', cursor: 'pointer', marginBottom: '2px',
                display: 'flex', alignItems: 'center',
                justifyContent: sidebarOpen ? 'flex-start' : 'center',
                gap: '8px', fontWeight: activeView === item ? 600 : 400,
                whiteSpace: 'nowrap', overflow: 'hidden',
              }}>
              <span style={{ fontSize: '1rem', flexShrink: 0 }}>{menuIcons[item]}</span>
              {sidebarOpen && (
                <>
                  <span style={{ flex: 1, textAlign: 'left' }}>{item}</span>
                  {item === 'Projects' && projects.length > 0 && (
                    <span style={{ fontSize: '0.58rem', background: T.inputBg, color: T.subtext, padding: '1px 5px', borderRadius: '99px', border: `1px solid ${T.cardBorder}` }}>{projects.length}</span>
                  )}
                  {item === 'Chats' && chats.length > 0 && (
                    <span style={{ fontSize: '0.58rem', background: T.inputBg, color: T.subtext, padding: '1px 5px', borderRadius: '99px', border: `1px solid ${T.cardBorder}` }}>{chats.length}</span>
                  )}
                </>
              )}
            </button>
          ))}
        </div>

        {/* Recent chats — only when open */}
        {sidebarOpen && (
          <div style={{ flex: 1, overflow: 'auto', minHeight: 0 }}>
            <p style={{ fontSize: '0.57rem', fontWeight: 700, color: T.subtext, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '7px', paddingLeft: '8px' }}>Recent</p>
            {chats.length > 0 ? chats.slice(0, 8).map((chat, i) => (
              <button key={i} onClick={() => { setActiveView('Home'); loadChat(chat); }}
                style={{ width: '100%', textAlign: 'left', padding: '6px 8px', borderRadius: '6px', border: 'none', background: 'transparent', color: T.subtext, fontSize: '0.68rem', cursor: 'pointer', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>
                {chat.prompt}
              </button>
            )) : <p style={{ fontSize: '0.65rem', color: T.subtext, paddingLeft: '8px', opacity: 0.4 }}>No history</p>}
          </div>
        )}

        {/* Spacer when collapsed */}
        {!sidebarOpen && <div style={{ flex: 1 }} />}

        {/* Footer */}
        <div style={{ paddingTop: '12px', borderTop: `1px solid ${T.sidebarBorder}`, display: 'flex', alignItems: 'center', justifyContent: sidebarOpen ? 'flex-start' : 'center', gap: '7px', overflow: 'hidden' }}>
          <span style={{ width: '7px', height: '7px', background: '#22c55e', borderRadius: '50%', flexShrink: 0, boxShadow: '0 0 5px #22c55e88' }}></span>
          {sidebarOpen && <span style={{ fontSize: '0.6rem', color: T.subtext, whiteSpace: 'nowrap' }}>Powered by v0 SDK</span>}
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div style={{ flex: 1, overflow: 'auto', minWidth: 0, transition: 'all 0.22s ease' }}>
        {activeView === 'Home' && renderHome()}
        {activeView === 'Projects' && renderProjects()}
        {activeView === 'Chats' && renderChats()}
        {activeView === 'Settings' && renderSettings()}
      </div>

      {renderModal()}
    </div>
  );
}