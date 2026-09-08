import React, { useState } from 'react';
import {
  BookOpenCheck,
  History,
  Shield,
  Search,
  CheckCircle2,
  Calendar,
  ExternalLink,
  Info,
} from 'lucide-react';
import { MOCK_RULE_LIBRARY } from '../../data/mockData';
import { DemoBadge } from '../common/DemoBadge';

export const RuleLibraryView: React.FC = () => {
  const [selectedVersion, setSelectedVersion] = useState('2026.3');
  const [searchQuery, setSearchQuery] = useState('');

  const versions = [
    { id: '2026.3', label: '2026.3 — Current Gazette (Active)', status: 'CURRENT' },
    { id: '2026.2', label: '2026.2 — Superseded (Nov 2025)', status: 'SUPERSEDED' },
    { id: '2026.1', label: '2026.1 — Superseded (Jan 2024)', status: 'SUPERSEDED' },
    { id: '2011', label: '2011 — Historical Base Standard', status: 'HISTORICAL' },
  ];

  const filteredRules = MOCK_RULE_LIBRARY.filter(
    (r) =>
      r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.rule.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title Bar */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <BookOpenCheck className="w-5 h-5 text-blue-700" />
              Versioned Legal Metrology Rule Library
            </h2>
            <DemoBadge />
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Configurable regulatory repository with gazetted amendment histories. Evaluations bind to the law effective on the date of packaging.
          </p>
        </div>
      </div>

      {/* Philosophy Callout Banner */}
      <div className="bg-blue-50/80 border-l-4 border-blue-600 p-4 rounded-r-xl text-xs text-slate-800 leading-relaxed">
        <div className="font-bold text-blue-950 text-sm mb-1">
          Regulatory Temporal Integrity
        </div>
        "Regulatory rules can change. MAANAK evaluates against the selected/current applicable rule version rather than assuming the original 2011 rules remain unchanged. Pre-printed packaging manufactured prior to an amendment is evaluated under its effective historical epoch."
      </div>

      {/* Version Selector Tabs & Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap gap-2">
          {versions.map((ver) => (
            <button
              key={ver.id}
              onClick={() => setSelectedVersion(ver.id)}
              className={`px-3 py-1.5 rounded-lg font-semibold border transition-all ${
                selectedVersion === ver.id
                  ? 'bg-blue-700 border-blue-700 text-white shadow-xs'
                  : 'bg-slate-50 border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {ver.label}
            </button>
          ))}
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search statutory clauses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-blue-500 bg-slate-50 text-xs"
          />
        </div>
      </div>

      {/* Versioned Rules Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Rule ID</th>
                <th className="py-3 px-4">Statutory Requirement</th>
                <th className="py-3 px-4">Applicable Commodity</th>
                <th className="py-3 px-4">Version</th>
                <th className="py-3 px-4">Effective Date</th>
                <th className="py-3 px-4">Superseded From</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRules.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-blue-700">{r.id}</td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{r.rule}</div>
                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{r.summary}</p>
                  </td>
                  <td className="py-3 px-4 text-slate-600 font-medium">{r.commodity}</td>
                  <td className="py-3 px-4 font-mono font-semibold text-slate-800">{r.version}</td>
                  <td className="py-3 px-4 font-mono text-slate-600">{r.effectiveFrom}</td>
                  <td className="py-3 px-4 font-mono text-slate-500 text-[11px]">{r.supersededFrom}</td>
                  <td className="py-3 px-4 text-right">
                    <span className="inline-flex items-center gap-1 font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded text-[10px]">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      ACTIVE
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

