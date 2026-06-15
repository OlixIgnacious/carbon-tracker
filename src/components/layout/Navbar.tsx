'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const NAV_ITEMS = [
  { href: '/', label: 'Dashboard', icon: '📊' },
  { href: '/log', label: 'Log Activity', icon: '➕' },
  { href: '/insights', label: 'Insights', icon: '💡' },
  { href: '/achievements', label: 'Achievements', icon: '🏆' },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="glass sticky top-0 z-50" role="navigation" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors"
            aria-label="Carbon Tracker home"
          >
            <span className="text-2xl" aria-hidden="true">🌍</span>
            <span className="font-bold text-lg tracking-tight">
              Carbon<span className="text-carbon-300">Tracker</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${isActive
                      ? 'bg-emerald-500/15 text-emerald-400 shadow-sm'
                      : 'text-carbon-400 hover:text-carbon-200 hover:bg-white/5'
                    }
                  `}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span aria-hidden="true">{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg text-carbon-400 hover:text-carbon-200 hover:bg-white/5 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label="Toggle navigation menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div id="mobile-menu" className="md:hidden pb-4 animate-fade-in" role="menu">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all
                    ${isActive
                      ? 'bg-emerald-500/15 text-emerald-400'
                      : 'text-carbon-400 hover:text-carbon-200 hover:bg-white/5'
                    }
                  `}
                  onClick={() => setMobileMenuOpen(false)}
                  role="menuitem"
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span aria-hidden="true">{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
}
