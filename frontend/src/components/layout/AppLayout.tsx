import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useClerk } from '@clerk/clerk-react';
import { useCurrentUser } from '../../context/useCurrentUser';

const primaryNavItems = [
  { path: '/dashboard', label: 'DASHBOARD' },
  { path: '/domains', label: 'DOMAINS' },
  { path: '/assessment', label: 'ASSESSMENT' },
  { path: '/submission', label: 'SUBMISSION' },
  { path: '/skill-gap', label: 'SKILL GAP' },
  { path: '/intro', label: 'SCROLL STORY' },
];

const allRoutes = [
  { path: '/login', label: '01. Login / Gateway', code: 'GATEWAY' },
  { path: '/intro', label: '02. Editorial Scroll Story', code: 'STORY' },
  { path: '/dashboard', label: '03. Evidence Dashboard', code: 'LEDGER' },
  { path: '/domains', label: '04. Domain Selection (5 Domains)', code: 'DOMAINS' },
  { path: '/assessment', label: '05. Initial Assessment (DEV-0884)', code: 'BENCHMARK' },
  { path: '/submission', label: '06. Evidence Dossier Submission', code: 'DOSSIER' },
  { path: '/skill-gap', label: '07. Competency Skill-Gap Report', code: 'RUBRIC' },
  { path: '/practice', label: '08. Targeted Remediation Practice', code: 'DRILLS' },
  { path: '/changed-condition', label: '09. The Changed Condition', code: 'MUTATION' },
  { path: '/re-proof', label: '10. Adaptive Re-Proof Sandbox', code: 'VERIFY' },
  { path: '/result', label: '11. Verified Proof Credential', code: 'CERT' },
];

