import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <div className="bg-rose-50/90 border border-rose-200 rounded-2xl p-6 text-center max-w-xl mx-auto my-8 shadow-xs">
      <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-3">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-rose-900 mb-1">
        Gagal Memuat Data
      </h3>
      <p className="text-sm text-rose-700 mb-5 leading-relaxed">
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white text-sm font-medium rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          Coba Lagi
        </button>
      )}
    </div>
  );
};
