import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Home } from 'lucide-react';
import { ROUTES } from '../app/router/routes';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-[#C1443A]/10 text-[#C1443A] flex items-center justify-center">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h2 className="text-2xl font-black text-[#111413]">Page Not Found</h2>
      <p className="text-xs sm:text-sm text-[#727A78] max-w-md">
        The requested statutory workspace or inspection docket could not be located in this registry.
      </p>
      <button
        onClick={() => navigate(ROUTES.DASHBOARD)}
        className="px-4 py-2.5 bg-[#22C2C2] hover:bg-[#1EB0B0] text-[#0F1F1E] font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 transition-all cursor-pointer"
      >
        <Home className="w-4 h-4" />
        <span>Return to Executive Dashboard</span>
      </button>
    </div>
  );
};

export default NotFoundPage;
