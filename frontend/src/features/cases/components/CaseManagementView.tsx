import React, { useState } from 'react';
import {
  FolderOpen,
  Search,
  Filter,
  ArrowUpDown,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Eye,
  FileText,
  Clock,
  Plus,
} from 'lucide-react';
import { DEMO_CASES } from '../../../data/mockData';
import { InspectionCase, PriorityLevel } from '../../../types';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { DemoBadge } from '../../../components/common/DemoBadge';

interface CaseManagementViewProps {
  onSelectCase: (caseId: string) => void;
  onNewInspection: () => void;
}

export const CaseManagementView: React.FC<CaseManagementViewProps> = ({
  onSelectCase,
  onNewInspection,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  const filteredCases = DEMO_CASES.filter((c) => {
    const matchesSearch =
      c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.manufacturer.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'NON_COMPLIANT' && c.overallStatus === 'POTENTIAL_NON_COMPLIANCE') ||
      (statusFilter === 'REVIEW' && c.overallStatus === 'NEEDS_HUMAN_VERIFICATION') ||
      (statusFilter === 'COMPLIANT' && c.overallStatus === 'COMPLIANT');

    const matchesPriority =
      priorityFilter === 'ALL' || c.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title Bar */}
      <div className="bg-white p-5 rounded-xl border border-[#E6E4DF] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-[#111413] flex items-center gap-2">
              <FolderOpen className="w-5 h-5 text-[#0E8A8A]" />
              Inspection Case Management
            </h2>
            <DemoBadge />
          </div>
          <p className="text-xs text-[#727A78] mt-1">
            Enforcement circle docket. Access physical commodity records, evidentiary bounding boxes, and adjudication audit logs.
          </p>
        </div>

        <button
          onClick={onNewInspection}
          className="px-4 py-2.5 bg-[#22C2C2] hover:bg-[#1EB0B0] text-[#0F1F1E] rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          Initiate New Case
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#E6E4DF] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#727A78] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Filter by Case ID, Commodity, or Manufacturer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-[#E6E4DF] rounded-lg outline-none focus:ring-1 focus:ring-[#22C2C2] bg-[#F7F6F3] text-[#111413] placeholder-[#727A78]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5">
            <span className="text-[#727A78] font-semibold">Finding:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="py-1.5 px-2.5 rounded-lg border border-[#E6E4DF] bg-[#F7F6F3] text-[#3F4544] font-medium"
            >
              <option value="ALL">All Findings</option>
              <option value="NON_COMPLIANT">Potential Non-Compliance</option>
              <option value="REVIEW">Needs Verification</option>
              <option value="COMPLIANT">Compliant</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[#727A78] font-semibold">Priority:</span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="py-1.5 px-2.5 rounded-lg border border-[#E6E4DF] bg-[#F7F6F3] text-[#3F4544] font-medium"
            >
              <option value="ALL">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Cases Table */}
      <div className="bg-white rounded-xl border border-[#E6E4DF] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F7F6F3] border-b border-[#E6E4DF] text-[#727A78] uppercase text-[10px] font-bold tracking-wider">
                <th className="py-3 px-4">Docket ID</th>
                <th className="py-3 px-4">Product / Commodity</th>
                <th className="py-3 px-4">Manufacturer / Packer</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Compliance Finding</th>
                <th className="py-3 px-4">Docket Status</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Inspecting Officer</th>
                <th className="py-3 px-4">Date Logged</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6E4DF]">
              {filteredCases.map((c) => (
                <tr key={c.id} className="hover:bg-[#F4F3EE]/60 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#0E8A8A]">
                    {c.id}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-[#111413]">{c.productName}</div>
                    <div className="text-[11px] text-[#727A78]">Batch: {c.batchNo}</div>
                  </td>
                  <td className="py-3.5 px-4 text-[#3F4544] font-medium">
                    {c.manufacturer}
                  </td>
                  <td className="py-3.5 px-4 text-[#727A78]">
                    {c.category}
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={c.overallStatus} size="sm" />
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-[#3F4544]">{c.caseStatus}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        c.priority === 'High'
                          ? 'bg-[#FBF0EF] text-[#C1443A] border border-[#F4D6D4]'
                          : c.priority === 'Medium'
                          ? 'bg-[#FDF7ED] text-[#C98A2C] border border-[#F5E5C9]'
                          : 'bg-[#F4F3EE] text-[#3F4544] border border-[#E6E4DF]'
                      }`}
                    >
                      {c.priority}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-[#727A78]">
                    <div className="font-medium text-[#111413]">{c.officer.split('(')[0]}</div>
                    <div className="text-[10px] font-mono text-[#727A78]">{c.officerId}</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[#727A78] text-[11px]">
                    {c.createdDate.split(' ')[0]}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => onSelectCase(c.id)}
                      className="px-3 py-1.5 bg-[#EDF5F1] hover:bg-[#D4E8DF] text-[#0E8A8A] font-bold rounded-lg border border-[#D4E8DF] transition-colors"
                    >
                      Inspect Case
                    </button>
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

