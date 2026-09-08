import React from 'react';
import {
  BarChart3,
  TrendingUp,
  PieChart,
  Clock,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Shield,
  Layers,
} from 'lucide-react';
import { DemoBadge } from '../../../components/common/DemoBadge';

export const AnalyticsView: React.FC = () => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title Bar */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-700" />
              Compliance Intelligence Analytics
            </h2>
            <DemoBadge />
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Regional trend analysis across packaged commodity inspections, common declaration defects, and enforcement throughput.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-slate-500">Period:</span>
          <select className="py-1.5 px-3 rounded-lg border border-slate-300 bg-slate-50 font-bold text-slate-800">
            <option>Last 30 Days (Aug - Sep 2026)</option>
            <option>Q2 Financial Year 2026</option>
            <option>All-Time Benchmark</option>
          </select>
        </div>
      </div>

      {/* 4 Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4.5 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Total Inspected Volume
          </div>
          <div className="text-3xl font-black text-slate-900 mt-1 font-mono">2,497</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">
            +18.4% from previous month
          </div>
        </div>

        <div className="bg-white p-4.5 rounded-xl border border-emerald-200 shadow-xs">
          <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
            Overall Compliance Rate
          </div>
          <div className="text-3xl font-black text-emerald-700 mt-1 font-mono">71.2%</div>
          <div className="text-[11px] text-emerald-700 mt-1">1,778 compliant packages</div>
        </div>

        <div className="bg-white p-4.5 rounded-xl border border-amber-200 shadow-xs">
          <div className="text-xs font-bold text-amber-800 uppercase tracking-wider">
            Human Review Rate
          </div>
          <div className="text-3xl font-black text-amber-700 mt-1 font-mono">8.9%</div>
          <div className="text-[11px] text-amber-700 mt-1">222 referred to physical gauge</div>
        </div>

        <div className="bg-white p-4.5 rounded-xl border border-blue-200 shadow-xs">
          <div className="text-xs font-bold text-blue-800 uppercase tracking-wider">
            Average Inspection Time
          </div>
          <div className="text-3xl font-black text-blue-700 mt-1 font-mono">24.6s</div>
          <div className="text-[11px] text-blue-700 mt-1">Capture to compliance output</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Violation Categories Breakdown (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                Top Potential Violation Categories
              </h3>
              <p className="text-xs text-slate-500">Frequency of rule mismatches across dockets</p>
            </div>
            <DemoBadge label="Synthetic Data" />
          </div>

          <div className="space-y-3 pt-2 text-xs">
            {[
              { label: 'MRP Sticker Overprint / Dual Pricing (Rule 6(1)(e))', count: 184, percent: 37, color: 'bg-rose-500' },
              { label: 'PDP Numeral Height Deficit (Schedule II Table I)', count: 122, percent: 24, color: 'bg-amber-500' },
              { label: 'Missing Unit Sale Price (USP) (Rule 6(1)(da))', count: 96, percent: 19, color: 'bg-blue-600' },
              { label: 'Incomplete Consumer Care Contact Attributes (Rule 6(1)(f))', count: 58, percent: 12, color: 'bg-indigo-600' },
              { label: 'Missing Month & Year of Packaging (Rule 6(1)(d))', count: 39, percent: 8, color: 'bg-slate-600' },
            ].map((cat, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between font-semibold">
                  <span className="text-slate-800 truncate max-w-md">{cat.label}</span>
                  <span className="font-mono text-slate-600">{cat.count} cases ({cat.percent}%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`${cat.color} h-full rounded-full`}
                    style={{ width: `${cat.percent}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Commodity Class Distribution (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-slate-900">Commodity Distribution</h3>
              <span className="font-mono text-xs text-slate-500">By Sector</span>
            </div>

            <div className="space-y-3 mt-4 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-semibold text-slate-800">Packaged Foods & Confectionery</span>
                <span className="font-mono font-bold text-slate-900">46% (1,148)</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-semibold text-slate-800">Edible Oils & Fats</span>
                <span className="font-mono font-bold text-slate-900">22% (549)</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-semibold text-slate-800">Personal Care & Cosmetics</span>
                <span className="font-mono font-bold text-slate-900">18% (450)</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-semibold text-slate-800">Infant & Dietary Nutrition</span>
                <span className="font-mono font-bold text-slate-900">14% (350)</span>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-500">
            Analytics metrics automatically purge personally identifiable consumer data, complying with statutory privacy guidelines.
          </div>
        </div>
      </div>
    </div>
  );
};

