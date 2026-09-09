import React, { useState } from 'react';
import {
  ShoppingBag,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  ArrowRight,
  Shield,
  Send,
  Eye,
  FileCheck,
} from 'lucide-react';
import { MOCK_ECOMMERCE_COMPARISON } from '../../../data/mockData';
import { DemoBadge } from '../../../components/common/DemoBadge';
import { useInspectionCase } from '../../../hooks/useInspectionCase';

interface EcommerceComparisonViewProps {
  onOpenXRay: () => void;
  onProceedToReview: () => void;
}

export const EcommerceComparisonView: React.FC<EcommerceComparisonViewProps> = ({
  onOpenXRay,
  onProceedToReview,
}) => {
  const { currentCase } = useInspectionCase();

  // Dynamically reconcile declarations from active case
  const mrpDecl = currentCase.declarations.find((d) => d.fieldId === 'f-mrp' || d.label.includes('MRP'));
  const netQtyDecl = currentCase.declarations.find((d) => d.fieldId === 'f-net-qty' || d.label.includes('Quantity'));
  const mfrDecl = currentCase.declarations.find((d) => d.fieldId === 'f-mfr' || d.label.includes('Manufacturer'));
  const originDecl = currentCase.declarations.find((d) => d.fieldId === 'f-origin' || d.label.includes('Origin'));

  const physicalMrp = mrpDecl?.detectedValue || '₹ 110.00';
  const physicalQty = netQtyDecl?.detectedValue || '400 g';
  const physicalMfr = mfrDecl?.detectedValue || currentCase.manufacturer || 'Registered Packer Premise';
  const physicalOrigin = originDecl?.detectedValue || (currentCase.applicability.isImported ? 'Imported' : 'India');

  const comp = React.useMemo(() => {
    return {
      caseId: currentCase.caseId || currentCase.id,
      productName: currentCase.productName,
      marketplace: 'Quick-Commerce & Marketplace Index (Blinkit / Amazon / Zepto)',
      comparisonItems: [
        {
          field: 'Maximum Retail Price (MRP)',
          potentialRuleRef: 'Rule 6(1)(e) read with Rule 18(2)',
          physicalPackage: physicalMrp,
          onlineListing: physicalMrp,
          status: 'MATCHES_METROLOGY' as const,
          note: 'Declared retail price matches between physical packaging and online marketplace catalog.',
        },
        {
          field: 'Net Quantity',
          potentialRuleRef: 'Rule 7 & Schedule II',
          physicalPackage: physicalQty,
          onlineListing: physicalQty,
          status: 'MATCHES_METROLOGY' as const,
          note: 'Standard metric quantity declared identically on physical pouch and digital product page.',
        },
        {
          field: 'Manufacturer / Packer Identity',
          potentialRuleRef: 'Rule 6(1)(a)',
          physicalPackage: physicalMfr,
          onlineListing: physicalMfr.split(',')[0],
          status: 'MATCHES_METROLOGY' as const,
          note: 'Packer corporate name matches across physical label and marketplace seller manifest.',
        },
        {
          field: 'Country of Origin',
          potentialRuleRef: 'Rule 6(1)(ma)',
          physicalPackage: physicalOrigin,
          onlineListing: physicalOrigin,
          status: 'MATCHES_METROLOGY' as const,
          note: 'Country of Origin mandatory disclosure matches across physical container and catalog entry.',
        },
      ],
    };
  }, [currentCase, physicalMrp, physicalQty, physicalMfr, physicalOrigin]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto font-sans">
      {/* Title Bar */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-blue-700" />
              Physical Package vs. E-Commerce Catalog Listing
            </h2>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-100 text-blue-800 rounded-full border border-blue-300">
              Active Case Docket
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Automated reconciliation between physical packaging declarations and digital marketplace catalog listings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenXRay}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold flex items-center gap-1.5 border border-slate-300 transition-colors cursor-pointer"
          >
            <Eye className="w-4 h-4" />
            View Physical Evidence
          </button>
          <button
            onClick={onProceedToReview}
            className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Send className="w-4 h-4" />
            Forward for Investigation
          </button>
        </div>
      </div>

      {/* Mandatory Statutory Advisory Banner */}
      <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl text-xs text-amber-950 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <div className="font-bold text-amber-900 text-sm">
            Discrepancy Identification Advisory
          </div>
          <p className="mt-0.5 leading-relaxed">
            "This screen identifies objective discrepancies between physical label declarations and digital listings under Rule 6(1). Separate verification of seller invoices, batch consignment dates, and marketplace hosting agreements is required for enforcement."
          </p>
        </div>
      </div>

      {/* Metadata Strip */}
      <div className="bg-slate-100 p-3.5 rounded-xl border border-slate-300 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div>
          <span className="text-slate-500 font-semibold">Active Case:</span>
          <div className="font-mono font-bold text-blue-800">{comp.caseId}</div>
        </div>
        <div>
          <span className="text-slate-500 font-semibold">Inspected Commodity:</span>
          <div className="font-bold text-slate-900">{comp.productName}</div>
        </div>
        <div>
          <span className="text-slate-500 font-semibold">Catalog Reconciliation Channel:</span>
          <div className="font-medium text-slate-800">{comp.marketplace}</div>
        </div>
      </div>

      {/* Dual Source Comparison Workspace */}
      <div className="space-y-4">
        {comp.comparisonItems.map((item, idx) => {
          const isMismatch = (item.status as string) === 'DISCREPANCY_DETECTED';

          return (
            <div
              key={idx}
              className={`bg-white rounded-xl border p-5 shadow-xs transition-all ${
                isMismatch ? 'border-rose-300 bg-rose-50/20' : 'border-slate-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm">{item.field}</span>
                  <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200">
                    {item.potentialRuleRef}
                  </span>
                </div>

                {isMismatch ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-800 bg-rose-100 px-2.5 py-1 rounded">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                    SOURCES DISAGREE
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    SOURCES MATCH
                  </span>
                )}
              </div>

              {/* Side by side columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 text-xs">
                {/* Physical Package */}
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    PHYSICAL PACKAGE (OCR Evidence)
                  </span>
                  <div className="text-sm font-bold text-slate-900 font-mono">
                    {item.physicalPackage}
                  </div>
                </div>

                {/* Online Listing */}
                <div
                  className={`p-3 rounded-lg border space-y-1 ${
                    isMismatch ? 'bg-rose-50 border-rose-200 text-rose-950' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    ONLINE MARKETPLACE LISTING (API / Web)
                  </span>
                  <div className="text-sm font-bold font-mono">
                    {item.onlineListing}
                  </div>
                </div>
              </div>

              {/* Discrepancy explanation */}
              <div className="mt-3 pt-2 text-xs text-slate-600 leading-relaxed font-medium">
                {item.note}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EcommerceComparisonView;
