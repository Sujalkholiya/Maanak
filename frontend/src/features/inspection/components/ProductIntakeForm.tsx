import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  Package,
  PlusCircle,
  ArrowRight,
} from 'lucide-react';
import { useInspectionCase } from '../../../hooks/useInspectionCase';
import { useToast } from '../../../hooks/useToast';
import { ROUTES } from '../../../app/router/routes';

interface ProductIntakeFormProps {
  hidePageHeader?: boolean;
}

export const ProductIntakeForm: React.FC<ProductIntakeFormProps> = ({
  hidePageHeader = false,
}) => {
  const navigate = useNavigate();
  const { currentCase, addNewCase, updateCurrentCase } = useInspectionCase();
  const { showToast } = useToast();

  // All fields strictly mandatory as requested
  const [premisesName, setPremisesName] = useState('');
  const [premisesAddress, setPremisesAddress] = useState('');
  const [commodityName, setCommodityName] = useState('');
  const [brand, setBrand] = useState('');

  const handleFillSample = () => {
    setPremisesName('Royal Feast Confectionery Ltd.');
    setPremisesAddress('Plot 42, Okhla Industrial Area Phase-III, New Delhi - 110020');
    setCommodityName('Roasted California Almonds');
    setBrand('Royal Feast');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Strict validation: every single section must be filled
    if (
      !premisesName.trim() ||
      !premisesAddress.trim() ||
      !commodityName.trim() ||
      !brand.trim()
    ) {
      showToast(
        'Mandatory Fields Incomplete',
        'All sections of this form are mandatory. Please fill in all fields before submitting.',
        'error'
      );
      return;
    }

    const fullPremises = `${premisesName.trim()}, ${premisesAddress.trim()}`;
    const fullProductName = `${brand.trim()} ${commodityName.trim()}`;

    // Map to legal metrology declarations
    const updatedDeclarations = currentCase.declarations.map((d) => {
      if (d.fieldId === 'f1' || d.label.includes('Manufacturer')) {
        return { ...d, detectedValue: fullPremises };
      }
      if (d.fieldId === 'f3' || d.label.includes('Name') || d.label.includes('Commodity')) {
        return { ...d, detectedValue: fullProductName };
      }
      return d;
    });

    // Update current inspection case in context
    updateCurrentCase({
      productName: fullProductName,
      manufacturer: fullPremises,
      declarations: updatedDeclarations,
    });

    showToast(
      'Inspection Docket Initialized',
      `All statutory details recorded for "${fullProductName}". Proceeding to image capture.`,
      'success'
    );

    // Redirect to next phase: Scan Package
    navigate(ROUTES.WORKFLOW.SCAN_PACKAGE);
  };

  return (
    <div id="dashboard-intake-form" className="max-w-4xl mx-auto pb-16 space-y-6">
      {/* Header */}
      {!hidePageHeader && (
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#111413] tracking-tight">
            New Inspection
          </h1>
          <p className="text-xs sm:text-sm text-[#727A78] mt-1">
            Enter premises and packaged commodity details to begin the legal metrology inspection.
          </p>
        </div>
      )}

      {/* Main Intake Form Card */}
      <div className="bg-white rounded-2xl border border-[#E6E4DF] shadow-xs overflow-hidden">
        {/* Form Title Banner */}
        <div className="px-6 py-4 border-b border-[#E6E4DF] bg-[#FAF9F6] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#22C2C2]/15 text-[#0E8A8A] flex items-center justify-center font-bold">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#111413]">
                Package & Premises Details
              </h2>
              <p className="text-[11px] text-[#727A78]">
                Statutory declarations under Legal Metrology (Packaged Commodities) Rules, 2011
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleFillSample}
              className="text-[11px] font-semibold text-[#0E8A8A] hover:text-[#111413] bg-[#22C2C2]/10 hover:bg-[#22C2C2]/20 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
            >
              Auto-fill Sample
            </button>
            <span className="text-[10px] font-mono font-bold bg-[#22C2C2]/15 text-[#0E8A8A] px-2.5 py-1 rounded-full border border-[#22C2C2]/30">
              Phase 1 of 5
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          {/* Section 1: Premises Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#727A78]">
              <Building2 className="w-3.5 h-3.5 text-[#0E8A8A]" />
              <span>1. Premises Information</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#111413] mb-1.5">
                  Name of Premises <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={premisesName}
                  onChange={(e) => setPremisesName(e.target.value)}
                  placeholder="Manufacturer / Packer / Retailer name"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E4DF] bg-white text-xs sm:text-sm font-medium text-[#111413] focus:outline-hidden focus:border-[#22C2C2] focus:ring-2 focus:ring-[#22C2C2]/20 transition-all placeholder:text-[#9EA6A4]"
                />
                <span className="text-[10px] text-[#727A78] mt-1 block">
                  Indicate whether manufacturer, packer, importer, or retail establishment
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#111413] mb-1.5">
                  Address of Premises <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={premisesAddress}
                    onChange={(e) => setPremisesAddress(e.target.value)}
                    placeholder="Complete address (Plot, Area, City, Pin code)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E4DF] bg-white text-xs sm:text-sm font-medium text-[#111413] focus:outline-hidden focus:border-[#22C2C2] focus:ring-2 focus:ring-[#22C2C2]/20 transition-all placeholder:text-[#9EA6A4]"
                  />
                </div>
                <span className="text-[10px] text-[#727A78] mt-1 block">
                  Must include state and postal index number for jurisdiction verification
                </span>
              </div>
            </div>
          </div>

          <div className="h-px bg-[#E6E4DF]" />

          {/* Section 2: Commodity & Brand Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#727A78]">
              <Package className="w-3.5 h-3.5 text-[#0E8A8A]" />
              <span>2. Commodity & Package Details</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#111413] mb-1.5">
                  Commodity Name / Package Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={commodityName}
                  onChange={(e) => setCommodityName(e.target.value)}
                  placeholder="e.g., wheat flour, biscuits, almonds"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E4DF] bg-white text-xs sm:text-sm font-medium text-[#111413] focus:outline-hidden focus:border-[#22C2C2] focus:ring-2 focus:ring-[#22C2C2]/20 transition-all placeholder:text-[#9EA6A4]"
                />
                <span className="text-[10px] text-[#727A78] mt-1 block">
                  Generic or common name of the packaged commodity
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#111413] mb-1.5">
                  Brand Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="e.g., Royal Feast, Fortune, Britannia"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E4DF] bg-white text-xs sm:text-sm font-medium text-[#111413] focus:outline-hidden focus:border-[#22C2C2] focus:ring-2 focus:ring-[#22C2C2]/20 transition-all placeholder:text-[#9EA6A4]"
                />
                <span className="text-[10px] text-[#727A78] mt-1 block">
                  Trade brand or commercial label name
                </span>
              </div>
            </div>
          </div>

          {/* Form Footer with Exact Same UI Button */}
          <div className="pt-4 border-t border-[#E6E4DF] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-xs text-[#727A78]">
              Next Phase: <strong className="text-[#111413]">Phase 2 · Scan Package (Attach Photos)</strong>
            </div>

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 bg-[#22C2C2] hover:bg-[#1EB0B0] active:bg-[#18A0A0] text-[#0F1F1E] text-xs sm:text-sm font-bold px-6 py-3 rounded-xl shadow-xs transition-all active:scale-[0.98] cursor-pointer"
              title="Submit details and proceed to Scan Package"
            >
              <PlusCircle className="w-4 h-4 text-[#0F1F1E]" />
              <span>New Inspection</span>
              <ArrowRight className="w-4 h-4 text-[#0F1F1E] ml-0.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductIntakeForm;
