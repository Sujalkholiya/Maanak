import React, { useState } from 'react';
import {
  MapPin,
  Filter,
  Layers,
  Shield,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  BarChart2,
  Info,
} from 'lucide-react';
import { MOCK_HEATMAP_DATA } from '../../data/mockData';
import { DemoBadge } from '../common/DemoBadge';

export const HeatmapView: React.FC = () => {
  const [selectedCommodity, setSelectedCommodity] = useState('ALL');
  const [selectedFinding, setSelectedFinding] = useState('ALL');
  const [activeRegion, setActiveRegion] = useState<string>('Delhi NCR');

  const selectedData =
    MOCK_HEATMAP_DATA.find((d) => d.state === activeRegion) || MOCK_HEATMAP_DATA[0];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title Bar */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-700" />
              Regional Compliance Density & Geographic Heatmap
            </h2>
            <DemoBadge />
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Spatial distribution of packaged commodity inspections, repeat findings, and verification density across regional enforcement zones.
          </p>
        </div>
      </div>

      {/* Mandatory Official Disclaimer Banner */}
      <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl text-xs text-amber-950 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <div className="font-bold text-amber-900 text-sm">
            Demonstration Visualization Notice
          </div>
          <p className="mt-0.5 leading-relaxed font-medium">
            "Demo Visualization — Not Official Inspection Statistics. All geographic coordinates, district totals, and regional compliance indexes represent synthetic prototype demonstration data for software capability evaluation."
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-semibold">Commodity Filter:</span>
            <select
              value={selectedCommodity}
              onChange={(e) => setSelectedCommodity(e.target.value)}
              className="py-1.5 px-2.5 rounded-lg border border-slate-300 bg-slate-50 font-medium"
            >
              <option value="ALL">All Commodities</option>
              <option value="FOOD">Packaged Foods</option>
              <option value="OIL">Edible Oils</option>
              <option value="INFANT">Infant Foods</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-semibold">Finding Type:</span>
            <select
              value={selectedFinding}
              onChange={(e) => setSelectedFinding(e.target.value)}
              className="py-1.5 px-2.5 rounded-lg border border-slate-300 bg-slate-50 font-medium"
            >
              <option value="ALL">All Findings</option>
              <option value="MRP">MRP Alteration (Rule 6(1)(e))</option>
              <option value="FONT">Font Size Deficit (Rule 7)</option>
              <option value="USP">Missing USP (Rule 6(1)(da))</option>
            </select>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs">
          <span className="text-slate-500 font-semibold">Density Index:</span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Low
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Moderate
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> High Density
          </span>
        </div>
      </div>

      {/* Main Map Visual & Regional Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Regional Map Canvas (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-sm text-slate-900">
              India Enforcement Circles Heatmap
            </h3>
            <span className="font-mono text-xs text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
              Interactive SVG View
            </span>
          </div>

          {/* Stylized Regional Schematic Vector Map of India Enforcement Hubs */}
          <div className="relative aspect-4/3 w-full bg-slate-900 rounded-xl overflow-hidden mt-4 p-4 border border-slate-800 flex items-center justify-center">
            <svg
              viewBox="0 0 500 500"
              className="w-full h-full max-h-96 filter drop-shadow-md"
            >
              {/* Geographic Outline Silhouette (Stylized India geometry) */}
              <path
                d="M 230 40 Q 260 50 250 80 Q 290 110 320 120 Q 380 130 400 160 Q 420 200 370 210 Q 320 220 300 240 Q 320 290 290 340 Q 260 400 250 460 Q 230 460 210 400 Q 180 340 160 300 Q 140 270 140 240 Q 120 220 130 180 Q 160 160 190 140 Q 200 90 230 40 Z"
                fill="#1E293B"
                stroke="#334155"
                strokeWidth="2"
              />

              {/* Delhi NCR Node */}
              <g
                className="cursor-pointer group"
                onClick={() => setActiveRegion('Delhi NCR')}
              >
                <circle cx="235" cy="165" r="22" fill="#F59E0B" fillOpacity="0.3" className="animate-ping" />
                <circle cx="235" cy="165" r="14" fill="#F59E0B" stroke="#FFF" strokeWidth="2" />
                <text x="255" y="169" fill="#FFF" fontSize="11" fontWeight="bold" fontFamily="sans-serif">
                  Delhi NCR (412)
                </text>
              </g>

              {/* Haryana Node */}
              <g
                className="cursor-pointer group"
                onClick={() => setActiveRegion('Haryana (Industrial Belt)')}
              >
                <circle cx="215" cy="155" r="16" fill="#EF4444" fillOpacity="0.3" />
                <circle cx="215" cy="155" r="10" fill="#EF4444" stroke="#FFF" strokeWidth="2" />
              </g>

              {/* Uttar Pradesh Node */}
              <g
                className="cursor-pointer group"
                onClick={() => setActiveRegion('Uttar Pradesh (West Hub)')}
              >
                <circle cx="280" cy="180" r="18" fill="#EF4444" fillOpacity="0.3" />
                <circle cx="280" cy="180" r="12" fill="#EF4444" stroke="#FFF" strokeWidth="2" />
                <text x="298" y="184" fill="#E2E8F0" fontSize="10" fontFamily="sans-serif">
                  UP West (480)
                </text>
              </g>

              {/* Gujarat Node */}
              <g
                className="cursor-pointer group"
                onClick={() => setActiveRegion('Gujarat (Ahmedabad-Surat)')}
              >
                <circle cx="160" cy="240" r="16" fill="#10B981" fillOpacity="0.3" />
                <circle cx="160" cy="240" r="11" fill="#10B981" stroke="#FFF" strokeWidth="2" />
                <text x="80" y="244" fill="#E2E8F0" fontSize="10" fontFamily="sans-serif">
                  Gujarat (340)
                </text>
              </g>

              {/* Maharashtra Node */}
              <g
                className="cursor-pointer group"
                onClick={() => setActiveRegion('Maharashtra (Mumbai-Pune)')}
              >
                <circle cx="195" cy="290" r="24" fill="#F59E0B" fillOpacity="0.3" />
                <circle cx="195" cy="290" r="15" fill="#F59E0B" stroke="#FFF" strokeWidth="2" />
                <text x="218" y="294" fill="#FFF" fontSize="11" fontWeight="bold" fontFamily="sans-serif">
                  Mumbai-Pune (580)
                </text>
              </g>

              {/* Karnataka Node */}
              <g
                className="cursor-pointer group"
                onClick={() => setActiveRegion('Karnataka (Bengaluru Hub)')}
              >
                <circle cx="210" cy="370" r="16" fill="#10B981" fillOpacity="0.3" />
                <circle cx="210" cy="370" r="12" fill="#10B981" stroke="#FFF" strokeWidth="2" />
                <text x="230" y="374" fill="#E2E8F0" fontSize="10" fontFamily="sans-serif">
                  Bengaluru (395)
                </text>
              </g>
            </svg>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Click any glowing circle to inspect zone statistics</span>
            <span className="font-mono text-slate-600">Active: {activeRegion}</span>
          </div>
        </div>

        {/* Right: Selected Region Deep-Dive (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Circle Details
              </div>
              <div className="flex items-center justify-between mt-1">
                <h3 className="font-black text-lg text-slate-900">{selectedData.state}</h3>
                <span
                  className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                    selectedData.riskIndex === 'High'
                      ? 'bg-rose-100 text-rose-800'
                      : selectedData.riskIndex === 'Moderate'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {selectedData.riskIndex} Risk Index
                </span>
              </div>
            </div>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500">Total Inspections:</span>
                <div className="text-2xl font-black text-slate-900 font-mono mt-0.5">
                  {selectedData.inspections}
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                <span className="text-emerald-800">Compliant Packages:</span>
                <div className="text-2xl font-black text-emerald-700 font-mono mt-0.5">
                  {selectedData.compliant}
                </div>
              </div>

              <div className="p-3 bg-rose-50 rounded-xl border border-rose-200">
                <span className="text-rose-800">Potential Issues:</span>
                <div className="text-2xl font-black text-rose-700 font-mono mt-0.5">
                  {selectedData.potentialIssues}
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                <span className="text-amber-800">Human Reviews:</span>
                <div className="text-2xl font-black text-amber-700 font-mono mt-0.5">
                  {selectedData.verificationRequired}
                </div>
              </div>
            </div>

            {/* Regional Findings Table */}
            <div className="pt-2">
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                All Zone Summaries
              </div>
              <div className="space-y-1.5 text-xs">
                {MOCK_HEATMAP_DATA.map((d) => (
                  <div
                    key={d.state}
                    onClick={() => setActiveRegion(d.state)}
                    className={`p-2.5 rounded-lg border flex items-center justify-between cursor-pointer transition-colors ${
                      activeRegion === d.state
                        ? 'bg-blue-50 border-blue-400 font-bold'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-slate-800">{d.state}</span>
                    <span className="font-mono text-slate-600">{d.inspections} scans</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

