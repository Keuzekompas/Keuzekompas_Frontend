"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserIcon, BookOpenIcon, SparklesIcon, HeartIcon } from '@heroicons/react/24/outline';

const BottomNavbar = () => {
  const pathname = usePathname();

  if (pathname === '/') {
    return null;
  }

  const navItems = [
    { href: '/profile', icon: UserIcon, label: 'Profile' },
    { href: '/modules', icon: BookOpenIcon, label: 'Modules' },
    { href: '/ai', icon: SparklesIcon, label: 'AI' },
    { href: '/favorites', icon: HeartIcon, label: 'Favorites' },
  ];

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-(--bg-card) shadow-lg" style={{boxShadow: '0 -1px 3px 0 rgba(0, 0, 0, 0.1), 0 -1px 2px 0 rgba(0, 0, 0, 0.06)'}}>
      <div className="grid h-full max-w-lg grid-cols-4 mx-auto font-medium">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href;
          return (
            <Link key={href} href={href} className="inline-flex flex-col items-center justify-center px-5 group">
              <Icon className={`w-6 h-6 mb-1 ${isActive ? 'text-(--color-brand)' : 'text-(--text-secondary)'}`} />
              <span className={`text-sm ${isActive ? 'text-(--color-brand)' : 'text-(--text-secondary)'}`}>{label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavbar;
