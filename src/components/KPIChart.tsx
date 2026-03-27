'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface KPIChartProps {
  data: Array<Record<string, unknown>>;
  dataKey: string;
  title: string;
  color: string;
  gradientId: string;
  format?: (v: number) => string;
  icon: React.ReactNode;
  currentValue?: string;
}

export default function KPIChart({
  data,
  dataKey,
  title,
  color,
  gradientId,
  format,
  icon,
  currentValue,
}: KPIChartProps) {
  return (
    <div className="bg-[#0f1225]/80 backdrop-blur-xl rounded-2xl border border-white/5 p-5 hover:border-white/10 transition-all duration-300 group">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}15` }}>
            {icon}
          </div>
          <div>
            <h3 className="text-sm font-medium text-white/60">{title}</h3>
            {currentValue && (
              <p className="text-xl font-bold text-white">{currentValue}</p>
            )}
          </div>
        </div>
        <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: color }} />
      </div>
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.3} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.2)' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.2)' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={format}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1a1e3a',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                fontSize: '12px',
                color: '#fff',
              }}
              formatter={(value: unknown) => {
                const numVal = Number(value);
                return [format ? format(numVal) : numVal, title];
              }}
            />
            <Area
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              strokeWidth={2}
              fill={`url(#${gradientId})`}
              dot={false}
              activeDot={{ r: 4, fill: color }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
