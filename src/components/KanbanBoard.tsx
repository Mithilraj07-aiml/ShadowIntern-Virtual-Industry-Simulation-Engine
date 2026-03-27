'use client';

import { useState } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd';
import { AlertCircle, Clock, CheckCircle2, Eye, Sparkles, Loader2 } from 'lucide-react';

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  xpReward: number;
  feedback: string | null;
}

interface KanbanBoardProps {
  tickets: Ticket[];
  onMove: (ticketId: string, newStatus: string) => void;
}

const columns = [
  { id: 'TODO', label: 'To Do', icon: Clock, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
  { id: 'IN_PROGRESS', label: 'In Progress', icon: Loader2, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  { id: 'IN_REVIEW', label: 'In Review', icon: Eye, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
  { id: 'DONE', label: 'Done', icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
];

const priorityColors: Record<string, string> = {
  LOW: 'bg-blue-500/20 text-blue-400',
  MEDIUM: 'bg-amber-500/20 text-amber-400',
  HIGH: 'bg-orange-500/20 text-orange-400',
  CRITICAL: 'bg-red-500/20 text-red-400',
};

export default function KanbanBoard({ tickets, onMove }: KanbanBoardProps) {
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [feedback, setFeedback] = useState<string>('');
  const [loadingFeedback, setLoadingFeedback] = useState(false);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const newStatus = result.destination.droppableId;
    const ticketId = result.draggableId;
    if (result.source.droppableId !== newStatus) {
      onMove(ticketId, newStatus);
    }
  };

  const getAiFeedback = async (ticket: Ticket) => {
    setLoadingFeedback(true);
    try {
      const res = await fetch('/api/ai/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: ticket.title, description: ticket.description }),
      });
      const data = await res.json();
      setFeedback(data.feedback);
    } catch {
      setFeedback('Could not generate feedback at this time.');
    }
    setLoadingFeedback(false);
  };

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-4 gap-4 h-full">
          {columns.map((col) => {
            const colTickets = tickets.filter((t) => t.status === col.id);
            return (
              <div key={col.id} className="flex flex-col">
                <div className={`flex items-center gap-2 mb-4 px-3 py-2 rounded-xl ${col.bg} border ${col.border}`}>
                  <col.icon className={`w-4 h-4 ${col.color}`} />
                  <span className={`text-sm font-semibold ${col.color}`}>{col.label}</span>
                  <span className="ml-auto text-xs bg-white/10 px-2 py-0.5 rounded-full text-white/50">
                    {colTickets.length}
                  </span>
                </div>
                <Droppable droppableId={col.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 space-y-3 p-2 rounded-xl transition-colors min-h-[200px] ${
                        snapshot.isDraggingOver ? 'bg-white/5' : ''
                      }`}
                    >
                      {colTickets.map((ticket, index) => (
                        <Draggable key={ticket.id} draggableId={ticket.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              onClick={() => {
                                setSelectedTicket(ticket);
                                setFeedback(ticket.feedback || '');
                              }}
                              className={`bg-[#0f1225]/90 backdrop-blur-sm rounded-xl p-4 border border-white/5 cursor-pointer
                                hover:border-violet-500/30 transition-all duration-200 group
                                ${snapshot.isDragging ? 'shadow-2xl shadow-violet-500/20 border-violet-500/40 rotate-2' : ''}`}
                            >
                              <div className="flex items-start justify-between mb-2">
                                <h4 className="text-sm font-medium text-white/90 group-hover:text-white line-clamp-2">
                                  {ticket.title}
                                </h4>
                              </div>
                              <p className="text-xs text-white/40 mb-3 line-clamp-2">{ticket.description}</p>
                              <div className="flex items-center justify-between">
                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${priorityColors[ticket.priority]}`}>
                                  {ticket.priority}
                                </span>
                                <span className="text-[10px] text-violet-400 font-medium">+{ticket.xpReward} XP</span>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>

      {/* Ticket Detail Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedTicket(null)}>
          <div className="bg-[#0f1225] border border-white/10 rounded-2xl w-full max-w-lg p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${priorityColors[selectedTicket.priority]}`}>
                {selectedTicket.priority}
              </span>
              <span className="text-sm text-violet-400 font-bold">+{selectedTicket.xpReward} XP</span>
            </div>
            <h2 className="text-xl font-bold text-white">{selectedTicket.title}</h2>
            <p className="text-sm text-white/50 leading-relaxed">{selectedTicket.description}</p>

            <div className="flex items-center gap-2 pt-2">
              <span className="text-xs text-white/30">Status:</span>
              <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-white/70">{selectedTicket.status.replace('_', ' ')}</span>
            </div>

            {/* AI Feedback Section */}
            <div className="border-t border-white/5 pt-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-white/70 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-violet-400" />
                  AI Code Review
                </h3>
                <button
                  onClick={() => getAiFeedback(selectedTicket)}
                  disabled={loadingFeedback}
                  className="text-xs px-3 py-1.5 rounded-lg bg-violet-500/20 text-violet-400 hover:bg-violet-500/30 transition-colors disabled:opacity-50"
                >
                  {loadingFeedback ? 'Generating...' : 'Get Feedback'}
                </button>
              </div>
              {feedback && (
                <div className="bg-white/5 rounded-xl p-4 text-sm text-white/60 leading-relaxed border border-violet-500/10">
                  {feedback}
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedTicket(null)}
              className="w-full py-2.5 rounded-xl bg-white/5 text-white/50 hover:text-white hover:bg-white/10 transition-colors text-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
