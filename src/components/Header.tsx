'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  
  const isActive = (path: string) => pathname === path;
  
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-4xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-light text-gray-900 hover:text-gray-700 transition-colors">
            Job Finder
          </Link>
          
          <nav className="flex items-center gap-6">
            <Link 
              href="/" 
              className={`text-sm transition-colors ${
                isActive('/') ? 'text-gray-900 font-medium' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Dashboard
            </Link>
            <Link 
              href="/jobs" 
              className={`text-sm transition-colors ${
                isActive('/jobs') ? 'text-gray-900 font-medium' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              All Jobs
            </Link>
            <Link 
              href="/profile" 
              className={`text-sm transition-colors ${
                isActive('/profile') ? 'text-gray-900 font-medium' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Profile
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}