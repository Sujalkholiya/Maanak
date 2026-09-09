import React from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  FolderOpen,
} from 'lucide-react';
import { useInspectionCase } from '../../../hooks/useInspectionCase';
import { ProductIntakeForm } from '../../inspection/components/ProductIntakeForm';

interface DashboardViewProps {
  onNavigate: (view: string) => void;
  onSelectCase: (caseId: string) => void;
  onShowToast?: (
    title: string,
    description?: string,
    type?: 'success' | 'warning' | 'info' | 'error',
    undoAction?: () => void
  ) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
}) => {
  const { allCases } = useInspectionCase();
  const totalCases = allCases?.length || 0;
  const pendingReview = (allCases || []).filter(
    (c) => c.caseStatus === 'Needs Review' || c.overallStatus === 'NEEDS_HUMAN_VERIFICATION'
  ).length;
  const flaggedCases = (allCases || []).filter((c) => c.overallStatus === 'POTENTIAL_NON_COMPLIANCE').length;
  const flaggedRate = totalCases > 0 ? ((flaggedCases / totalCases) * 100).toFixed(1) + '%' : '0.0%';
  const adherenceRate = totalCases > 0 ? (((totalCases - flaggedCases) / totalCases) * 100).toFixed(1) + '%' : '100.0%';
  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* ============================================================ */}
      {/* 1. EXECUTIVE PAGE HEADER */}
      {/* ============================================================ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#111413] tracking-tight">
            Inspection Command Center
          </h1>
          <p className="text-xs sm:text-sm text-[#727A78] mt-1">
            Executive Dashboard
          </p>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. ACTIONABLE METRIC CARDS (Hoverable, Clickable Entry Points) */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Active Cases */}
        <div
          onClick={() => onNavigate('cases')}
          className="group bg-white rounded-xl border border-[#E6E4DF] hover:border-[#22C2C2] shadow-xs hover:shadow-md p-5 flex flex-col justify-between cursor-pointer transition-all active:scale-[0.99]"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#3F4544] flex items-center gap-1.5">
              <FolderOpen className="w-4 h-4 text-[#0E8A8A]" />
              Active Cases
            </span>
            <span className="text-[10px] font-mono font-bold text-[#0E8A8A] bg-[#E8F9F9] px-1.5 py-0.5 rounded border border-[#22C2C2]/30">
              Docket
            </span>
          </div>
          <div className="my-3">
            <div className="text-3xl sm:text-4xl font-black text-[#111413] font-mono tracking-tight group-hover:text-[#0E8A8A] transition-colors">
              {totalCases}
            </div>
            <div className="text-xs font-semibold text-[#0E8A8A] mt-1 flex items-center gap-1">
              <span>View full register</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
          <div className="text-[11px] text-[#727A78] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2F7D5F]"></span>
            <span>All records active in registry</span>
          </div>
        </div>

        {/* Card 2: Pending Officer Review */}
        <div
          onClick={() => onNavigate('cases')}
          className="group bg-white rounded-xl border border-[#E6E4DF] hover:border-[#C98A2C] shadow-xs hover:shadow-md p-5 flex flex-col justify-between cursor-pointer transition-all active:scale-[0.99]"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#3F4544] flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-[#C98A2C]" />
              Pending Review
            </span>
            <span className="text-[10px] font-mono font-bold text-[#C98A2C] bg-[#FDF7ED] px-1.5 py-0.5 rounded border border-[#F5E5C9]">
              Attention
            </span>
          </div>
          <div className="my-3">
            <div className="text-3xl sm:text-4xl font-black text-[#C98A2C] font-mono tracking-tight group-hover:scale-105 transition-transform origin-left">
              {pendingReview}
            </div>
            <div className="text-xs font-semibold text-[#0E8A8A] mt-1 flex items-center gap-1">
              <span>Review docket items</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
          <div className="text-[11px] text-[#C98A2C] font-medium flex items-center gap-1">
            <span>Critical legal deadline</span>
          </div>
        </div>

        {/* Card 3: Potential Non-Compliance */}
        <div
          onClick={() => onNavigate('cases')}
          className="group bg-white rounded-xl border border-[#E6E4DF] hover:border-[#C1443A] shadow-xs hover:shadow-md p-5 flex flex-col justify-between cursor-pointer transition-all active:scale-[0.99]"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#3F4544] flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-[#C1443A]" />
              Flagged Rate
            </span>
            <span className="text-[10px] font-mono font-bold text-[#C1443A] bg-[#FDEDEC] px-1.5 py-0.5 rounded border border-[#FADBD8]">
              Statutory
            </span>
          </div>
          <div className="my-3">
            <div className="text-3xl sm:text-4xl font-black text-[#C1443A] font-mono tracking-tight group-hover:scale-105 transition-transform origin-left">
              {flaggedRate}
            </div>
            <div className="text-xs font-semibold text-[#0E8A8A] mt-1 flex items-center gap-1">
              <span>Inspect flagged items</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
          <div className="text-[11px] text-[#727A78]">
            {flaggedCases} of {totalCases} cases flagged
          </div>
        </div>

        {/* Card 4: Overall Statutory Adherence */}
        <div
          onClick={() => onNavigate('rule-library')}
          className="group bg-white rounded-xl border border-[#E6E4DF] hover:border-[#2F7D5F] shadow-xs hover:shadow-md p-5 flex flex-col justify-between cursor-pointer transition-all active:scale-[0.99]"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#3F4544] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#2F7D5F]" />
              Overall Adherence
            </span>
            <span className="text-[10px] font-mono font-bold text-[#2F7D5F] bg-[#EDF5F1] px-1.5 py-0.5 rounded border border-[#D5E8DF]">
              Standards
            </span>
          </div>
          <div className="my-3">
            <div className="text-3xl sm:text-4xl font-black text-[#2F7D5F] font-mono tracking-tight group-hover:text-[#27664E] transition-colors">
              {adherenceRate}
            </div>
            <div className="text-xs font-semibold text-[#0E8A8A] mt-1 flex items-center gap-1">
              <span>Explore rule benchmarks</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
          <div className="text-[11px] text-[#2F7D5F] font-medium">
            Based on active case determinations
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 3. PRODUCT DETAILS INTAKE FORM (Direct Entry on Dashboard) */}
      {/* ============================================================ */}
      <ProductIntakeForm hidePageHeader={true} />
    </div>
  );
};

export default DashboardView;
