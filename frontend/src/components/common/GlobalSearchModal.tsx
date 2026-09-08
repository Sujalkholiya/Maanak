import React, { useState } from 'react';
import { Search, X, FolderCheck, Package, Building2, Shield, FileText } from 'lucide-react';
import { DEMO_CASES, MOCK_MANUFACTURERS, MOCK_RULE_LIBRARY, MOCK_EVIDENCE_ITEMS } from '../../data/mockData';
import { StatusBadge } from './StatusBadge';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCase: (caseId: string) => void;
  onNavigateView: (view: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectCase,
  onNavigateView,
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const filteredCases = DEMO_CASES.filter(
    (c) =>
      c.id.toLowerCase().includes(q) ||
      c.productName.toLowerCase().includes(q) ||
      c.manufacturer.toLowerCase().includes(q)
  );

  const filteredManufacturers = MOCK_MANUFACTURERS.filter(
    (m) => m.name.toLowerCase().includes(q) || m.registrationNo.toLowerCase().includes(q)
  );

  const filteredRules = MOCK_RULE_LIBRARY.filter(
    (r) => r.id.toLowerCase().includes(q) || r.rule.toLowerCase().includes(q)
  );

  const filteredEvidence = MOCK_EVIDENCE_ITEMS.filter(
    (e) =>
      e.id.toLowerCase().includes(q) ||
      e.caseId.toLowerCase().includes(q) ||
      e.ruleRef.toLowerCase().includes(q)
  );

  const handleCaseClick = (id: string) => {
    onSelectCase(id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-slate-950/60 backdrop-blur-xs p-4">
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-2xl border border-slate-300 overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3 border-b border-slate-200 bg-slate-50 gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search Case ID, Product, Manufacturer, Evidence ID, or Rule ID..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent outline-none text-slate-800 placeholder-slate-400 text-base"
          />
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-xs text-slate-500 bg-slate-200 rounded border border-slate-300">
            ESC
          </kbd>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-200 rounded-lg text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Container */}
        <div className="overflow-y-auto p-4 space-y-5 text-sm">
          {/* Quick preset suggestions if empty */}
          {query === '' && (
            <div className="text-slate-500 text-xs">
              <p className="font-semibold text-slate-700 mb-2">QUICK ACCESS PRESETS:</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setQuery('CASE-2026-0841')}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 rounded border border-slate-300 text-slate-700"
                >
                  CASE-2026-0841 (Royal Feast Almonds)
                </button>
                <button
                  onClick={() => setQuery('ABC Foods')}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 rounded border border-slate-300 text-slate-700"
                >
                  ABC Foods Pvt Ltd
                </button>
                <button
                  onClick={() => setQuery('RULE-6-1-E')}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 rounded border border-slate-300 text-slate-700"
                >
                  RULE-6-1-E (MRP Regulations)
                </button>
                <button
                  onClick={() => setQuery('EVD-2026-0841-A')}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 rounded border border-slate-300 text-slate-700"
                >
                  EVD-2026-0841-A
                </button>
              </div>
            </div>
          )}

          {/* Cases */}
          {filteredCases.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                <FolderCheck className="w-3.5 h-3.5 text-blue-600" />
                Inspection Cases ({filteredCases.length})
              </div>
              <div className="space-y-1.5">
                {filteredCases.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => handleCaseClick(c.id)}
                    className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="font-mono text-xs font-bold text-blue-700 bg-blue-100/60 px-2 py-0.5 rounded">
                        {c.id}
                      </span>
                      <div className="truncate">
                        <div className="font-semibold text-slate-800 truncate">{c.productName}</div>
                        <div className="text-xs text-slate-500">{c.manufacturer} · {c.location}</div>
                      </div>
                    </div>
                    <StatusBadge status={c.overallStatus} size="sm" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Manufacturers */}
          {filteredManufacturers.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                Manufacturers ({filteredManufacturers.length})
              </div>
              <div className="space-y-1.5">
                {filteredManufacturers.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => {
                      onNavigateView('manufacturers');
                      onClose();
                    }}
                    className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/50 cursor-pointer transition-colors"
                  >
                    <div>
                      <div className="font-semibold text-slate-800">{m.name}</div>
                      <div className="text-xs text-slate-500">{m.registrationNo} · {m.address}</div>
                    </div>
                    <span className="text-xs font-semibold px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-300 rounded">
                      {m.recurringIssues} Recurring Issues
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rules */}
          {filteredRules.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                <Shield className="w-3.5 h-3.5 text-emerald-600" />
                Legal Rule Library ({filteredRules.length})
              </div>
              <div className="space-y-1.5">
                {filteredRules.map((r) => (
                  <div
                    key={r.id}
                    onClick={() => {
                      onNavigateView('rule-library');
                      onClose();
                    }}
                    className="p-2.5 rounded-lg border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">
                        {r.id}
                      </span>
                      <span className="font-semibold text-slate-800">{r.rule}</span>
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-1 mt-1">{r.summary}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Evidence */}
          {filteredEvidence.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                <FileText className="w-3.5 h-3.5 text-slate-600" />
                Evidence Vault Records ({filteredEvidence.length})
              </div>
              <div className="space-y-1.5">
                {filteredEvidence.map((e) => (
                  <div
                    key={e.id}
                    onClick={() => {
                      onNavigateView('evidence-vault');
                      onClose();
                    }}
                    className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 hover:border-slate-400 hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-300">
                        {e.id}
                      </span>
                      <div>
                        <div className="font-medium text-slate-800">{e.productName}</div>
                        <div className="text-xs text-slate-500">{e.ruleRef}</div>
                      </div>
                    </div>
                    <StatusBadge status={e.status} size="sm" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

