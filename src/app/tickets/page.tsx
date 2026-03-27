'use client';

import useSWR from 'swr';
import KanbanBoard from '@/components/KanbanBoard';
import { Ticket, Plus, X } from 'lucide-react';
import { useState } from 'react';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function TicketsPage() {
  const { data: tickets, mutate } = useSWR('/api/tickets', fetcher, { refreshInterval: 3000 });
  const { data: userData } = useSWR('/api/user', fetcher);
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPriority, setNewPriority] = useState('MEDIUM');

  const handleMove = async (ticketId: string, newStatus: string) => {
    await fetch('/api/tickets', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: ticketId, status: newStatus }),
    });
    mutate();
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    await fetch('/api/tickets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: newTitle,
        description: newDesc,
        priority: newPriority,
        assigneeId: userData?.id,
        xpReward: newPriority === 'CRITICAL' ? 25 : newPriority === 'HIGH' ? 20 : newPriority === 'MEDIUM' ? 15 : 10,
      }),
    });
    setNewTitle('');
    setNewDesc('');
    setNewPriority('MEDIUM');
    setShowNewTicket(false);
    mutate();
  };

  return (
    <div className="page-enter space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <Ticket className="w-8 h-8 text-violet-400" />
            Tickets
          </h1>
          <p className="text-sm text-white/40 mt-1">Drag tickets between columns to update status. Completing earns XP.</p>
        </div>
        <button
          onClick={() => setShowNewTicket(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 text-white text-sm font-medium hover:shadow-lg hover:shadow-violet-500/25 transition-all duration-200"
        >
          <Plus className="w-4 h-4" />
          New Ticket
        </button>
      </div>

      {/* Kanban Board */}
      {tickets && <KanbanBoard tickets={tickets} onMove={handleMove} />}

      {/* New Ticket Modal */}
      {showNewTicket && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowNewTicket(false)}>
          <div className="bg-[#0f1225] border border-white/10 rounded-2xl w-full max-w-md p-6 space-y-4 animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Create Ticket</h2>
              <button onClick={() => setShowNewTicket(false)} className="text-white/30 hover:text-white/70">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div>
                <label className="block text-xs text-white/40 uppercase tracking-wider mb-2">Title</label>
                <input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="What needs to be done?"
                  className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-violet-500/30 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs text-white/40 uppercase tracking-wider mb-2">Description</label>
                <textarea
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Describe the task..."
                  className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-violet-500/30 resize-none transition-all"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-xs text-white/40 uppercase tracking-wider mb-2">Priority</label>
                <div className="grid grid-cols-4 gap-2">
                  {['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setNewPriority(p)}
                      className={`text-xs py-2 rounded-lg border transition-all ${
                        newPriority === p
                          ? p === 'CRITICAL' ? 'bg-red-500/20 border-red-500/40 text-red-400' :
                            p === 'HIGH' ? 'bg-orange-500/20 border-orange-500/40 text-orange-400' :
                            p === 'MEDIUM' ? 'bg-amber-500/20 border-amber-500/40 text-amber-400' :
                            'bg-blue-500/20 border-blue-500/40 text-blue-400'
                          : 'border-white/5 text-white/30 hover:border-white/20'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={!newTitle.trim()}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 text-white font-medium text-sm disabled:opacity-40 transition-all"
              >
                Create Ticket
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
