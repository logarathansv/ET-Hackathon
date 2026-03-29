import React from 'react';

const formatErrorDetail = (error) => {
  const detail = error?.response?.data?.detail;
  if (typeof detail === 'string' && detail.trim()) {
    return detail;
  }

  if (Array.isArray(detail) && detail.length > 0) {
    const first = detail[0];
    if (typeof first === 'string') {
      return first;
    }
    if (first && typeof first === 'object') {
      const loc = Array.isArray(first.loc) ? first.loc.join('.') : '';
      const msg = typeof first.msg === 'string' ? first.msg : 'Validation error';
      return loc ? `${loc}: ${msg}` : msg;
    }
  }

  if (typeof error?.message === 'string' && error.message.trim()) {
    return error.message;
  }

  return 'Failed to fetch data';
};

const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative w-12 h-12 mb-4">
        <div className="absolute inset-0 border-4 border-slate-700 rounded-full" />
        <div className="absolute inset-0 border-4 border-transparent border-t-amber-500 border-r-amber-500 rounded-full animate-spin" />
      </div>
      <p className="text-gray-400 text-sm font-medium">{message}</p>
    </div>
  );
};

const ErrorMessage = ({ error, onRetry }) => {
  const message = formatErrorDetail(error);

  return (
    <div className="p-6 rounded-lg bg-red-500/10 border border-red-500/30">
      <div className="flex items-start gap-4">
        <div className="text-2xl">⚠️</div>
        <div className="flex-1">
          <h3 className="text-red-400 font-semibold mb-2">Error Loading Data</h3>
          <p className="text-red-300 text-sm mb-4">
            {message}
          </p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-4 py-2 rounded-lg bg-red-500/20 border border-red-500/50 text-red-400 hover:bg-red-500/30 transition-colors"
            >
              Retry
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export { LoadingSpinner, ErrorMessage };
