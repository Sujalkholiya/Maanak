import React from 'react';
import { AlertCircle } from 'lucide-react';

interface DemoBadgeProps {
  label?: string;
  className?: string;
}

export const DemoBadge: React.FC<DemoBadgeProps> = ({
  label = 'Demonstration Data — Evaluation Prototype',
  className = '',
}) => {
  return (
    <span
      className={`inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-slate-600 bg-slate-100 border border-slate-300 px-2 py-0.5 rounded ${className}`}
      title="All metrics, inspections, and manufacturer entities shown are synthetic mock data for prototype evaluation."
    >
      <AlertCircle className="w-3 h-3 text-slate-500" />
      {label}
    </span>
  );
};

