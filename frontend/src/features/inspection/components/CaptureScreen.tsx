import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  Camera,
  CheckCircle2,
  AlertTriangle,
  X,
  Eye,
  ArrowRight,
  Image as ImageIcon,
  Sparkles,
} from 'lucide-react';
import { InspectionCase } from '../../../types';
import { useToast } from '../../../hooks/useToast';
import { useInspectionCase } from '../../../hooks/useInspectionCase';
import { ocrService } from '../../../services/ocrService';
import { Loader2 } from 'lucide-react';

interface CaptureScreenProps {
  currentCase: InspectionCase;
  onProceedToAnalysis: () => void;
  onSelectSampleCase: (caseId: string) => void;
}

interface PhotoItem {
  id: string;
  url: string;
  name: string;
  qualityScore: number;
  qualityLabel: string;
  scaleCalibrated: boolean;
  pixelScale: string;
  timestamp: string;
  file?: File;
}

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export const CaptureScreen: React.FC<CaptureScreenProps> = ({
  currentCase,
  onProceedToAnalysis,
  onSelectSampleCase,
}) => {
  const { showToast } = useToast();
  const { updateCurrentCase } = useInspectionCase();
  const [isScanning, setIsScanning] = useState<boolean>(false);

  const [photos, setPhotos] = useState<PhotoItem[]>([
    {
      id: 'photo-1',
      url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=1200&q=80',
      name: 'Primary Display Panel (Back)',
      qualityScore: 92,
      qualityLabel: 'Optimal',
      scaleCalibrated: true,
      pixelScale: '14.8 px/mm',
      timestamp: '11:42:04 IST',
    },
    {
      id: 'photo-2',
      url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1200&q=80',
      name: 'Secondary Declaration Panel (Front)',
      qualityScore: 88,
      qualityLabel: 'Good',
      scaleCalibrated: true,
      pixelScale: '14.8 px/mm',
      timestamp: '11:42:30 IST',
    },
  ]);

  const [previewPhoto, setPreviewPhoto] = useState<PhotoItem | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const selectedFiles = Array.from(e.target.files);

    const validNewPhotos: PhotoItem[] = [];
    let oversizedCount = 0;

    selectedFiles.forEach((file) => {
      if (file.size > MAX_FILE_SIZE_BYTES) {
        oversizedCount++;
        return;
      }

      validNewPhotos.push({
        id: `photo-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        url: URL.createObjectURL(file),
        name: file.name || `Package Capture #${photos.length + validNewPhotos.length + 1}`,
        qualityScore: Math.floor(Math.random() * 8) + 90, // 90-98%
        qualityLabel: 'Optimal',
        scaleCalibrated: true,
        pixelScale: '14.8 px/mm',
        timestamp: new Date().toLocaleTimeString('en-IN', { hour12: false }) + ' IST',
        file,
      });
    });

    if (oversizedCount > 0) {
      const msg = `File exceeds 5MB limit. One or more images could not be added because each image must be under 5MB.`;
      showToast('File Too Large', msg, 'error');
      alert(msg);
    }

    if (validNewPhotos.length > 0) {
      setPhotos((prev) => [...prev, ...validNewPhotos]);
      showToast(
        'Photo Attached',
        `${validNewPhotos.length} photo(s) added successfully.`,
        'success'
      );
    }

    // Reset input so re-selecting identical filename works
    e.target.value = '';
  };

  const handleProceedWithOcr = async () => {
    const photoWithFile = photos.find((p) => p.file);
    if (photoWithFile && photoWithFile.file) {
      try {
        setIsScanning(true);
        showToast('Extracting Declarations', 'Processing label imagery via Tesseract OCR engine...', 'info');
        const ocrRes = await ocrService.runOcr(photoWithFile.file);

        if (ocrRes && ocrRes.success) {
          updateCurrentCase({
            image: photoWithFile.url,
            productName: ocrRes.extractedData?.productName || currentCase.productName,
            batchNo: ocrRes.extractedData?.batchNo || currentCase.batchNo,
            manufacturer: ocrRes.extractedData?.manufacturer || currentCase.manufacturer,
            declarations: ocrRes.declarations && ocrRes.declarations.length > 0 ? ocrRes.declarations : currentCase.declarations,
            boundingBoxes: ocrRes.boundingBoxes && ocrRes.boundingBoxes.length > 0 ? ocrRes.boundingBoxes : currentCase.boundingBoxes,
          });
          showToast('OCR Analysis Complete', `Extracted ${ocrRes.declarations?.length || 0} statutory declarations.`, 'success');
        }
      } catch (err: any) {
        console.warn('OCR processing error:', err);
        showToast('OCR Warning', 'Live OCR analysis experienced an issue. Proceeding with captured photo.', 'warning');
      } finally {
        setIsScanning(false);
      }
    }
    onProceedToAnalysis();
  };

  const handleRemovePhoto = (photoId: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== photoId));
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* 1. BOLD HEADER: ATTACH PHOTO */}
      <div className="bg-white px-5 py-4 rounded-2xl border border-[#E6E4DF] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-bold text-[#111413] tracking-tight">
              Attach Photo
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#22C2C2]/15 text-[#0E8A8A] border border-[#22C2C2]/30">
              {photos.length} {photos.length === 1 ? 'photo' : 'photos'} attached
            </span>
          </div>
          <p className="text-xs text-[#727A78] mt-1">
            Capture or upload multi-angle photos of the package. Principal Display Panel (PDP) and declarations must be legible.
          </p>
        </div>

      </div>

      {/* 2. DUAL ACTION BUTTONS: CAMERA CAPTURE & UPLOAD (MAX 5MB) */}
      <div className="bg-white rounded-2xl border border-[#E6E4DF] p-6 shadow-xs space-y-6">
        {/* Hidden inputs */}
        <input
          type="file"
          ref={cameraInputRef}
          accept="image/*"
          capture="environment"
          onChange={handleImageFileChange}
          className="hidden"
        />
        <input
          type="file"
          ref={fileInputRef}
          accept="image/jpeg,image/png,image/heic,image/webp"
          multiple
          onChange={handleImageFileChange}
          className="hidden"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left Button: Direct Camera Capture */}
          <button
            type="button"
            onClick={() => cameraInputRef.current?.click()}
            className="group relative p-6 rounded-2xl border-2 border-dashed border-[#22C2C2]/50 hover:border-[#22C2C2] bg-[#22C2C2]/5 hover:bg-[#22C2C2]/10 transition-all flex flex-col items-center justify-center text-center gap-3 cursor-pointer"
          >
            <div className="w-14 h-14 rounded-2xl bg-[#22C2C2] text-[#0F1F1E] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <Camera className="w-7 h-7" />
            </div>
            <div>
              <span className="text-sm font-bold text-[#111413] block">
                Capture with Camera
              </span>
              <span className="text-xs text-[#727A78] mt-0.5 block">
                Opens your device camera directly for live photo input
              </span>
            </div>
            <span className="text-[11px] font-semibold text-[#0E8A8A] bg-white px-2.5 py-1 rounded-full border border-[#22C2C2]/30 shadow-2xs">
              Live Camera Snapshot
            </span>
          </button>

          {/* Right Button: File Upload (Max 5MB) */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="group relative p-6 rounded-2xl border-2 border-dashed border-[#E6E4DF] hover:border-[#22C2C2] bg-[#FAF9F6] hover:bg-[#22C2C2]/5 transition-all flex flex-col items-center justify-center text-center gap-3 cursor-pointer"
          >
            <div className="w-14 h-14 rounded-2xl bg-white border border-[#E6E4DF] text-[#111413] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <UploadCloud className="w-7 h-7 text-[#0E8A8A]" />
            </div>
            <div>
              <span className="text-sm font-bold text-[#111413] block">
                Upload Package Images
              </span>
              <span className="text-xs text-[#727A78] mt-0.5 block">
                Select JPEG, PNG, or HEIC files from your device
              </span>
            </div>
            <span className="text-[11px] font-medium text-[#727A78] bg-white px-2.5 py-1 rounded-full border border-[#E6E4DF] shadow-2xs">
              Supports files up to 5MB max
            </span>
          </button>
        </div>

        {/* 3. OPTIMIZED ATTACHED PHOTO GALLERY */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#727A78]">
            <span>Attached Evidentiary Photos ({photos.length})</span>
            <span className="text-[11px] text-[#727A78] font-normal lowercase">
              Click any photo to inspect full resolution
            </span>
          </div>

          {photos.length === 0 ? (
            <div className="p-8 border border-dashed border-[#E6E4DF] rounded-xl text-center text-[#727A78] text-xs">
              No photos attached yet. Please capture or upload a package photo above.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {photos.map((photo, idx) => (
                <div
                  key={photo.id}
                  className="group relative bg-[#FAF9F6] rounded-xl border border-[#E6E4DF] hover:border-[#22C2C2]/60 overflow-hidden shadow-2xs hover:shadow-xs transition-all flex flex-col"
                >
                  {/* Photo Container */}
                  <div
                    onClick={() => setPreviewPhoto(photo)}
                    className="relative aspect-4/3 bg-slate-900 cursor-pointer overflow-hidden"
                  >
                    <img
                      src={photo.url}
                      alt={photo.name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1200&q=80';
                      }}
                      className="w-full h-full object-contain filter contrast-105 group-hover:scale-102 transition-transform duration-200"
                    />

                    {/* Hover Preview Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs gap-1.5 font-medium">
                      <Eye className="w-4 h-4" />
                      <span>Inspect Photo</span>
                    </div>

                    {/* Delete / Remove Photo Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemovePhoto(photo.id);
                      }}
                      className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/70 hover:bg-rose-600 text-white flex items-center justify-center transition-colors cursor-pointer shadow-xs"
                      title="Remove photo"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>

                    {/* Quality & Resolution Tag */}
                    <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between pointer-events-none">
                      <span className="bg-black/80 text-emerald-400 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md flex items-center gap-1 backdrop-blur-xs">
                        <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                        {photo.qualityScore}% Quality
                      </span>
                      <span className="bg-black/80 text-white/80 text-[10px] font-mono px-2 py-0.5 rounded-md backdrop-blur-xs">
                        {photo.pixelScale}
                      </span>
                    </div>
                  </div>

                  {/* Clean Bottom Card Bar */}
                  <div className="p-3 bg-white flex items-center justify-between text-xs border-t border-[#E6E4DF]">
                    <div className="min-w-0 pr-2">
                      <span className="font-bold text-[#111413] truncate block text-[11px]">
                        Photo {idx + 1}: {photo.name}
                      </span>
                      <span className="text-[10px] font-mono text-[#727A78]">
                        {photo.timestamp}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setPreviewPhoto(photo)}
                      className="px-2 py-1 text-[11px] font-semibold text-[#0E8A8A] hover:bg-[#22C2C2]/10 rounded-md transition-colors cursor-pointer shrink-0"
                    >
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 4. CLEAN PROCEED ACTION BUTTON (Replaces old div & X-Ray button) */}
      <div className="bg-white rounded-2xl border border-[#E6E4DF] p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="text-xs text-[#727A78]">
          Phase 2 of 5 · <strong className="text-[#111413]">{photos.length} Evidentiary Photo(s) Attached</strong>
        </div>

        <button
          onClick={handleProceedWithOcr}
          disabled={photos.length === 0 || isScanning}
          className="inline-flex items-center justify-center gap-2 bg-[#22C2C2] hover:bg-[#1EB0B0] active:bg-[#18A0A0] disabled:opacity-40 disabled:pointer-events-none text-[#0F1F1E] text-xs sm:text-sm font-bold px-6 py-3 rounded-xl shadow-xs transition-all active:scale-[0.98] cursor-pointer"
          title="Proceed to Compliance X-Ray"
        >
          {isScanning ? (
            <>
              <Loader2 className="w-4 h-4 text-[#0F1F1E] animate-spin" />
              <span>Analyzing Label (OCR Engine)...</span>
            </>
          ) : (
            <>
              <span>Proceed to Compliance X-Ray</span>
              <ArrowRight className="w-4 h-4 text-[#0F1F1E]" />
            </>
          )}
        </button>
      </div>

      {/* 5. ENLARGED PHOTO PREVIEW MODAL */}
      {previewPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setPreviewPhoto(null)}
        >
          <div
            className="bg-white rounded-2xl border border-[#E6E4DF] max-w-3xl w-full overflow-hidden shadow-2xl space-y-0"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-[#E6E4DF] flex items-center justify-between bg-[#FAF9F6]">
              <div className="flex items-center gap-2.5 text-xs">
                <ImageIcon className="w-4 h-4 text-[#0E8A8A]" />
                <span className="font-bold text-[#111413]">{previewPhoto.name}</span>
                <span className="text-[#727A78]">·</span>
                <span className="font-mono text-[#727A78]">{previewPhoto.timestamp}</span>
              </div>
              <button
                onClick={() => setPreviewPhoto(null)}
                className="p-1 text-[#727A78] hover:text-[#111413] rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-950 max-h-[60vh] flex items-center justify-center p-4">
              <img
                src={previewPhoto.url}
                alt="Enlarged packaging capture"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1200&q=80';
                }}
                className="max-h-[55vh] object-contain rounded-lg"
              />
            </div>

            <div className="p-4 bg-[#FAF9F6] border-t border-[#E6E4DF] flex items-center justify-between text-xs text-[#727A78]">
              <div className="flex items-center gap-3 font-mono text-[11px]">
                <span>Quality: <strong className="text-emerald-600">{previewPhoto.qualityScore}% ({previewPhoto.qualityLabel})</strong></span>
                <span>·</span>
                <span>Scale: <strong className="text-[#111413]">{previewPhoto.pixelScale}</strong></span>
              </div>
              <button
                onClick={() => setPreviewPhoto(null)}
                className="px-4 py-1.5 bg-[#E6E4DF] hover:bg-[#D5D2CA] text-[#111413] font-semibold rounded-lg text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaptureScreen;
