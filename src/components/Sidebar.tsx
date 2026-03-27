'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Ticket,
  User,
  MessageSquare,
  Zap,
  Ghost,
} from 'lucide-react';
import useSWR from 'swr';
import { getLevelInfo, getLevelBadgeColor } from '@/lib/xp';

const fetcher = (url: string) => fetch(url).then(r => r.json());

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/tickets', label: 'Tickets', icon: Ticket },
  { href: '/profile', label: 'Profile', icon: User },
  { href: '/standups', label: 'Standups', icon: MessageSquare },
  { href: '/events', label: 'Events', icon: Zap },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { data: userData } = useSWR('/api/user', fetcher, { refreshInterval: 5000 });

  const xp = userData?.xp ?? 0;
  const levelInfo = getLevelInfo(xp);
  const badgeColor = getLevelBadgeColor(levelInfo.level);

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[#0a0e1a]/90 backdrop-blur-xl border-r border-white/5 flex flex-col z-50">
      {/* Logo */}
      <div className="p-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
            <Ghost className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">ShadowIntern</h1>
            <p className="text-[10px] text-white/40 uppercase tracking-widest">Corp Simulator</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? 'bg-gradient-to-r from-violet-500/20 to-cyan-500/10 text-white border border-violet-500/20'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon className={`w-5 h-5 transition-colors ${isActive ? 'text-violet-400' : 'text-white/30 group-hover:text-white/60'}`} />
              {item.label}
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* XP & Level */}
      <div className="p-4 border-t border-white/5">
        <div className="bg-white/5 rounded-xl p-4 backdrop-blur-sm border border-white/5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-white/40 uppercase tracking-wider">Level</span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-gradient-to-r ${badgeColor} text-white`}>
              {levelInfo.level}
            </span>
          </div>
          <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 transition-all duration-1000 ease-out"
              style={{ width: `${levelInfo.progress}%` }}
            />
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-[10px] text-white/30">{xp} XP</span>
            <span className="text-[10px] text-white/30">
              {levelInfo.nextLevel ? `${levelInfo.maxXP} XP to ${levelInfo.nextLevel}` : 'MAX LEVEL'}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
