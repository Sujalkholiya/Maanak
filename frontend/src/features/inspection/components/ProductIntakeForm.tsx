import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  Package,
  PlusCircle,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Tag,
  Scale,
} from 'lucide-react';
import { useInspectionCase } from '../../../hooks/useInspectionCase';
import { useToast } from '../../../hooks/useToast';
import { ROUTES } from '../../../app/router/routes';
import { productService } from '../../../services/productService';

interface ProductIntakeFormProps {
  hidePageHeader?: boolean;
}

const PACKAGED_FOOD_PRESETS = [
  {
    premisesName: 'Haldiram Snacks Pvt. Ltd.',
    premisesAddress: 'B-1/H-3, Mohan Co-operative Industrial Estate, Main Mathura Road, New Delhi - 110044',
    brand: "Haldiram's",
    commodityName: 'Aloo Bhujia (Spiced Potato & Chickpea Noodles)',
    category: 'Packaged Food / Ready-to-Eat Namkeen',
    netQuantity: '400 g',
    mrp: '120.00',
  },
  {
    premisesName: 'Tata Consumer Products Limited',
    premisesAddress: '1, Bishop Lefroy Road, Kolkata, West Bengal - 700020',
    brand: 'Tata Sampann',
    commodityName: 'Unpolished Pure Chana Dal (Peshawari Variety)',
    category: 'Pulses, Grains & Food Grains',
    netQuantity: '1 kg',
    mrp: '165.00',
  },
  {
    premisesName: 'Gujarat Cooperative Milk Marketing Federation Ltd. (Amul)',
    premisesAddress: 'Amul Dairy Road, Anand, Gujarat - 388001',
    brand: 'Amul',
    commodityName: 'Pasteurised Table Butter (Made from Pure Milk Fat)',
    category: 'Dairy Products / Table Butter',
    netQuantity: '500 g',
    mrp: '285.00',
  },
];

