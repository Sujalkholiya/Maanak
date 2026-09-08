import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  Camera,
  CheckCircle2,
  AlertTriangle,
  X,
  ChevronRight,
  Eye,
  Sparkles,
  Info,
  RotateCcw,
} from 'lucide-react';
import { InspectionCase } from '../../types';
import { DemoBadge } from '../common/DemoBadge';

interface CaptureScreenProps {
  currentCase: InspectionCase;
  onProceedToAnalysis: () => void;
  onSelectSampleCase: (caseId: string) => void;
}

interface PhotoItem {
  id: string;
  url: string;
  angle: 'FRONT' | 'BACK' | 'SIDE' | 'BOTTOM';
  qualityScore: number;
  qualityLabel: string;
  scaleCalibrated: boolean;
  pixelScale: string;
  timestamp: string;
}

export const CaptureScreen: React.FC<CaptureScreenProps> = ({
  currentCase,
  onProceedToAnalysis,
  onSelectSampleCase,
}) => {
  const [photos, setPhotos] = useState<PhotoItem[]>([
    {
      id: 'photo-1',
      url: currentCase.image || 'https://images.unsplash.com/photo-1508061252445-5350f377c130?auto=format&fit=crop&w=1200&q=80',
      angle: 'BACK',
      qualityScore: 86,
      qualityLabel: 'Good',
      scaleCalibrated: true,
      pixelScale: '14.8 px/mm',
      timestamp: '11:42:04 IST',
    },
    {
      id: 'photo-2',
      url: 'https://images.unsplash.com/photo-1508061252445-5350f377c130?auto=format&fit=crop&w=1200&q=80',
      angle: 'FRONT',
      qualityScore: 92,
      qualityLabel: 'Optimal',
      scaleCalibrated: true,
      pixelScale: '14.8 px/mm',
      timestamp: '11:42:30 IST',
    },
  ]);

  const [previewPhoto, setPreviewPhoto] = useState<PhotoItem | null>(null);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAngleChange = (photoId: string, newAngle: 'FRONT' | 'BACK' | 'SIDE' | 'BOTTOM') => {
    setPhotos((prev) =>
      prev.map((p) => (p.id === photoId ? { ...p, angle: newAngle } : p))
    );
  };

  const handleRemovePhoto = (photoId: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== photoId));
  };

  const handleAddSimulatedPhoto = () => {
    const angles: ('FRONT' | 'BACK' | 'SIDE' | 'BOTTOM')[] = ['SIDE', 'BOTTOM'];
    const usedAngles = photos.map((p) => p.angle);
    const available = angles.find((a) => !usedAngles.includes(a)) || 'SIDE';
    const sampleUrls: Record<string, string> = {
      SIDE: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1200&q=80',
      BOTTOM: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=1200&q=80',
    };

    const newPhoto: PhotoItem = {
      id: `photo-${Date.now()}`,
      url: sampleUrls[available] || currentCase.image,
      angle: available,
      qualityScore: 88,
      qualityLabel: 'Good',
      scaleCalibrated: true,
      pixelScale: '14.8 px/mm',
      timestamp: new Date().toLocaleTimeString('en-IN', { hour12: false }),
    };
    setPhotos((prev) => [...prev, newPhoto]);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const newPhoto: PhotoItem = {
        id: `photo-${Date.now()}`,
        url: URL.createObjectURL(file),
        angle: 'SIDE',
        qualityScore: 90,
        qualityLabel: 'Good',
        scaleCalibrated: true,
        pixelScale: '14.8 px/mm',
        timestamp: new Date().toLocaleTimeString('en-IN', { hour12: false }),
      };
      setPhotos((prev) => [...prev, newPhoto]);
    }
  };

  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      {/* 1. COMPACT HEADER */}
      <div className="bg-white px-4 py-3 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">1. Evidence Capture</h2>
            <span className="text-[11px] text-slate-500 font-medium">
              ({photos.length} photos attached)
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Attach multi-angle photos of the package. Principal Display Panel (PDP) and mandatory declarations must be legible.
          </p>
        </div>

        {/* Sample Commodity Switcher */}
        <div className="flex items-center gap-2 text-xs shrink-0">
          <DemoBadge />
          <select
            value={currentCase.id}
            onChange={(e) => onSelectSampleCase(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 font-medium text-slate-700 text-xs focus:ring-1 focus:ring-blue-500 max-w-[200px] truncate"
          >
            <option value="CASE-2026-0841">Royal Feast Almonds (Dual MRP)</option>
            <option value="CASE-2026-0842">Himalayan Basmati Rice (Standard)</option>
            <option value="CASE-2026-0843">SunGlow Sunflower Oil (Missing USP)</option>
            <option value="CASE-2026-0844">Everfresh Baby Formula (Contrast)</option>
            <option value="CASE-2026-0845">Apex Cleaner (Institutional)</option>
          </select>
        </div>
      </div>

      {/* 2. CHAT-STYLE ATTACHMENT UPLOAD ZONE */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-4">
        {/* Drag-and-Drop / Action Area */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-200 hover:border-blue-400 bg-slate-50/60 hover:bg-blue-50/30 rounded-xl p-5 text-center transition-all cursor-pointer group"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-xs flex items-center justify-center text-blue-700 group-hover:scale-105 transition-transform">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800">
                Click to upload photos
              </span>
              <span className="text-xs text-slate-500"> or drag and drop package images</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <span>Supports JPEG, PNG, HEIC up to 25MB</span>
              <span>·</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddSimulatedPhoto();
                }}
                className="text-blue-600 hover:text-blue-800 font-semibold underline"
              >
                Simulate Camera Snapshot
              </button>
            </div>
          </div>
        </div>

        {/* 3. ATTACHMENT THUMBNAILS ROW */}
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center justify-between">
            <span>Attached Evidentiary Frames</span>
            <span className="text-slate-400 font-normal">Click thumbnail to inspect</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="relative bg-white rounded-lg border border-slate-200 overflow-hidden shadow-xs hover:border-slate-300 transition-all flex flex-col"
              >
                {/* Image Preview Container */}
                <div
                  onClick={() => setPreviewPhoto(photo)}
                  className="relative aspect-4/3 bg-slate-950 cursor-pointer overflow-hidden group"
                >
                  <img
                    src={photo.url}
                    alt={`${photo.angle} packaging frame`}
                    className="w-full h-full object-contain filter contrast-105 group-hover:scale-102 transition-transform duration-200"
                  />

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    <span>Preview</span>
                  </div>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemovePhoto(photo.id);
                    }}
                    className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-slate-900/80 hover:bg-rose-600 text-white flex items-center justify-center transition-colors cursor-pointer"
                    title="Remove photo"
                  >
                    <X className="w-3 h-3" />
                  </button>

                  {/* Quality & Scale Badges (Small inline pills in corner) */}
                  <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-between pointer-events-none">
                    <span className="bg-slate-900/85 text-emerald-400 text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded flex items-center gap-1 backdrop-blur-xs">
                      <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                      {photo.qualityScore}% Quality
                    </span>

                    <span className="bg-slate-900/85 text-slate-300 text-[10px] font-mono px-1.5 py-0.5 rounded backdrop-blur-xs">
                      {photo.scaleCalibrated ? '14.8 px/mm' : 'Uncalibrated'}
                    </span>
                  </div>
                </div>

                {/* Angle Selector Chip (Integrated into thumbnail footer) */}
                <div className="p-2 border-t border-slate-100 flex items-center justify-between bg-slate-50/50 text-xs">
                  <span className="text-[11px] font-semibold text-slate-500">Angle:</span>
                  <select
                    value={photo.angle}
                    onChange={(e) =>
                      handleAngleChange(photo.id, e.target.value as 'FRONT' | 'BACK' | 'SIDE' | 'BOTTOM')
                    }
                    className="font-bold text-slate-800 text-[11px] bg-white border border-slate-200 rounded px-1.5 py-0.5 focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="BACK">BACK (PDP)</option>
                    <option value="FRONT">FRONT</option>
                    <option value="SIDE">SIDE</option>
                    <option value="BOTTOM">BOTTOM</option>
                  </select>
                </div>
              </div>
            ))}

            {/* Quick Add Button if under 4 photos */}
            {photos.length < 4 && (
              <button
                type="button"
                onClick={handleAddSimulatedPhoto}
                className="aspect-4/3 rounded-lg border-2 border-dashed border-slate-200 hover:border-slate-300 hover:bg-slate-50 flex flex-col items-center justify-center text-slate-400 hover:text-slate-600 gap-1.5 transition-colors cursor-pointer"
              >
                <Camera className="w-5 h-5 text-slate-400" />
                <span className="text-xs font-semibold">+ Add Angle</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 4. SUMMARY ACTION BAR */}
      <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>
            {photos.some((p) => p.angle === 'BACK')
              ? 'Mandatory Principal Display Panel (BACK) attached and calibrated.'
              : 'Tip: Ensure Back panel is labeled as primary PDP.'}
          </span>
        </div>

        <button
          onClick={onProceedToAnalysis}
          disabled={photos.length === 0}
          className="px-5 py-2 bg-blue-700 hover:bg-blue-800 disabled:opacity-40 text-white font-bold rounded-lg shadow-xs flex items-center gap-1.5 text-xs transition-colors cursor-pointer"
        >
          <span>Proceed to Declaration Extraction</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* 5. ENLARGED PHOTO PREVIEW MODAL */}
      {previewPhoto && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setPreviewPhoto(null)}
        >
          <div
            className="bg-white rounded-2xl border border-slate-200 max-w-3xl w-full overflow-hidden shadow-2xl space-y-0"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-3.5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-bold text-slate-900">{previewPhoto.angle} Panel Frame</span>
                <span className="text-slate-400">·</span>
                <span className="font-mono text-slate-500">{previewPhoto.timestamp}</span>
              </div>
              <button
                onClick={() => setPreviewPhoto(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-slate-950 max-h-[60vh] flex items-center justify-center p-4">
              <img
                src={previewPhoto.url}
                alt="Enlarged evidentiary scan"
                className="max-h-[55vh] object-contain"
              />
            </div>

            <div className="p-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
              <div className="flex items-center gap-3 font-mono text-[11px]">
                <span>Quality: <strong className="text-emerald-700">{previewPhoto.qualityScore}% ({previewPhoto.qualityLabel})</strong></span>
                <span>·</span>
                <span>Scale: <strong className="text-slate-800">{previewPhoto.pixelScale}</strong></span>
              </div>
              <button
                onClick={() => setPreviewPhoto(null)}
                className="px-3 py-1 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded text-xs"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
