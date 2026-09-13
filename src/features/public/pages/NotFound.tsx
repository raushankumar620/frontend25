import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../utils/constants';
import { SEO } from '../../../seo';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white p-4">
      <SEO page="notFound" />
      <div className="flex flex-col items-center justify-center text-center max-w-4xl w-full">
        <Link to={ROUTES.HOME} className="inline-block transition-transform hover:scale-[1.01] duration-200">
          <img
            src="/404_page.png"
            alt="404 Page Not Found"
            className="w-full max-w-3xl h-auto object-contain mx-auto drop-shadow-sm"
          />
        </Link>
      </div>
    </div>
  );
};
