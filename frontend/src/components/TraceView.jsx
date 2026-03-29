import React, { useState, useEffect } from 'react';
import { getTrace } from '../services/api';
import { LoadingSpinner, ErrorMessage } from './LoadingSpinner';
import { ChevronRight, Zap } from 'lucide-react';

const TraceView = ({ stock }) => {
  const [trace, setTrace] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrace = async () => {
      if (!stock) return;
      try {
        setLoading(true);
        setError(null);
        const data = await getTrace(stock);
        setTrace(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrace();
  }, [stock]);

  if (!stock) {
    return (
      <div className="p-8 rounded-xl bg-slate-800 border border-slate-700 text-center">
        <p className="text-gray-400">Select a signal to view trace</p>
      </div>
    );
  }

  if (loading) {
    return <LoadingSpinner message={`Loading trace for ${stock}...`} />;
  }

  if (error) {
    return <ErrorMessage error={error} />;
  }

  if (!trace || !trace.logic_flow || trace.logic_flow.length === 0) {
    return (
      <div className="p-8 rounded-xl bg-slate-800 border border-slate-700 text-center">
        <p className="text-gray-400">No trace data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Signal Type Header */}
      <div className="flex items-center gap-4 p-6 rounded-xl bg-amber-500/10 border border-amber-500/30">
        <Zap className="w-8 h-8 text-amber-400 flex-shrink-0" />
        <div>
          <p className="text-sm text-gray-400 uppercase font-semibold">Detected Signal</p>
          <h3 className="text-2xl font-bold text-amber-400">{trace.signal}</h3>
        </div>
      </div>

      {/* Logic Flow - Timeline Style */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-white mb-4">Detection Logic</h3>
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-500/50 via-blue-500/30 to-transparent" />

          {/* Timeline Items */}
          <div className="space-y-4">
            {trace.logic_flow.map((step, idx) => (
              <div key={idx} className="relative pl-20">
                {/* Timeline Dot */}
                <div className="absolute left-0 top-0 w-14 h-14 flex items-center justify-center">
                  <div className="absolute w-4 h-4 rounded-full bg-slate-900 border-2 border-amber-500" />
                </div>

                {/* Content Card */}
                <div className="bg-slate-700/30 border border-slate-700 rounded-lg p-4 hover:border-amber-500/50 transition-colors group">
                  <div className="flex items-start gap-3">
                    <ChevronRight className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5 group-hover:translate-x-1 transition-transform" />
                    <div className="flex-1">
                      <p className="text-gray-300 leading-relaxed">
                        {step}
                      </p>
                      {idx < trace.logic_flow.length - 1 && (
                        <p className="text-xs text-gray-500 mt-2">↓</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="p-6 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30">
        <p className="text-sm text-gray-400 uppercase font-semibold mb-2">Conclusion</p>
        <p className="text-white leading-relaxed">
          Signal detected: <span className="font-bold text-amber-400">{trace.signal}</span>
        </p>
      </div>
    </div>
  );
};

export default TraceView;
