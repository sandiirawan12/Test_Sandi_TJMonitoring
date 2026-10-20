import React from 'react';

interface LoadingSkeletonProps {
  count?: number;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ count = 5 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs animate-pulse flex flex-col justify-between h-[230px]"
        >
          <div>
            <div className="flex items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-slate-200" />
                <div>
                  <div className="h-5 w-24 bg-slate-200 rounded-md mb-1.5" />
                  <div className="h-3 w-16 bg-slate-100 rounded-md" />
                </div>
              </div>
              <div className="h-6 w-20 bg-slate-200 rounded-full" />
            </div>

            <div className="h-4 w-3/4 bg-slate-100 rounded-md mb-4" />

            <div className="space-y-2 mb-3">
              <div className="h-3.5 w-full bg-slate-100 rounded-md" />
              <div className="h-3.5 w-2/3 bg-slate-100 rounded-md" />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <div className="h-3 w-28 bg-slate-100 rounded-md" />
            <div className="h-7 w-20 bg-slate-200 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
};
