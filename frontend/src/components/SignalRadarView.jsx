import React, { useEffect, useRef, useState } from 'react';
import { getRadar } from '../services/api';
import { LoadingSpinner, ErrorMessage } from './LoadingSpinner';
import { Zap, TrendingUp, TrendingDown } from 'lucide-react';

const SignalRadarView = () => {
  const [signals, setSignals] = useState([]);
  const [marketMood, setMarketMood] = useState('Sideways');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const hasSuccessfulLoadRef = useRef(false);

  const confidenceToPercent = (confidence) => {
    if (typeof confidence === 'number') {
      return Math.max(0, Math.min(100, Math.round(confidence * 100)));
    }
    if (confidence === 'High') return 85;
    if (confidence === 'Medium') return 60;
    return 35;
  };

  useEffect(() => {
    const controller = new AbortController();
    let isActive = true;

    const fetchSignals = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getRadar(5, { signal: controller.signal });
        if (!isActive) {
          return;
        }

        hasSuccessfulLoadRef.current = true;
        setSignals(data.top_signals || []);
        setMarketMood(data.market_mood?.trend || 'Sideways');
      } catch (err) {
        if (!isActive || err?.code === 'ERR_CANCELED') {
          return;
        }

        const isTimeout = err?.code === 'ECONNABORTED' || String(err?.message || '').toLowerCase().includes('timeout');
        if (isTimeout && hasSuccessfulLoadRef.current) {
          // Keep existing data visible if a follow-up request times out.
          return;
        }

        setError(err);
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    fetchSignals();

    return () => {
      isActive = false;
      controller.abort();
    };
  }, []);

  if (loading) {
    return <LoadingSpinner message="Loading signal radar..." />;
  }

  if (error) {
    return <ErrorMessage error={error} />;
  }

  return (
    <div className="space-y-6">
      {/* Market Mood Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
          <p className="text-sm text-gray-400 uppercase font-semibold mb-2">Market Mood</p>
          <p className="text-2xl font-bold text-blue-400">
            {marketMood}
          </p>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-6">
          <p className="text-sm text-gray-400 uppercase font-semibold mb-2">Volatility</p>
          <p className="text-2xl font-bold text-amber-400">
            N/A
          </p>
        </div>
        <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-6">
          <p className="text-sm text-gray-400 uppercase font-semibold mb-2">Total Signals</p>
          <p className="text-2xl font-bold text-purple-400">
            {signals.length}
          </p>
        </div>
      </div>

      {/* Signals Grid */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Top Trading Signals</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {signals.map((signal, idx) => {
            const isBullish = signal.action === 'Consider Entry' || signal.signal_type !== 'Risk Signal';
            const icon = isBullish ? TrendingUp : TrendingDown;
            const Icon = icon;
            const color = isBullish
              ? 'from-green-500/20 to-green-500/5 border-green-500/30'
              : 'from-red-500/20 to-red-500/5 border-red-500/30';
            const textColor = isBullish ? 'text-green-400' : 'text-red-400';
            const confidencePct = confidenceToPercent(signal.confidence);

            return (
              <div
                key={idx}
                className={`bg-gradient-to-br ${color} border rounded-xl p-5 hover:shadow-lg transition-all hover:border-opacity-50 cursor-pointer group`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
                      {signal.stock}
                    </h3>
                    <p className={`text-sm font-semibold ${textColor}`}>
                      {signal.signal_type}
                    </p>
                  </div>
                  <Icon className={`w-6 h-6 ${textColor}`} />
                </div>

                {/* Signal Details */}
                <div className="space-y-2 mb-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Confidence</span>
                    <span className={`font-semibold ${textColor}`}>
                      {typeof signal.confidence === 'string' ? signal.confidence : `${confidencePct}%`}
                    </span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full ${isBullish ? 'bg-green-500' : 'bg-red-500'} transition-all`}
                      style={{ width: `${confidencePct}%` }}
                    />
                  </div>
                </div>

                {/* Signal Details */}
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-slate-700/30 rounded p-2">
                    <p className="text-gray-400 text-xs mb-1">Action</p>
                    <p className={`font-bold ${textColor}`}>{signal.action}</p>
                  </div>
                  <div className="bg-slate-700/30 rounded p-2">
                    <p className="text-gray-400 text-xs mb-1">Urgency</p>
                    <p className="text-white font-bold">{signal.urgency?.toFixed?.(1) ?? signal.urgency ?? 'N/A'}</p>
                  </div>
                </div>

                {/* Signal Reason */}
                {signal.explanation && (
                  <div className="mt-3 pt-3 border-t border-slate-700 text-xs text-gray-400">
                    <p className="line-clamp-2">{signal.explanation}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Empty State */}
      {signals.length === 0 && (
        <div className="text-center py-12 bg-slate-800/50 border border-slate-700 rounded-xl">
          <Zap className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">No signals detected at this time</p>
        </div>
      )}
    </div>
  );
};

export default SignalRadarView;
