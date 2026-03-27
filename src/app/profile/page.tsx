'use client';

import useSWR from 'swr';
import XPBar from '@/components/XPBar';
import { getLevelInfo } from '@/lib/xp';
import { User, Ticket, MessageSquare, Calendar, Sparkles, Loader2 } from 'lucide-react';
import { useState } from 'react';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function ProfilePage() {
  const { data: userData } = useSWR('/api/user', fetcher, { refreshInterval: 5000 });
  const [audit, setAudit] = useState<string>('');
  const [loadingAudit, setLoadingAudit] = useState(false);

  const xp = userData?.xp ?? 0;
  const levelInfo = getLevelInfo(xp);

  const generateAudit = async () => {
    setLoadingAudit(true);
    try {
      const res = await fetch('/api/ai/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          xp,
          level: levelInfo.level,
          ticketsDone: userData?.ticketsDone ?? 0,
          standups: userData?.standupsCount ?? 0,
          daysActive: Math.ceil((Date.now() - new Date(userData?.createdAt ?? Date.now()).getTime()) / 86400000),
        }),
      });
      const data = await res.json();
      setAudit(data.audit);
    } catch {
      setAudit('Could not generate audit at this time.');
    }
    setLoadingAudit(false);
  };

  return (
    <div className="page-enter space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
          <User className="w-8 h-8 text-violet-400" />
          Profile
        </h1>
        <p className="text-sm text-white/40 mt-1">Your intern dossier. Everything ShadowCorp knows about you.</p>
      </div>

      {/* Profile Card */}
      <div className="bg-[#0f1225]/80 backdrop-blur-xl rounded-2xl border border-white/5 p-8">
        <div className="flex items-center gap-6 mb-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-violet-500/20">
            {(userData?.name ?? 'S').charAt(0)}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">{userData?.name ?? 'Loading...'}</h2>
            <p className="text-sm text-white/40">{userData?.role ?? 'Shadow Intern'}</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-emerald-400">Online</span>
            </div>
          </div>
        </div>

        <XPBar xp={xp} size="lg" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-[#0f1225]/80 backdrop-blur-xl rounded-2xl border border-white/5 p-5 text-center hover:border-violet-500/20 transition-all">
          <Sparkles className="w-6 h-6 text-violet-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{xp}</p>
          <p className="text-[10px] text-white/40 uppercase tracking-wider mt-1">Total XP</p>
        </div>
        <div className="bg-[#0f1225]/80 backdrop-blur-xl rounded-2xl border border-white/5 p-5 text-center hover:border-emerald-500/20 transition-all">
          <Ticket className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{userData?.ticketsDone ?? 0}</p>
          <p className="text-[10px] text-white/40 uppercase tracking-wider mt-1">Tickets Done</p>
        </div>
        <div className="bg-[#0f1225]/80 backdrop-blur-xl rounded-2xl border border-white/5 p-5 text-center hover:border-cyan-500/20 transition-all">
          <MessageSquare className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{userData?.standupsCount ?? 0}</p>
          <p className="text-[10px] text-white/40 uppercase tracking-wider mt-1">Standups</p>
        </div>
        <div className="bg-[#0f1225]/80 backdrop-blur-xl rounded-2xl border border-white/5 p-5 text-center hover:border-amber-500/20 transition-all">
          <Calendar className="w-6 h-6 text-amber-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">
            {userData?.createdAt ? Math.ceil((Date.now() - new Date(userData.createdAt).getTime()) / 86400000) : 0}
          </p>
          <p className="text-[10px] text-white/40 uppercase tracking-wider mt-1">Days Active</p>
        </div>
      </div>

      {/* Shadow Audit */}
      <div className="bg-[#0f1225]/80 backdrop-blur-xl rounded-2xl border border-white/5 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-violet-400" />
            <h3 className="text-base font-semibold text-white">ShadowAudit™</h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-400">AI-Powered</span>
          </div>
          <button
            onClick={generateAudit}
            disabled={loadingAudit}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-500/20 to-cyan-500/20 border border-violet-500/20 text-sm text-white hover:border-violet-500/40 transition-all disabled:opacity-50"
          >
            {loadingAudit ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {loadingAudit ? 'Generating...' : 'Generate Audit'}
          </button>
        </div>

        {audit ? (
          <div className="bg-gradient-to-r from-violet-500/5 to-cyan-500/5 rounded-xl p-5 border border-violet-500/10">
            <p className="text-sm text-white/70 leading-relaxed italic">&ldquo;{audit}&rdquo;</p>
          </div>
        ) : (
          <div className="bg-white/5 rounded-xl p-6 text-center">
            <p className="text-sm text-white/30">Click &ldquo;Generate Audit&rdquo; to get your AI-powered performance narrative.</p>
          </div>
        )}
      </div>
    </div>
  );
}
