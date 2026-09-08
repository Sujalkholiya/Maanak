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
          className={`inline-flex items-center gap-1.5 font-semibold rounded-md border text-[#2F7D5F] bg-[#EDF5F1] border-[#D4E8DF] ${
            size === 'sm'
              ? 'px-2 py-0.5 text-xs'
              : size === 'lg'
              ? 'px-3.5 py-1.5 text-sm tracking-wide'
              : 'px-2.5 py-1 text-xs'
          }`}
        >
          <CheckCircle2 className={size === 'sm' ? 'w-3.5 h-3.5 text-[#2F7D5F]' : 'w-4 h-4 text-[#2F7D5F]'} />
          COMPLIANT
        </span>
        {showSubtext && (
          <span className="text-[11px] text-[#2F7D5F] mt-0.5 italic">
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
          className={`inline-flex items-center gap-1.5 font-semibold rounded-md border text-[#C1443A] bg-[#FBF0EF] border-[#F4D6D4] ${
            size === 'sm'
              ? 'px-2 py-0.5 text-xs'
              : size === 'lg'
              ? 'px-3.5 py-1.5 text-sm tracking-wide'
              : 'px-2.5 py-1 text-xs'
          }`}
        >
          <AlertOctagon className={size === 'sm' ? 'w-3.5 h-3.5 text-[#C1443A]' : 'w-4 h-4 text-[#C1443A]'} />
          POTENTIAL NON-COMPLIANCE
        </span>
        {showSubtext && (
          <span className="text-[11px] text-[#C1443A] mt-0.5 italic">
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
          className={`inline-flex items-center gap-1.5 font-semibold rounded-md border text-[#C98A2C] bg-[#FDF7ED] border-[#F5E5C9] ${
            size === 'sm'
              ? 'px-2 py-0.5 text-xs'
              : size === 'lg'
              ? 'px-3.5 py-1.5 text-sm tracking-wide'
              : 'px-2.5 py-1 text-xs'
          }`}
        >
          <HelpCircle className={size === 'sm' ? 'w-3.5 h-3.5 text-[#C98A2C]' : 'w-4 h-4 text-[#C98A2C]'} />
          NEEDS HUMAN VERIFICATION
        </span>
        {showSubtext && (
          <span className="text-[11px] text-[#C98A2C] mt-0.5 italic">
            Available digital evidence is insufficient for a definitive determination
          </span>
        )}
      </div>
    );
  }

  if (status === 'Rejected') {
    return (
      <span className="inline-flex items-center gap-1.5 font-medium rounded-md px-2 py-1 text-xs bg-[#F4F3EE] text-[#3F4544] border border-[#E6E4DF]">
        <XCircle className="w-3.5 h-3.5 text-[#727A78]" />
        Finding Rejected
      </span>
    );
  }

  if (status === 'Closed') {
    return (
      <span className="inline-flex items-center gap-1.5 font-medium rounded-md px-2 py-1 text-xs bg-[#F4F3EE] text-[#3F4544] border border-[#E6E4DF]">
        <ShieldCheck className="w-3.5 h-3.5 text-[#727A78]" />
        Inspection Closed
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 font-medium rounded-md px-2 py-1 text-xs bg-[#F4F3EE] text-[#3F4544] border border-[#E6E4DF]">
      <Clock className="w-3.5 h-3.5 text-[#727A78]" />
      {status}
    </span>
  );
};

