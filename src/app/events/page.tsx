'use client';

import useSWR from 'swr';
import EventTimeline from '@/components/EventTimeline';
import ChaosAlert from '@/components/ChaosAlert';
import { Zap, Flame, Clock, Monitor, AlertTriangle, Coffee } from 'lucide-react';

const fetcher = (url: string) => fetch(url).then(r => r.json());

const chaosButtons = [
  { type: 'CRUNCH_TIME', label: 'Crunch Time', icon: Flame, color: 'from-red-500 to-orange-500' },
  { type: 'DEADLINE_CHANGE', label: 'Deadline Change', icon: Clock, color: 'from-amber-500 to-yellow-500' },
  { type: 'SURPRISE_DEMO', label: 'Surprise Demo', icon: Monitor, color: 'from-purple-500 to-pink-500' },
  { type: 'SERVER_FIRE', label: 'Server Fire', icon: AlertTriangle, color: 'from-red-600 to-red-400' },
  { type: 'COFFEE_MACHINE_BROKE', label: 'Coffee Crisis', icon: Coffee, color: 'from-amber-800 to-yellow-700' },
];

export default function EventsPage() {
  const { data: events, mutate } = useSWR('/api/events', fetcher, { refreshInterval: 5000 });

  const activeEvents = (events || []).filter((e: { active: boolean }) => e.active);

  const triggerChaos = async (type?: string) => {
    await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type }),
    });
    mutate();
  };

  return (
    <div className="page-enter space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <Zap className="w-8 h-8 text-amber-400" />
            Chaos Events
          </h1>
          <p className="text-sm text-white/40 mt-1">The corporate world is unpredictable. Chaos events modify XP rewards.</p>
        </div>
        <button
          onClick={() => triggerChaos()}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-red-500 text-white text-sm font-medium hover:shadow-lg hover:shadow-amber-500/25 transition-all duration-200 animate-pulse hover:animate-none"
        >
          <Zap className="w-4 h-4" />
          Trigger Random Chaos
        </button>
      </div>

      {/* Active Events */}
      {activeEvents.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xs text-white/40 uppercase tracking-wider">Active Events</h2>
          {activeEvents.map((event: { id: string; type: string; title: string; description: string; xpModifier: number; active: boolean; triggeredAt: string; expiresAt: string | null }) => (
            <ChaosAlert key={event.id} event={event} />
          ))}
        </div>
      )}

      {/* Chaos Buttons */}
      <div>
        <h2 className="text-xs text-white/40 uppercase tracking-wider mb-4">Trigger Specific Event</h2>
        <div className="grid grid-cols-5 gap-3">
          {chaosButtons.map((btn) => (
            <button
              key={btn.type}
              onClick={() => triggerChaos(btn.type)}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border border-white/5 bg-[#0f1225]/80 backdrop-blur-xl
                hover:border-white/20 transition-all duration-200 group`}
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${btn.color} flex items-center justify-center
                group-hover:shadow-lg transition-all`}>
                <btn.icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs text-white/50 group-hover:text-white/80 transition-colors">{btn.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Event Timeline */}
      <div>
        <h2 className="text-xs text-white/40 uppercase tracking-wider mb-4">Event History</h2>
        <EventTimeline events={events || []} />
      </div>
    </div>
  );
}
