import React, { useState, useEffect } from 'react';
import { getStockSignal } from '../services/api';
import { LoadingSpinner, ErrorMessage } from './LoadingSpinner';
import { X, AlertCircle, Zap } from 'lucide-react';
import { getActionColor, formatUrgency } from '../utils/colors';

const DetailPanel = ({ stock, onClose }) => {
  const [signal, setSignal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSignal = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getStockSignal(stock);
        setSignal(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (stock) {
      fetchSignal();
    }
  }, [stock]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 max-w-2xl w-full">
          <LoadingSpinner message={`Analyzing ${stock}...`} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 max-w-2xl w-full">
          <ErrorMessage error={error} />
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 rounded-lg bg-slate-700 text-white hover:bg-slate-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-4xl mx-auto bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
          {/* Header */}
          <div className="relative bg-gradient-to-r from-slate-700 via-slate-800 to-slate-700 p-8 border-b border-slate-700">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-slate-700 transition-colors"
            >
              <X className="w-6 h-6 text-gray-400" />
            </button>

            <h2 className="text-3xl font-bold text-white mb-2">{signal.stock}</h2>
            <p className="text-gray-400 text-sm">{signal.signal_type}</p>
          </div>

          {/* Content */}
          <div className="p-8 space-y-6">
            {/* Action & Urgency */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-slate-700/30 border border-slate-700">
                <p className="text-xs text-gray-400 uppercase font-bold mb-2">Action</p>
                <p className={`text-2xl font-bold ${getActionColor(signal.action)}`}>
                  {signal.action}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-slate-700/30 border border-slate-700">
                <p className="text-xs text-gray-400 uppercase font-bold mb-2">Urgency</p>
                <p className="text-2xl font-bold text-white">
                  {formatUrgency(signal.urgency)}%
                </p>
              </div>
              <div className="p-4 rounded-lg bg-slate-700/30 border border-slate-700">
                <p className="text-xs text-gray-400 uppercase font-bold mb-2">Confidence</p>
                <p className="text-2xl font-bold text-white">
                  {signal.confidence}
                </p>
              </div>
            </div>

            {/* Explanation */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" />
                Explanation
              </h3>
              <div className="p-4 rounded-lg bg-slate-700/20 border border-amber-500/20">
                <p className="text-gray-200 leading-relaxed">
                  {signal.explanation}
                </p>
              </div>
            </div>

            {/* Insight */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-400" />
                Key Insight
              </h3>
              <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
                <p className="text-amber-100">
                  {signal.insight}
                </p>
              </div>
            </div>

            {/* Priority Reason */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Why This Signal Now?</h3>
              <p className="text-gray-300 leading-relaxed">
                {signal.priority_reason}
              </p>
            </div>

            {/* Market Context */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Market Context</h3>
              <p className="text-gray-300 leading-relaxed">
                {signal.market_context}
              </p>
            </div>

            {/* Reasoning */}
            {signal.reasoning && signal.reasoning.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Detailed Reasoning</h3>
                <div className="space-y-2">
                  {signal.reasoning.map((reason, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-slate-700/30 border border-slate-700 flex gap-3"
                    >
                      <span className="text-amber-400 font-bold flex-shrink-0">{idx + 1}.</span>
                      <p className="text-gray-300">{reason}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Data Status */}
            {signal.data_status !== 'ok' && (
              <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                <p className="text-yellow-200">
                  <span className="font-semibold">Data Status:</span> {signal.data_status}
                </p>
              </div>
            )}

            {/* Close Button */}
            <div className="pt-4 border-t border-slate-700">
              <button
                onClick={onClose}
                className="w-full px-4 py-3 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-semibold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailPanel;
