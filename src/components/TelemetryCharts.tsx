import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { TelemetryPoint } from '../types';
import { Activity, ShieldCheck, Zap } from 'lucide-react';

interface TelemetryChartsProps {
  telemetryData: TelemetryPoint[];
}

export const TelemetryCharts: React.FC<TelemetryChartsProps> = ({ telemetryData }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      
      {/* Entropy Decay Chart */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-rose-400" />
            <h3 className="text-xs font-semibold text-slate-200">
              Curva de Decaimento de Entropia $E(t)$ (Auto-Cura Exponencial)
            </h3>
          </div>
          <span className="text-[10px] font-mono text-slate-500">Live Telemetry</span>
        </div>

        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={telemetryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="entropyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="timestamp" stroke="#64748b" tick={{ fontSize: 10 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 10 }} domain={[0, 100]} />
              <Tooltip
                contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                itemStyle={{ color: '#f43f5e' }}
              />
              <Area type="monotone" dataKey="entropy" stroke="#f43f5e" fillOpacity={1} fill="url(#entropyGradient)" name="Entropia (%)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Wisdom Index Growth Chart */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-purple-400" />
            <h3 className="text-xs font-semibold text-slate-200">
              Acúmulo de Sabedoria Metacognitiva (Wisdom Gain)
            </h3>
          </div>
          <span className="text-[10px] font-mono text-slate-500">Epistemic Index</span>
        </div>

        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={telemetryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="wisdomGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="timestamp" stroke="#64748b" tick={{ fontSize: 10 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                itemStyle={{ color: '#a855f7' }}
              />
              <Area type="monotone" dataKey="wisdomIndex" stroke="#a855f7" fillOpacity={1} fill="url(#wisdomGradient)" name="Sabedoria (pts)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};
