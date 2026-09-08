import React, { useState } from 'react';
import { Package, X, Check, Building2, Tag, Calendar, MapPin, FileText } from 'lucide-react';
import { InspectionCase } from '../../../types';
import { useInspectionCase } from '../../../hooks/useInspectionCase';
import { useToast } from '../../../hooks/useToast';

interface ProductIntakeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCase: InspectionCase;
}

export const ProductIntakeModal: React.FC<ProductIntakeModalProps> = ({
  isOpen,
  onClose,
  currentCase,
}) => {
  const { addNewCase, updateCurrentCase } = useInspectionCase();
  const { showToast } = useToast();

  const [mode, setMode] = useState<'UPDATE' | 'NEW'>('UPDATE');
  const [productName, setProductName] = useState(currentCase.productName);
  const [category, setCategory] = useState(currentCase.category);
  const [manufacturer, setManufacturer] = useState(currentCase.manufacturer);
  const [mrp, setMrp] = useState(
    currentCase.declarations.find((d) => d.fieldId === 'f5' || d.label.includes('MRP'))?.detectedValue || '650.00'
  );
  const [netQuantity, setNetQuantity] = useState(
    currentCase.declarations.find((d) => d.fieldId === 'f4' || d.label.includes('Quantity'))?.detectedValue || '500 g'
  );
  const [batchNo, setBatchNo] = useState('BATCH-2026-X89');
  const [mfgDate, setMfgDate] = useState('08/2026');
  const [location, setLocation] = useState('New Delhi Central Depot, Zone-I');
  const [officerNotes, setOfficerNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedDeclarations = currentCase.declarations.map((d) => {
      if (d.fieldId === 'f5' || d.label.includes('MRP')) {
        return { ...d, detectedValue: `₹ ${mrp.replace(/[^0-9.]/g, '')}` };
      }
      if (d.fieldId === 'f4' || d.label.includes('Quantity')) {
        return { ...d, detectedValue: netQuantity };
      }
      if (d.fieldId === 'f7' || d.label.includes('Manufacture')) {
        return { ...d, detectedValue: mfgDate };
      }
      if (d.fieldId === 'f1' || d.label.includes('Manufacturer')) {
        return { ...d, detectedValue: manufacturer };
      }
      if (d.fieldId === 'f3' || d.label.includes('Name')) {
        return { ...d, detectedValue: productName };
      }
      return d;
    });

    if (mode === 'NEW') {
      const created = addNewCase({
        productName,
        category,
        manufacturer,
        declarations: updatedDeclarations,
      });
      showToast(
        'Packaged Product Registered',
        `New inspection case ${created.id} initialized for "${productName}".`,
        'success'
      );
    } else {
      updateCurrentCase({
        productName,
        category,
        manufacturer,
        declarations: updatedDeclarations,
      });
      showToast(
        'Product Details Updated',
        `Inspection case ${currentCase.id} updated with packaged commodity details.`,
        'success'
      );
    }

    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl border border-[#E6E4DF] max-w-2xl w-full shadow-2xl overflow-hidden my-6 text-[#111413]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-[#E6E4DF] flex items-center justify-between bg-[#FAF9F6]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#0F1F1E] text-[#22C2C2] flex items-center justify-center border border-[#1E3836] shrink-0">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#111413]">
                Packaged Commodity Details Intake
              </h2>
              <p className="text-[11px] text-[#727A78]">
                Statutory product registration pursuant to Legal Metrology Act, 2009
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#727A78] hover:text-[#111413] rounded-lg hover:bg-[#E6E4DF]/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Intake Form Mode Switcher */}
        <div className="px-5 pt-4 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMode('UPDATE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              mode === 'UPDATE'
                ? 'bg-[#0F1F1E] text-white shadow-xs'
                : 'bg-[#F4F3EE] text-[#727A78] hover:text-[#111413]'
            }`}
          >
            Update Current Docket ({currentCase.id})
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('NEW');
              setProductName('');
              setManufacturer('');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              mode === 'NEW'
                ? 'bg-[#22C2C2] text-[#0F1F1E] font-bold shadow-xs'
                : 'bg-[#F4F3EE] text-[#727A78] hover:text-[#111413]'
            }`}
          >
            + Register New Packaged Product
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Product Name */}
            <div className="sm:col-span-2 space-y-1">
              <label className="font-bold text-[#111413] flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-[#0E8A8A]" />
                <span>Product / Commodity Name *</span>
              </label>
              <input
                type="text"
                required
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="e.g. Royal Feast Roasted California Almonds"
                className="w-full px-3 py-2 border border-[#E6E4DF] rounded-lg outline-none focus:border-[#22C2C2] bg-[#F7F6F3] focus:bg-white text-xs text-[#111413]"
              />
            </div>

            {/* Category */}
            <div className="space-y-1">
              <label className="font-bold text-[#111413]">Commodity Classification *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-[#E6E4DF] rounded-lg outline-none focus:border-[#22C2C2] bg-[#F7F6F3] focus:bg-white text-xs text-[#111413]"
              >
                <option value="Packaged Food / Dry Fruits">Packaged Food / Dry Fruits</option>
                <option value="Edible Oils & Fats">Edible Oils & Fats</option>
                <option value="Baby Food & Infant Nutrition">Baby Food & Infant Nutrition</option>
                <option value="Cosmetics & Personal Care">Cosmetics & Personal Care</option>
                <option value="Cleaning Agents & Detergents">Cleaning Agents & Detergents</option>
                <option value="Electronics & Consumer Appliances">Electronics & Consumer Appliances</option>
                <option value="Other Packaged Commodity">Other Packaged Commodity</option>
              </select>
            </div>

            {/* Manufacturer Name */}
            <div className="space-y-1">
              <label className="font-bold text-[#111413] flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-[#0E8A8A]" />
                <span>Manufacturer / Packer / Importer *</span>
              </label>
              <input
                type="text"
                required
                value={manufacturer}
                onChange={(e) => setManufacturer(e.target.value)}
                placeholder="e.g. ABC Foods Pvt Ltd, New Delhi"
                className="w-full px-3 py-2 border border-[#E6E4DF] rounded-lg outline-none focus:border-[#22C2C2] bg-[#F7F6F3] focus:bg-white text-xs text-[#111413]"
              />
            </div>

            {/* Declared MRP */}
            <div className="space-y-1">
              <label className="font-bold text-[#111413]">Declared MRP (₹) *</label>
              <input
                type="text"
                required
                value={mrp}
                onChange={(e) => setMrp(e.target.value)}
                placeholder="e.g. 650.00"
                className="w-full px-3 py-2 border border-[#E6E4DF] rounded-lg outline-none focus:border-[#22C2C2] bg-[#F7F6F3] focus:bg-white text-xs font-mono text-[#111413]"
              />
            </div>

            {/* Net Quantity */}
            <div className="space-y-1">
              <label className="font-bold text-[#111413]">Declared Net Quantity / Weight *</label>
              <input
                type="text"
                required
                value={netQuantity}
                onChange={(e) => setNetQuantity(e.target.value)}
                placeholder="e.g. 500 g, 1 Litre, 250 ml"
                className="w-full px-3 py-2 border border-[#E6E4DF] rounded-lg outline-none focus:border-[#22C2C2] bg-[#F7F6F3] focus:bg-white text-xs font-mono text-[#111413]"
              />
            </div>

            {/* Batch / Lot No */}
            <div className="space-y-1">
              <label className="font-bold text-[#111413]">Batch / Lot Number</label>
              <input
                type="text"
                value={batchNo}
                onChange={(e) => setBatchNo(e.target.value)}
                placeholder="e.g. BATCH-2026-X89"
                className="w-full px-3 py-2 border border-[#E6E4DF] rounded-lg outline-none focus:border-[#22C2C2] bg-[#F7F6F3] focus:bg-white text-xs font-mono text-[#111413]"
              />
            </div>

            {/* Mfg Date */}
            <div className="space-y-1">
              <label className="font-bold text-[#111413] flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#0E8A8A]" />
                <span>Month & Year of Packaging</span>
              </label>
              <input
                type="text"
                value={mfgDate}
                onChange={(e) => setMfgDate(e.target.value)}
                placeholder="MM/YYYY (e.g. 08/2026)"
                className="w-full px-3 py-2 border border-[#E6E4DF] rounded-lg outline-none focus:border-[#22C2C2] bg-[#F7F6F3] focus:bg-white text-xs font-mono text-[#111413]"
              />
            </div>

            {/* Inspection Location */}
            <div className="sm:col-span-2 space-y-1">
              <label className="font-bold text-[#111413] flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#0E8A8A]" />
                <span>Inspection Depot / Retail Sampling Location</span>
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Central Depot, Okhla Phase-III, New Delhi"
                className="w-full px-3 py-2 border border-[#E6E4DF] rounded-lg outline-none focus:border-[#22C2C2] bg-[#F7F6F3] focus:bg-white text-xs text-[#111413]"
              />
            </div>

            {/* Officer Observation / Field Notes */}
            <div className="sm:col-span-2 space-y-1">
              <label className="font-bold text-[#111413] flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#0E8A8A]" />
                <span>Preliminary Officer Field Notes (Optional)</span>
              </label>
              <textarea
                rows={2}
                value={officerNotes}
                onChange={(e) => setOfficerNotes(e.target.value)}
                placeholder="e.g. Suspected dual MRP sticker violation, smudged declaration observed on secondary retail box."
                className="w-full px-3 py-2 border border-[#E6E4DF] rounded-lg outline-none focus:border-[#22C2C2] bg-[#F7F6F3] focus:bg-white text-xs text-[#111413]"
              />
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-3 border-t border-[#E6E4DF] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#F4F3EE] hover:bg-[#E6E4DF] text-[#3F4544] font-semibold rounded-lg text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#22C2C2] hover:bg-[#1EB0B0] text-[#0F1F1E] font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{mode === 'NEW' ? 'Register Packaged Product' : 'Save Commodity Details'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
