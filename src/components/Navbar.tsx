import React from 'react';
import { RefreshCw, Radio } from 'lucide-react';

interface NavbarProps {
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onRefresh, isRefreshing }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <div className="flex items-center gap-3.5">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-tight text-[#002244] text-base sm:text-xl">
                  TRANSJAKARTA
                </span>
              </div>
              <h1 className="text-xs sm:text-sm font-medium text-slate-500 m-0 p-0 leading-tight">
                Sistem Monitoring Armada
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
              <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-600" />
              <span>Live</span>
            </div>

            <button
              type="button"
              onClick={onRefresh}
              disabled={isRefreshing}
              title="Perbarui data"
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isRefreshing ? 'animate-spin' : ''}`}
              />
              <span className="hidden sm:inline">
                {isRefreshing ? 'Memperbarui...' : 'Refresh'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
