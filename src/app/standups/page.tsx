'use client';

import useSWR from 'swr';
import StandupForm from '@/components/StandupForm';
import StandupFeed from '@/components/StandupFeed';
import { MessageSquare } from 'lucide-react';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function StandupsPage() {
  const { data: standups, mutate } = useSWR('/api/standups', fetcher, { refreshInterval: 5000 });
  const { data: userData } = useSWR('/api/user', fetcher);

  return (
    <div className="page-enter space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
          <MessageSquare className="w-8 h-8 text-violet-400" />
          Standups
        </h1>
        <p className="text-sm text-white/40 mt-1">Daily check-ins. Each standup earns you 5 XP. Stay consistent.</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Form */}
        <div>
          {userData?.id && (
            <StandupForm userId={userData.id} onSubmit={() => mutate()} />
          )}
        </div>

        {/* Feed */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-base font-semibold text-white">Recent Standups</h2>
            <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full text-white/40">
              {standups?.length ?? 0}
            </span>
          </div>
          <StandupFeed standups={standups || []} />
        </div>
      </div>
    </div>
  );
}
