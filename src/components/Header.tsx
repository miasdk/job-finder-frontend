'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { useState } from 'react';

export default function Header() {
  const pathname = usePathname();
  
  const isActive = (path: string) => pathname === path;
  const [menuOpen, setMenuOpen] = useState(false);
  
  return (
    <header className="backdrop-blur-md bg-white/70 shadow-lg sticky top-0 z-30 transition-shadow">
      <div className="max-w-5xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-4 text-2xl font-semibold text-gray-900 hover:text-gray-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900">
            <Image
              src="/images/my-notion-face-transparent (2).png"
              alt="myJobFinder.ai logo"
              width={56}
              height={56}
              priority
              className="rounded-full bg-white shadow-md border border-gray-100"
            />
            <span className="tracking-tight font-bold text-gray-900">myJobFinder.ai</span>
          </Link>
          {/* Hamburger button for mobile */}
          <button
            className="md:hidden p-2 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="sr-only">Toggle navigation</span>
            <svg
              className="h-7 w-7 text-gray-900"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-2 bg-white/60 backdrop-blur-md rounded-full px-4 py-2 shadow border border-gray-100">
            <Link 
              href="/" 
              className={`text-sm px-4 py-2 rounded-full transition-all duration-150 font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 ${
                isActive('/') ? 'bg-gray-900 text-white scale-105 shadow' : 'text-gray-700 hover:bg-gray-100 hover:scale-105'
              }`}
              aria-current={isActive('/') ? 'page' : undefined}
            >
              Dashboard
            </Link>
            <Link 
              href="/jobs" 
              className={`text-sm px-4 py-2 rounded-full transition-all duration-150 font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 ${
                isActive('/jobs') ? 'bg-gray-900 text-white scale-105 shadow' : 'text-gray-700 hover:bg-gray-100 hover:scale-105'
              }`}
              aria-current={isActive('/jobs') ? 'page' : undefined}
            >
              All Jobs
            </Link>
            <Link 
              href="/profile" 
              className={`text-sm px-4 py-2 rounded-full transition-all duration-150 font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 ${
                isActive('/profile') ? 'bg-gray-900 text-white scale-105 shadow' : 'text-gray-700 hover:bg-gray-100 hover:scale-105'
              }`}
              aria-current={isActive('/profile') ? 'page' : undefined}
            >
              Profile
            </Link>
          </nav>
        </div>
        {/* Mobile nav menu */}
        {menuOpen && (
          <nav className="md:hidden mt-3 animate-fade-in">
            <ul className="flex flex-col gap-2 bg-white/90 rounded-2xl border border-gray-100 shadow p-4">
              <li>
                <Link
                  href="/"
                  className={`block text-base transition-colors px-1 py-2 rounded-full ${
                    isActive('/') ? 'bg-gray-900 text-white font-semibold' : 'text-gray-700 hover:bg-gray-100'
                  } focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900`}
                  aria-current={isActive('/') ? 'page' : undefined}
                  onClick={() => setMenuOpen(false)}
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/jobs"
                  className={`block text-base transition-colors px-1 py-2 rounded-full ${
                    isActive('/jobs') ? 'bg-gray-900 text-white font-semibold' : 'text-gray-700 hover:bg-gray-100'
                  } focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900`}
                  aria-current={isActive('/jobs') ? 'page' : undefined}
                  onClick={() => setMenuOpen(false)}
                >
                  All Jobs
                </Link>
              </li>
              <li>
                <Link
                  href="/profile"
                  className={`block text-base transition-colors px-1 py-2 rounded-full ${
                    isActive('/profile') ? 'bg-gray-900 text-white font-semibold' : 'text-gray-700 hover:bg-gray-100'
                  } focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900`}
                  aria-current={isActive('/profile') ? 'page' : undefined}
                  onClick={() => setMenuOpen(false)}
                >
                  Profile
                </Link>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
}