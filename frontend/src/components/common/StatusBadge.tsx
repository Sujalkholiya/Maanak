import React from 'react';
import { ComplianceState, CaseStatus } from '../../types';
import { CheckCircle2, AlertOctagon, HelpCircle, ShieldCheck, XCircle, Clock } from 'lucide-react';

interface StatusBadgeProps {
  status: ComplianceState | CaseStatus | string;
  size?: 'sm' | 'md' | 'lg';
  showSubtext?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showSubtext = false,
}) => {
  if (status === 'COMPLIANT' || status === 'Verified') {
    return (
      <div className="inline-flex flex-col">
        <span
          className={`inline-flex items-center gap-1.5 font-semibold rounded-md border text-emerald-800 bg-emerald-50 border-emerald-300 ${
            size === 'sm'
              ? 'px-2 py-0.5 text-xs'
              : size === 'lg'
              ? 'px-3.5 py-1.5 text-sm tracking-wide'
              : 'px-2.5 py-1 text-xs'
          }`}
        >
          <CheckCircle2 className={size === 'sm' ? 'w-3.5 h-3.5 text-emerald-600' : 'w-4 h-4 text-emerald-600'} />
          COMPLIANT
        </span>
        {showSubtext && (
          <span className="text-[11px] text-emerald-700 mt-0.5 italic">
            Compliant with checks performed
          </span>
        )}
      </div>
    );
  }

  if (status === 'POTENTIAL_NON_COMPLIANCE' || status === 'Potential Non-Compliance') {
    return (
      <div className="inline-flex flex-col">
        <span
          className={`inline-flex items-center gap-1.5 font-semibold rounded-md border text-rose-800 bg-rose-50 border-rose-300 ${
            size === 'sm'
              ? 'px-2 py-0.5 text-xs'
              : size === 'lg'
              ? 'px-3.5 py-1.5 text-sm tracking-wide'
              : 'px-2.5 py-1 text-xs'
          }`}
        >
          <AlertOctagon className={size === 'sm' ? 'w-3.5 h-3.5 text-rose-600' : 'w-4 h-4 text-rose-600'} />
          POTENTIAL NON-COMPLIANCE
        </span>
        {showSubtext && (
          <span className="text-[11px] text-rose-700 mt-0.5 italic">
            A rule/evidence mismatch was detected
          </span>
        )}
      </div>
    );
  }

  if (status === 'NEEDS_HUMAN_VERIFICATION' || status === 'Needs Review') {
    return (
      <div className="inline-flex flex-col">
        <span
          className={`inline-flex items-center gap-1.5 font-semibold rounded-md border text-amber-800 bg-amber-50 border-amber-300 ${
            size === 'sm'
              ? 'px-2 py-0.5 text-xs'
              : size === 'lg'
              ? 'px-3.5 py-1.5 text-sm tracking-wide'
              : 'px-2.5 py-1 text-xs'
          }`}
        >
          <HelpCircle className={size === 'sm' ? 'w-3.5 h-3.5 text-amber-600' : 'w-4 h-4 text-amber-600'} />
          NEEDS HUMAN VERIFICATION
        </span>
        {showSubtext && (
          <span className="text-[11px] text-amber-700 mt-0.5 italic">
            Available digital evidence is insufficient for a definitive determination
          </span>
        )}
      </div>
    );
  }

  if (status === 'Rejected') {
    return (
      <span className="inline-flex items-center gap-1.5 font-medium rounded-md px-2 py-1 text-xs bg-slate-100 text-slate-700 border border-slate-300">
        <XCircle className="w-3.5 h-3.5 text-slate-500" />
        Finding Rejected
      </span>
    );
  }

  if (status === 'Closed') {
    return (
      <span className="inline-flex items-center gap-1.5 font-medium rounded-md px-2 py-1 text-xs bg-slate-100 text-slate-600 border border-slate-300">
        <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
        Inspection Closed
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 font-medium rounded-md px-2 py-1 text-xs bg-slate-100 text-slate-700 border border-slate-300">
      <Clock className="w-3.5 h-3.5 text-slate-500" />
      {status}
    </span>
  );
};