export const AppLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useClerk();
  const [routePickerOpen, setRoutePickerOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { currentUser, initials, isSignedIn } = useCurrentUser();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
    try {
      await signOut();
    } catch (err) {
      console.error('[AppLayout] Error during Clerk signOut:', err);
    }
    navigate('/login', { replace: true });
  };

  const isAuthPage = location.pathname === '/login';

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-graphite-900 font-sans antialiased selection:bg-cobalt-700 selection:text-white">
      {/* Top Prototype Switcher Bar */}
      <div className="bg-[#111215] text-[#FAF9F6] px-4 sm:px-8 py-1.5 text-[11px] font-mono flex items-center justify-between border-b border-graphite-800 z-50">
        <div className="flex items-center gap-2.5">
          <span className="inline-block w-1.5 h-1.5 bg-cobalt-500" />
          <span className="font-semibold tracking-wider text-ivory-300 uppercase">
            ReProof // Stitch Design Engine
          </span>
          <span className="text-graphite-500 hidden sm:inline">|</span>
          <span className="text-graphite-400 hidden sm:inline text-[10px]">
            Warm Ivory Archival Palette • 1px Hairlines • Cobalt Indicators
          </span>
        </div>

        <div className="relative">
          <button
            onClick={() => setRoutePickerOpen(!routePickerOpen)}
            className="flex items-center gap-2 px-2.5 py-0.5 border border-graphite-700 bg-graphite-800/80 hover:bg-graphite-700 text-ivory-200 uppercase tracking-widest text-[10px] cursor-pointer transition-colors"
          >
            <span>Preview Screen ({location.pathname})</span>
            <span className="text-cobalt-400 font-bold">11 Routes ▾</span>
          </button>

          {routePickerOpen && (
            <div
              className="absolute right-0 mt-1 w-80 bg-white border border-ivory-300 text-graphite-900 shadow-xl py-2 z-50 rounded-[2px]"
              onClick={() => setRoutePickerOpen(false)}
            >
              <div className="px-3 py-1.5 text-[10px] font-mono font-bold text-graphite-500 uppercase tracking-widest border-b border-ivory-200">
                Architectural Prototype Navigation
              </div>
              <div className="max-h-96 overflow-y-auto divide-y divide-ivory-200">
                {allRoutes.map((r) => {
                  const active = location.pathname === r.path;
                  return (
                    <Link
                      key={r.path}
                      to={r.path}
                      className={`flex items-center justify-between px-3.5 py-2 text-xs transition-colors ${
                        active
                          ? 'bg-cobalt-100/60 text-cobalt-900 font-semibold border-l-2 border-cobalt-700'
                          : 'text-graphite-700 hover:bg-ivory-100 hover:text-graphite-900'
                      }`}
                    >
                      <span className="font-sans text-[11px]">{r.label}</span>
                      <span className="font-mono text-[9px] text-graphite-400 uppercase tracking-widest">
                        {r.code}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stitch Editorial Masthead / Header */}
      <header className="w-full border-b border-ivory-300 bg-[#FAF9F6] sticky top-0 z-40">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 h-16 flex items-center justify-between">
          {/* Brand & Platform Subtext */}
          <div className="flex items-center gap-6">
            <Link to="/dashboard" className="group flex items-baseline gap-1">
              <span className="text-xl font-extrabold tracking-[-0.04em] text-graphite-900 uppercase">
                ReProof<span className="text-cobalt-700">.</span>
              </span>
            </Link>
            <span className="hidden md:inline-block h-3.5 w-[1px] bg-ivory-300"></span>
            <span className="hidden lg:inline-block font-mono text-[10px] tracking-widest text-graphite-500 uppercase">
              Evidence-Based Competency Assessment
            </span>
          </div>

          {/* Nav Tabs */}
          {!isAuthPage && (
            <nav className="hidden md:flex items-center space-x-6 lg:space-x-8 h-16">
              {primaryNavItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`h-full inline-flex items-center font-mono text-[11px] tracking-widest transition-colors ${
                      isActive
                        ? 'text-cobalt-700 font-bold border-b-2 border-cobalt-700'
                        : 'text-graphite-500 hover:text-graphite-900'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          )}

          {/* Candidate Status Badge & User Profile Menu */}
          <div className="flex items-center gap-4">
            {isAuthPage ? (
              <div className="flex items-center gap-2 font-mono text-[11px] tracking-widest text-graphite-500 uppercase">
                <span className="inline-block w-1.5 h-1.5 bg-cobalt-700"></span>
                <span className="text-graphite-800 font-semibold">GATEWAY</span>
                <span className="text-graphite-400">/ 01 ENTRY</span>
              </div>
            ) : (
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => {
                    if (isSignedIn) {
                      setUserMenuOpen(!userMenuOpen);
                    } else {
                      navigate('/login');
                    }
                  }}
                  className="flex items-center gap-3 cursor-pointer group text-left focus:outline-none"
                  title={isSignedIn ? `Candidate Menu: ${currentUser.name}` : 'Click to Sign In'}
                >
                  <div className="hidden sm:flex flex-col items-end leading-tight">
                    <span className="font-mono text-xs text-graphite-900 font-medium group-hover:text-cobalt-700 transition-colors">
                      {currentUser.name}
                    </span>
                    <span className="font-mono text-[9px] uppercase tracking-wider text-graphite-500">
                      {currentUser.accreditationStatus}
                    </span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-cobalt-700 text-[#FAF9F6] flex items-center justify-center font-mono text-xs font-semibold group-hover:bg-cobalt-900 transition-colors relative">
                    {initials}
                    {isSignedIn && (
                      <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#FAF9F6] rounded-full" />
                    )}
                  </div>
                </button>

                {/* Signed-in Candidate User / Profile Dropdown Menu */}
                {userMenuOpen && isSignedIn && (
                  <div
                    className="absolute right-0 mt-2 w-72 bg-white border border-ivory-300 text-graphite-900 shadow-xl py-0 z-50 rounded-[2px]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Candidate Identity Header */}
                    <div className="p-4 border-b border-ivory-200 bg-[#FAF9F6]">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-cobalt-700">
                          Authenticated Candidate
                        </span>
                        <span className="flex items-center gap-1.5 font-mono text-[9px] text-emerald-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                          <span>ACTIVE</span>
                        </span>
                      </div>
                      <div className="text-sm font-bold text-graphite-900 uppercase tracking-tight">
                        {currentUser.name}
                      </div>
                      <div className="font-mono text-[11px] text-graphite-500 truncate mt-0.5">
                        {currentUser.email}
                      </div>
                      <div className="mt-2.5 pt-2 border-t border-ivory-200 flex items-center justify-between font-mono text-[10px] text-graphite-500">
                        <span>{currentUser.handle}</span>
                        <span className="text-cobalt-700 font-semibold">{currentUser.reProofScore}% PROOF SCORE</span>
                      </div>
                    </div>

                    {/* Navigation / Profile Links */}
                    <div className="py-1">
                      <Link
                        to="/dashboard"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center justify-between px-4 py-2 text-xs font-mono text-graphite-700 hover:bg-ivory-100 hover:text-graphite-900 transition-colors uppercase tracking-wider"
                      >
                        <span>Evidence Dashboard</span>
                        <span className="text-graphite-400">&rarr;</span>
                      </Link>
                      <Link
                        to="/result"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center justify-between px-4 py-2 text-xs font-mono text-graphite-700 hover:bg-ivory-100 hover:text-graphite-900 transition-colors uppercase tracking-wider"
                      >
                        <span>Verified Credential</span>
                        <span className="text-graphite-400">&rarr;</span>
                      </Link>
                    </div>

                    {/* Official Clerk Sign Out Action */}
                    <div className="border-t border-ivory-200 p-2 bg-[#FAF9F6]">
                      <button
                        type="button"
                        onClick={handleSignOut}
                        className="w-full text-left px-3 py-2 text-xs font-mono font-bold uppercase tracking-wider text-red-600 hover:bg-red-50 hover:text-red-700 rounded-[2px] transition-colors flex items-center justify-between cursor-pointer"
                      >
                        <span>Sign Out</span>
                        <span className="font-mono text-[10px] text-red-400">EXIT &rarr;</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1 text-graphite-700 hover:text-graphite-900"
            >
              <span className="font-mono text-xs">MENU ▾</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-ivory-300 bg-[#FAF9F6] px-6 py-4 space-y-2">
            <div className="font-mono text-[10px] uppercase tracking-widest text-graphite-500 mb-2">
              Sections:
            </div>
            {primaryNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block py-1.5 font-mono text-xs ${
                  location.pathname === item.path
                    ? 'text-cobalt-700 font-bold'
                    : 'text-graphite-700'
                }`}
              >
                {item.label}
              </Link>
            ))}

            {isSignedIn && (
              <div className="pt-3 mt-3 border-t border-ivory-300 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-mono text-xs font-bold text-graphite-900 uppercase">
                    {currentUser.name}
                  </div>
                  <span className="font-mono text-[9px] text-cobalt-700 uppercase">
                    {currentUser.accreditationStatus}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="w-full text-left py-2 font-mono text-xs font-bold text-red-600 hover:text-red-700 uppercase tracking-wider flex items-center justify-between cursor-pointer"
                >
                  <span>Sign Out</span>
                  <span>&rarr;</span>
                </button>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Main Viewport Content */}
      <main className="flex-1 w-full">
        <Outlet />
      </main>

      {/* Stitch Editorial Colophon / Footer */}
      <footer className="w-full border-t border-ivory-300 bg-[#FAF9F6] mt-auto">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px] text-graphite-500 uppercase tracking-wider">
          <div className="flex items-center gap-4">
            <span className="font-semibold text-graphite-800">REPROOF PLATFORM © 2025</span>
            <span className="text-ivory-300 hidden sm:inline">/</span>
            <span className="text-graphite-500 hidden sm:inline">
              EVIDENCE-BASED COMPETENCY MATRIX
            </span>
          </div>
          <div className="flex items-center gap-5 text-[10px]">
            <Link to="/intro" className="hover:text-graphite-900 transition-colors">
              Framework Specs
            </Link>
            <span className="text-ivory-300">•</span>
            <Link to="/domains" className="hover:text-graphite-900 transition-colors">
              Rubric Directory
            </Link>
            <span className="text-ivory-300">•</span>
            <span className="text-graphite-400">Strict Audit Logging</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
