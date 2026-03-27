'use client';

import { MessageSquare, AlertTriangle } from 'lucide-react';

interface Standup {
  id: string;
  yesterday: string;
  today: string;
  blockers: string;
  createdAt: string;
  user: {
    name: string;
    avatarUrl: string;
  };
}

interface StandupFeedProps {
  standups: Standup[];
}

export default function StandupFeed({ standups }: StandupFeedProps) {
  if (!standups.length) {
    return (
      <div className="bg-[#0f1225]/80 backdrop-blur-xl rounded-2xl border border-white/5 p-8 text-center">
        <MessageSquare className="w-12 h-12 text-white/10 mx-auto mb-3" />
        <p className="text-sm text-white/30">No standups yet. Post your first one!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {standups.map((standup) => {
        const date = new Date(standup.createdAt);
        const timeAgo = getTimeAgo(date);

        return (
          <div
            key={standup.id}
            className="bg-[#0f1225]/80 backdrop-blur-xl rounded-2xl border border-white/5 p-5 hover:border-white/10 transition-all duration-200"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-xs text-white font-bold">
                {standup.user.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-medium text-white">{standup.user.name}</p>
                <p className="text-[10px] text-white/30">{timeAgo}</p>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div>
                <span className="text-[10px] text-white/40 uppercase tracking-wider">Yesterday</span>
                <p className="text-white/70 mt-1">{standup.yesterday}</p>
              </div>
              <div>
                <span className="text-[10px] text-white/40 uppercase tracking-wider">Today</span>
                <p className="text-white/70 mt-1">{standup.today}</p>
              </div>
              {standup.blockers && (
                <div>
                  <span className="text-[10px] text-red-400/80 uppercase tracking-wider flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Blockers
                  </span>
                  <p className="text-white/70 mt-1">{standup.blockers}</p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}
