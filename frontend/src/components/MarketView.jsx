import React, { useState, useEffect } from 'react';
import { getMarketMood } from '../services/api';
import { LoadingSpinner, ErrorMessage } from './LoadingSpinner';
import { BarChart3, AlertTriangle, TrendingUp } from 'lucide-react';

const MarketView = () => {
  const [market, setMarket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMarket = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getMarketMood();
        setMarket(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMarket();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Loading market data..." />;
  }

  if (error) {
    return <ErrorMessage error={error} />;
  }

  if (!market) {
    return (
      <div className="p-8 rounded-xl bg-slate-800 border border-slate-700 text-center">
        <p className="text-gray-400">No market data available</p>
      </div>
    );
  }

  const getMoodColor = (mood) => {
    const lower = mood?.toLowerCase() || '';
    if (lower.includes('bullish') || lower.includes('optimistic')) {
      return 'text-green-400 bg-green-500/10 border-green-500/30';
    }
    if (lower.includes('bearish') || lower.includes('pessimistic')) {
      return 'text-red-400 bg-red-500/10 border-red-500/30';
    }
    return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
  };

  const getRiskColor = (risk) => {
    const lower = risk?.toLowerCase() || '';
    if (lower.includes('high')) {
      return 'text-red-400 bg-red-500/10 border-red-500/30';
    }
    if (lower.includes('low')) {
      return 'text-green-400 bg-green-500/10 border-green-500/30';
    }
    return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
  };

  return (
    <div className="space-y-6">
      {/* Main Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Market Mood Card */}
        <div className={`rounded-xl p-6 border ${getMoodColor(market.mood)}`}>
          <p className="text-sm text-gray-400 uppercase font-semibold mb-2">Market Mood</p>
          <h3 className="text-2xl font-bold mb-2">{market.mood}</h3>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div
              className={`h-full rounded-full ${
                market.mood?.toLowerCase().includes('bullish')
                  ? 'bg-green-500'
                  : market.mood?.toLowerCase().includes('bearish')
                  ? 'bg-red-500'
                  : 'bg-amber-500'
              }`}
              style={{ width: `${(market.sentiment_score || 0.5) * 100}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Sentiment: {((market.sentiment_score || 0.5) * 100).toFixed(1)}%
          </p>
        </div>

        {/* Risk Level Card */}
        <div className={`rounded-xl p-6 border ${getRiskColor(market.risk)}`}>
          <p className="text-sm text-gray-400 uppercase font-semibold mb-2">Risk Level</p>
          <h3 className="text-2xl font-bold mb-2">{market.risk}</h3>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div
              className={`h-full rounded-full ${
                market.risk?.toLowerCase().includes('high')
                  ? 'bg-red-500'
                  : market.risk?.toLowerCase().includes('low')
                  ? 'bg-green-500'
                  : 'bg-amber-500'
              }`}
              style={{
                width: `${
                  market.risk?.toLowerCase().includes('high')
                    ? 80
                    : market.risk?.toLowerCase().includes('low')
                    ? 30
                    : 50
                }%`,
              }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-2">
            VIX: {market.vix || 'N/A'}
          </p>
        </div>

        {/* Volatility Card */}
        <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-6">
          <p className="text-sm text-gray-400 uppercase font-semibold mb-2">Volatility</p>
          <h3 className="text-2xl font-bold text-purple-400 mb-2">
            {market.volatility || 'Moderate'}
          </h3>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div
              className="h-full rounded-full bg-purple-500"
              style={{ width: `${(market.volatility_score || 0.5) * 100}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Score: {((market.volatility_score || 0.5) * 100).toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Market Indicators */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-400" />
          Market Indicators
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {market.indicators && Object.entries(market.indicators).map(([key, value]) => (
            <div key={key} className="bg-slate-700/30 border border-slate-700 rounded-lg p-4">
              <p className="text-xs text-gray-400 uppercase font-semibold mb-2">
                {key.replace(/_/g, ' ')}
              </p>
              <p className="text-lg font-bold text-white">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Market Summary */}
      {market.summary && (
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            Market Summary
          </h3>
          <p className="text-gray-300 leading-relaxed">
            {market.summary}
          </p>
        </div>
      )}

      {/* Risk Warning */}
      {market.risk?.toLowerCase().includes('high') && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 flex items-start gap-4">
          <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-red-400 mb-2">High Risk Alert</h4>
            <p className="text-gray-300">
              Market volatility is elevated. Consider reducing risk exposure and diversifying your portfolio.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketView;