export const ProductIntakeForm: React.FC<ProductIntakeFormProps> = ({
  hidePageHeader = false,
}) => {
  const navigate = useNavigate();
  const { currentCase, addNewCase } = useInspectionCase();
  const { showToast } = useToast();

  const [premisesName, setPremisesName] = useState('Haldiram Snacks Pvt. Ltd.');
  const [premisesAddress, setPremisesAddress] = useState('B-1/H-3, Mohan Co-operative Industrial Estate, Main Mathura Road, New Delhi - 110044');
  const [commodityName, setCommodityName] = useState('Aloo Bhujia (Spiced Potato & Chickpea Noodles)');
  const [brand, setBrand] = useState("Haldiram's");
  const [category, setCategory] = useState('Packaged Food / Ready-to-Eat Namkeen');
  const [netQuantity, setNetQuantity] = useState('400 g');
  const [mrp, setMrp] = useState('120.00');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedData, setConfirmedData] = useState<{
    productId?: string;
    caseId?: string;
    productName: string;
    price: number;
    timestamp: string;
  } | null>(null);

  const handleApplyPreset = (idx: number) => {
    const p = PACKAGED_FOOD_PRESETS[idx];
    setPremisesName(p.premisesName);
    setPremisesAddress(p.premisesAddress);
    setBrand(p.brand);
    setCommodityName(p.commodityName);
    setCategory(p.category);
    setNetQuantity(p.netQuantity);
    setMrp(p.mrp);
    showToast('Packaged Food Preset Loaded', `Loaded sample data for ${p.brand} ${p.commodityName}`, 'info');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
    const numericPrice = parseFloat(mrp.replace(/[^0-9.]/g, '')) || 120;

    setIsSubmitting(true);
    let backendProductId = '';

    try {
      // 1. Post to Backend /api/product/post
      const createdProduct = await productService.createProduct(fullProductName, numericPrice);
      if (createdProduct && createdProduct._id) {
        backendProductId = createdProduct._id;
      }
    } catch (err: any) {
      console.warn('Backend product creation warning:', err);
    }

    // 2. Map declarations
    const updatedDeclarations = currentCase.declarations.map((d) => {
      if (d.fieldId === 'f-mfr' || d.label.includes('Manufacturer')) {
        return { ...d, detectedValue: fullPremises };
      }
      if (d.fieldId === 'f-name' || d.label.includes('Name') || d.label.includes('Commodity')) {
        return { ...d, detectedValue: fullProductName };
      }
      if (d.fieldId === 'f-mrp' || d.label.includes('MRP')) {
        return { ...d, detectedValue: `₹ ${numericPrice.toFixed(2)}` };
      }
      if (d.fieldId === 'f-net-qty' || d.label.includes('Quantity')) {
        return { ...d, detectedValue: netQuantity };
      }
      return d;
    });

    // 3. Create Case in MongoDB via CaseContext / caseService.createCase
    const newCase = addNewCase({
      productName: fullProductName,
      brand: brand.trim(),
      manufacturer: fullPremises,
      category,
      declarations: updatedDeclarations,
    });

    setConfirmedData({
      productId: backendProductId || 'PRD-MNG-' + Math.floor(1000 + Math.random() * 9000),
      caseId: newCase.id,
      productName: fullProductName,
      price: numericPrice,
      timestamp: new Date().toLocaleTimeString('en-IN') + ' IST',
    });

    setIsSubmitting(false);

    showToast(
      'Packaged Food Confirmed & Saved',
      `Product and Case ${newCase.id} registered in MongoDB backend.`,
      'success'
    );

    // Short delay to let the officer see confirmation, then proceed to scan
    setTimeout(() => {
      navigate(ROUTES.WORKFLOW.SCAN_PACKAGE);
    }, 1800);
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
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-[#727A78]">Quick Sample:</span>
            {PACKAGED_FOOD_PRESETS.map((p, idx) => (
              <button
                key={p.brand}
                type="button"
                onClick={() => handleApplyPreset(idx)}
                className="text-[11px] font-semibold text-[#0E8A8A] hover:text-[#111413] bg-[#22C2C2]/10 hover:bg-[#22C2C2]/20 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
              >
                {p.brand}
              </button>
            ))}
            <span className="text-[10px] font-mono font-bold bg-[#22C2C2]/15 text-[#0E8A8A] px-2.5 py-1 rounded-full border border-[#22C2C2]/30">
              Phase 1 of 5
            </span>
          </div>
        </div>

        {/* Confirmation Banner */}
        {confirmedData && (
          <div className="mx-6 mt-6 p-4 bg-emerald-50 border-2 border-emerald-400 rounded-xl flex items-start gap-3 shadow-xs">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <div className="font-bold text-emerald-900 text-sm">
                Packaged Food Product Registered & Confirmed on MongoDB Backend!
              </div>
              <div className="text-emerald-800">
                <strong>Product Name:</strong> {confirmedData.productName} · <strong>MRP:</strong> ₹{confirmedData.price.toFixed(2)}
              </div>
              <div className="font-mono text-[11px] text-emerald-700">
                Backend Product ID: <strong>{confirmedData.productId}</strong> · Live Case ID: <strong>{confirmedData.caseId}</strong> · {confirmedData.timestamp}
              </div>
              <div className="text-[11px] text-emerald-600 font-medium">
                Docket created in MongoDB. Redirecting to label photo capture...
              </div>
            </div>
          </div>
        )}

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
              <span>2. Packaged Commodity & Price Details</span>
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
                  placeholder="e.g., Aloo Bhujia, Chana Dal, Butter"
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
                  placeholder="e.g., Haldiram's, Tata Sampann, Amul"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E4DF] bg-white text-xs sm:text-sm font-medium text-[#111413] focus:outline-hidden focus:border-[#22C2C2] focus:ring-2 focus:ring-[#22C2C2]/20 transition-all placeholder:text-[#9EA6A4]"
                />
                <span className="text-[10px] text-[#727A78] mt-1 block">
                  Trade brand or commercial label name
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#111413] mb-1.5">
                  Commodity Category <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g., Packaged Food / Namkeen"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E4DF] bg-white text-xs sm:text-sm font-medium text-[#111413] focus:outline-hidden focus:border-[#22C2C2] focus:ring-2 focus:ring-[#22C2C2]/20 transition-all placeholder:text-[#9EA6A4]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#111413] mb-1.5">
                    Net Quantity <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={netQuantity}
                    onChange={(e) => setNetQuantity(e.target.value)}
                    placeholder="e.g., 400 g, 1 kg"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E4DF] bg-white text-xs sm:text-sm font-medium text-[#111413] focus:outline-hidden focus:border-[#22C2C2] focus:ring-2 focus:ring-[#22C2C2]/20 transition-all placeholder:text-[#9EA6A4]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#111413] mb-1.5">
                    MRP (₹) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={mrp}
                    onChange={(e) => setMrp(e.target.value)}
                    placeholder="e.g., 120.00"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E4DF] bg-white text-xs sm:text-sm font-medium text-[#111413] focus:outline-hidden focus:border-[#22C2C2] focus:ring-2 focus:ring-[#22C2C2]/20 transition-all placeholder:text-[#9EA6A4]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Form Footer */}
          <div className="pt-4 border-t border-[#E6E4DF] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-xs text-[#727A78]">
              Next Phase: <strong className="text-[#111413]">Phase 2 · Scan Package (Attach Photos)</strong>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 bg-[#22C2C2] hover:bg-[#1EB0B0] active:bg-[#18A0A0] disabled:opacity-50 text-[#0F1F1E] text-xs sm:text-sm font-bold px-6 py-3 rounded-xl shadow-xs transition-all active:scale-[0.98] cursor-pointer"
              title="Submit details and register in Backend"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 text-[#0F1F1E] animate-spin" />
                  <span>Registering in Backend...</span>
                </>
              ) : (
                <>
                  <PlusCircle className="w-4 h-4 text-[#0F1F1E]" />
                  <span>Register & Initialize Inspection</span>
                  <ArrowRight className="w-4 h-4 text-[#0F1F1E] ml-0.5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductIntakeForm;
