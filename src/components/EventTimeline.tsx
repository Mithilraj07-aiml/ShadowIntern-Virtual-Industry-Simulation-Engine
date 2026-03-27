'use client';

import { Zap, Clock, AlertTriangle, Flame, Coffee, Monitor } from 'lucide-react';

interface ChaosEvent {
  id: string;
  type: string;
  title: string;
  description: string;
  xpModifier: number;
  active: boolean;
  triggeredAt: string;
  expiresAt: string | null;
}

interface EventTimelineProps {
  events: ChaosEvent[];
}

const typeIcons: Record<string, React.ReactNode> = {
  CRUNCH_TIME: <Flame className="w-4 h-4 text-red-400" />,
  DEADLINE_CHANGE: <Clock className="w-4 h-4 text-amber-400" />,
  SURPRISE_DEMO: <Monitor className="w-4 h-4 text-purple-400" />,
  SERVER_FIRE: <AlertTriangle className="w-4 h-4 text-red-500" />,
  COFFEE_MACHINE_BROKE: <Coffee className="w-4 h-4 text-amber-600" />,
};

export default function EventTimeline({ events }: EventTimelineProps) {
  if (!events.length) {
    return (
      <div className="bg-[#0f1225]/80 backdrop-blur-xl rounded-2xl border border-white/5 p-8 text-center">
        <Zap className="w-12 h-12 text-white/10 mx-auto mb-3" />
        <p className="text-sm text-white/30">No chaos events yet. The calm before the storm...</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-violet-500/50 via-white/10 to-transparent" />

      <div className="space-y-4">
        {events.map((event) => {
          const date = new Date(event.triggeredAt);
          return (
            <div key={event.id} className="relative pl-14">
              {/* Timeline dot */}
              <div className={`absolute left-[18px] w-3 h-3 rounded-full border-2 ${
                event.active
                  ? 'bg-amber-400 border-amber-400 animate-pulse shadow-lg shadow-amber-500/50'
                  : 'bg-white/10 border-white/20'
              }`} />

              <div className={`bg-[#0f1225]/80 backdrop-blur-xl rounded-2xl border p-5 transition-all duration-200 ${
                event.active ? 'border-amber-500/30 shadow-lg shadow-amber-500/5' : 'border-white/5 hover:border-white/10'
              }`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                      {typeIcons[event.type] || <Zap className="w-4 h-4 text-amber-400" />}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">{event.title}</h4>
                      <p className="text-[10px] text-white/30">
                        {date.toLocaleDateString()} at {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {event.xpModifier !== 1 && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-bold">
                        {event.xpModifier}x XP
                      </span>
                    )}
                    {event.active && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-medium animate-pulse">
                        ACTIVE
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-xs text-white/50 leading-relaxed">{event.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
