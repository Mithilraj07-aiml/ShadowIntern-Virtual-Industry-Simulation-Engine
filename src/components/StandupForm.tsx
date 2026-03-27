'use client';

import { useState } from 'react';
import { Send, Plus } from 'lucide-react';

interface StandupFormProps {
  userId: string;
  onSubmit: () => void;
}

export default function StandupForm({ userId, onSubmit }: StandupFormProps) {
  const [yesterday, setYesterday] = useState('');
  const [today, setToday] = useState('');
  const [blockers, setBlockers] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!yesterday.trim() || !today.trim()) return;

    setSubmitting(true);
    try {
      await fetch('/api/standups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, yesterday, today, blockers }),
      });
      setYesterday('');
      setToday('');
      setBlockers('');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      onSubmit();
    } catch {
      // Handle error silently
    }
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[#0f1225]/80 backdrop-blur-xl rounded-2xl border border-white/5 p-6 space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Plus className="w-5 h-5 text-violet-400" />
        <h3 className="text-base font-semibold text-white">Post Standup</h3>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-medium">+5 XP</span>
      </div>

      <div>
        <label className="block text-xs text-white/40 uppercase tracking-wider mb-2">Yesterday</label>
        <textarea
          value={yesterday}
          onChange={(e) => setYesterday(e.target.value)}
          placeholder="What did you work on yesterday?"
          className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-violet-500/30 focus:ring-1 focus:ring-violet-500/20 resize-none transition-all"
          rows={2}
        />
      </div>

      <div>
        <label className="block text-xs text-white/40 uppercase tracking-wider mb-2">Today</label>
        <textarea
          value={today}
          onChange={(e) => setToday(e.target.value)}
          placeholder="What are you working on today?"
          className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-violet-500/30 focus:ring-1 focus:ring-violet-500/20 resize-none transition-all"
          rows={2}
        />
      </div>

      <div>
        <label className="block text-xs text-white/40 uppercase tracking-wider mb-2">Blockers</label>
        <textarea
          value={blockers}
          onChange={(e) => setBlockers(e.target.value)}
          placeholder="Any blockers? (optional)"
          className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-violet-500/30 focus:ring-1 focus:ring-violet-500/20 resize-none transition-all"
          rows={2}
        />
      </div>

      <button
        type="submit"
        disabled={submitting || !yesterday.trim() || !today.trim()}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 text-white font-medium text-sm hover:shadow-lg hover:shadow-violet-500/25 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
      >
        <Send className="w-4 h-4" />
        {submitting ? 'Posting...' : success ? '✓ Posted! +5 XP' : 'Post Standup'}
      </button>
    </form>
  );
}
