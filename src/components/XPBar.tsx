'use client';

import { getLevelInfo, getLevelBadgeColor } from '@/lib/xp';

interface XPBarProps {
  xp: number;
  size?: 'sm' | 'lg';
}

export default function XPBar({ xp, size = 'sm' }: XPBarProps) {
  const info = getLevelInfo(xp);
  const badgeColor = getLevelBadgeColor(info.level);

  if (size === 'lg') {
    return (
      <div className="bg-[#0f1225]/80 backdrop-blur-xl rounded-2xl border border-white/5 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Current Level</p>
            <h3 className="text-2xl font-bold text-white">{info.level}</h3>
          </div>
          <div className={`px-4 py-2 rounded-xl bg-gradient-to-r ${badgeColor} text-white font-bold text-lg`}>
            {xp} XP
          </div>
        </div>

        <div className="relative h-4 bg-white/5 rounded-full overflow-hidden mb-2">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-violet-500 via-purple-500 to-cyan-500 transition-all duration-1000 ease-out"
            style={{ width: `${info.progress}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 animate-shimmer" />
          </div>
        </div>

        <div className="flex justify-between text-xs text-white/30">
          <span>{info.minXP} XP</span>
          <span>{info.nextLevel ? `Next: ${info.nextLevel} at ${info.maxXP + 1} XP` : '🏆 Max Level Reached!'}</span>
        </div>

        {/* Level milestones */}
        <div className="flex gap-4 mt-6">
          {(['Junior', 'Mid-Level', 'Senior'] as const).map((level) => {
            const isReached = (level === 'Junior' && xp >= 0) ||
                            (level === 'Mid-Level' && xp >= 51) ||
                            (level === 'Senior' && xp >= 121);
            return (
              <div key={level} className={`flex-1 text-center p-3 rounded-xl border transition-all ${
                isReached ? 'bg-white/5 border-violet-500/30' : 'border-white/5 opacity-40'
              }`}>
                <div className="text-lg mb-1">
                  {level === 'Junior' ? '🌱' : level === 'Mid-Level' ? '⚡' : '👑'}
                </div>
                <p className="text-xs font-medium text-white/70">{level}</p>
                <p className="text-[10px] text-white/30">
                  {level === 'Junior' ? '0-50' : level === 'Mid-Level' ? '51-120' : '121+'}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-gradient-to-r ${badgeColor} text-white`}>
        {info.level}
      </span>
      <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 transition-all duration-700"
          style={{ width: `${info.progress}%` }}
        />
      </div>
      <span className="text-xs text-white/40">{xp} XP</span>
    </div>
  );
}
