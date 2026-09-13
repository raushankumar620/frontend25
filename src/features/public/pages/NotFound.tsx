import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, Home as HomeIcon, LayoutDashboard } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { ROUTES } from '../../../utils/constants';
import { SEO } from '../../../seo';

export const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-white px-4 py-16 text-[#1F2A26]">
      <SEO page="notFound" />
      <div className="max-w-md w-full text-center space-y-6">
        
        {/* Visual Badge */}
        <div className="relative inline-block">
          <div className="w-24 h-24 rounded-3xl bg-[#E9F9EE] border border-[#C4EBD0] flex items-center justify-center text-[#05A222] mx-auto shadow-md">
            <Compass className="w-12 h-12 animate-pulse" />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-[#D64545] text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
            404 Error
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-black text-[#14201C] tracking-tight">
            Page Not Found
          </h1>
          <p className="text-xs sm:text-sm text-[#5F7069]">
            The page you are looking for might have been moved, renamed, or doesn't exist.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Button
            variant="primary"
            size="md"
            onClick={() => navigate(ROUTES.HOME)}
            leftIcon={<HomeIcon className="w-4 h-4" />}
            className="bg-[#05A222] hover:bg-[#006736] text-white font-bold"
          >
            Back to Home
          </Button>
          <Button
            variant="outline"
            size="md"
            onClick={() => navigate(ROUTES.DASHBOARD)}
            leftIcon={<LayoutDashboard className="w-4 h-4 text-[#05A222]" />}
            className="border-[#E2EAE6] text-[#14201C] hover:bg-[#F6FAF8] font-semibold"
          >
            Go to App Dashboard
          </Button>
        </div>

        <div className="pt-4 border-t border-[#E2EAE6]">
          <p className="text-xs text-[#5F7069]">
            Need assistance?{' '}
            <button
              onClick={() => navigate(ROUTES.PUBLIC_CONTACT)}
              className="text-[#05A222] font-bold hover:underline cursor-pointer"
            >
              Contact Support
            </button>
          </p>
        </div>

      </div>
    </div>
  );
};
