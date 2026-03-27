'use client';

import useSWR from 'swr';
import KPIChart from '@/components/KPIChart';
import XPBar from '@/components/XPBar';
import ChaosAlert from '@/components/ChaosAlert';
import {
  DollarSign,
  TrendingDown,
  Wifi,
  Bug,
  Ticket,
  Zap,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function DashboardPage() {
  const { data: kpis } = useSWR('/api/kpis', fetcher, { refreshInterval: 5000 });
  const { data: userData } = useSWR('/api/user', fetcher, { refreshInterval: 5000 });
  const { data: tickets } = useSWR('/api/tickets', fetcher, { refreshInterval: 5000 });
  const { data: events } = useSWR('/api/events', fetcher, { refreshInterval: 5000 });

  const kpiData = (kpis || []).map((k: Record<string, unknown>, i: number) => ({
    ...k,
    label: `D${i + 1}`,
  }));

  const latestKPI = kpiData.length > 0 ? kpiData[kpiData.length - 1] : null;
  const activeEvents = (events || []).filter((e: { active: boolean }) => e.active);
  const recentTickets = (tickets || []).slice(0, 5);
  const doneTix = (tickets || []).filter((t: { status: string }) => t.status === 'DONE').length;
  const totalTix = (tickets || []).length;

  return (
    <div className="page-enter space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard</h1>
          <p className="text-sm text-white/40 mt-1">Welcome back, Shadow Intern. Here&apos;s your mission briefing.</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-white/30">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Live Updates
        </div>
      </div>

      {/* Active Chaos Events */}
      {activeEvents.length > 0 && (
        <div className="space-y-3">
          {activeEvents.map((event: { id: string; type: string; title: string; description: string; xpModifier: number; active: boolean; triggeredAt: string; expiresAt: string | null }) => (
            <ChaosAlert key={event.id} event={event} />
          ))}
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-[#0f1225]/80 backdrop-blur-xl rounded-2xl border border-white/5 p-5 hover:border-violet-500/20 transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
              <Zap className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <p className="text-[10px] text-white/40 uppercase tracking-wider">Total XP</p>
              <p className="text-2xl font-bold text-white">{userData?.xp ?? 0}</p>
            </div>
          </div>
          <XPBar xp={userData?.xp ?? 0} />
        </div>

        <div className="bg-[#0f1225]/80 backdrop-blur-xl rounded-2xl border border-white/5 p-5 hover:border-emerald-500/20 transition-all">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <Ticket className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-[10px] text-white/40 uppercase tracking-wider">Tickets Done</p>
              <p className="text-2xl font-bold text-white">{doneTix}<span className="text-sm text-white/30 font-normal">/{totalTix}</span></p>
            </div>
          </div>
        </div>

        <div className="bg-[#0f1225]/80 backdrop-blur-xl rounded-2xl border border-white/5 p-5 hover:border-cyan-500/20 transition-all">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
              <Wifi className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <p className="text-[10px] text-white/40 uppercase tracking-wider">Uptime</p>
              <p className="text-2xl font-bold text-white">{latestKPI?.uptime?.toFixed(1) ?? '—'}%</p>
            </div>
          </div>
        </div>

        <div className="bg-[#0f1225]/80 backdrop-blur-xl rounded-2xl border border-white/5 p-5 hover:border-amber-500/20 transition-all">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <Bug className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-[10px] text-white/40 uppercase tracking-wider">Open Bugs</p>
              <p className="text-2xl font-bold text-white">{latestKPI?.bugsOpen ?? '—'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Charts */}
      <div className="grid grid-cols-2 gap-4">
        <KPIChart
          data={kpiData}
          dataKey="revenue"
          title="Revenue"
          color="#8b5cf6"
          gradientId="revenueGradient"
          format={(v: number) => `$${(v / 1000).toFixed(0)}k`}
          icon={<DollarSign className="w-4 h-4 text-violet-400" />}
          currentValue={latestKPI ? `$${(latestKPI.revenue / 1000).toFixed(0)}k` : '—'}
        />
        <KPIChart
          data={kpiData}
          dataKey="churn"
          title="Churn Rate"
          color="#f43f5e"
          gradientId="churnGradient"
          format={(v: number) => `${v.toFixed(1)}%`}
          icon={<TrendingDown className="w-4 h-4 text-rose-400" />}
          currentValue={latestKPI ? `${latestKPI.churn.toFixed(1)}%` : '—'}
        />
        <KPIChart
          data={kpiData}
          dataKey="uptime"
          title="System Uptime"
          color="#06b6d4"
          gradientId="uptimeGradient"
          format={(v: number) => `${v.toFixed(1)}%`}
          icon={<Wifi className="w-4 h-4 text-cyan-400" />}
          currentValue={latestKPI ? `${latestKPI.uptime.toFixed(1)}%` : '—'}
        />
        <KPIChart
          data={kpiData}
          dataKey="bugsOpen"
          title="Open Bugs"
          color="#f59e0b"
          gradientId="bugsGradient"
          format={(v: number) => `${v}`}
          icon={<Bug className="w-4 h-4 text-amber-400" />}
          currentValue={latestKPI ? `${latestKPI.bugsOpen}` : '—'}
        />
      </div>

      {/* Recent Tickets */}
      <div className="bg-[#0f1225]/80 backdrop-blur-xl rounded-2xl border border-white/5 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-white">Recent Tickets</h2>
          <Link href="/tickets" className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1 transition-colors">
            View All <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="space-y-2">
          {recentTickets.map((ticket: { id: string; title: string; status: string; priority: string; xpReward: number }) => (
            <div key={ticket.id} className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${
                  ticket.status === 'DONE' ? 'bg-emerald-400' :
                  ticket.status === 'IN_PROGRESS' ? 'bg-amber-400' :
                  ticket.status === 'IN_REVIEW' ? 'bg-purple-400' : 'bg-blue-400'
                }`} />
                <span className="text-sm text-white/80">{ticket.title}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                  ticket.priority === 'CRITICAL' ? 'bg-red-500/20 text-red-400' :
                  ticket.priority === 'HIGH' ? 'bg-orange-500/20 text-orange-400' :
                  ticket.priority === 'MEDIUM' ? 'bg-amber-500/20 text-amber-400' :
                  'bg-blue-500/20 text-blue-400'
                }`}>{ticket.priority}</span>
                <span className="text-[10px] text-violet-400">+{ticket.xpReward} XP</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
