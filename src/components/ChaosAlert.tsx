'use client';

import { Zap, X } from 'lucide-react';
import { useState, useEffect } from 'react';

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

interface ChaosAlertProps {
  event: ChaosEvent;
}

export default function ChaosAlert({ event }: ChaosAlertProps) {
  const [visible, setVisible] = useState(true);
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    if (!event.expiresAt) return;
    const interval = setInterval(() => {
      const diff = new Date(event.expiresAt!).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft('Expired');
        clearInterval(interval);
        return;
      }
      const mins = Math.floor(diff / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${mins}m ${secs}s`);
    }, 1000);
    return () => clearInterval(interval);
  }, [event.expiresAt]);

  if (!visible) return null;

  const typeStyles: Record<string, string> = {
    CRUNCH_TIME: 'from-red-500/20 to-orange-500/20 border-red-500/30',
    DEADLINE_CHANGE: 'from-amber-500/20 to-yellow-500/20 border-amber-500/30',
    SURPRISE_DEMO: 'from-purple-500/20 to-pink-500/20 border-purple-500/30',
    SERVER_FIRE: 'from-red-600/20 to-red-500/20 border-red-600/30',
    COFFEE_MACHINE_BROKE: 'from-amber-800/20 to-yellow-800/20 border-amber-800/30',
  };

  return (
    <div className={`bg-gradient-to-r ${typeStyles[event.type] || typeStyles.CRUNCH_TIME} 
      backdrop-blur-xl rounded-2xl border p-4 animate-slide-in relative overflow-hidden`}>
      {/* Animated background pulse */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />

      <div className="relative flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
          <Zap className="w-5 h-5 text-amber-400 animate-pulse" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-sm font-bold text-white">{event.title}</h4>
            {event.xpModifier !== 1 && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-amber-400 font-bold">
                {event.xpModifier}x XP
              </span>
            )}
          </div>
          <p className="text-xs text-white/50">{event.description}</p>
          {timeLeft && (
            <p className="text-[10px] text-white/30 mt-1">⏱ Expires in {timeLeft}</p>
          )}
        </div>
        <button
          onClick={() => setVisible(false)}
          className="text-white/30 hover:text-white/70 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
