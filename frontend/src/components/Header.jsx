import React from 'react';
import { getTrendColor } from '../utils/colors';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const Header = ({ marketMood }) => {
  const getTrendIcon = () => {
    switch (marketMood?.trend) {
      case 'Bullish':
        return <TrendingUp className="w-5 h-5 text-green-500" />;
      case 'Bearish':
        return <TrendingDown className="w-5 h-5 text-red-500" />;
      default:
        return <Minus className="w-5 h-5 text-yellow-500" />;
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          {/* Left: Title */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white mb-1">
              AI Investor Copilot
            </h1>
            <p className="text-gray-400 text-sm">
              Turning Market Data into Decision Intelligence
            </p>
          </div>

          {/* Right: Market Mood Badge */}
          {marketMood && (
            <div className="flex items-center space-x-3 px-6 py-3 rounded-lg bg-slate-700/50 border border-slate-600/50">
              {getTrendIcon()}
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">
                  Market Trend
                </p>
                <p className={`text-lg font-bold ${getTrendColor(marketMood.trend)}`}>
                  {marketMood.trend}
                </p>
                <div className="mt-2 flex gap-3 text-xs">
                  <span className="text-gray-400">
                    Risk: <span className="text-amber-400">{marketMood.risk_level}</span>
                  </span>
                  <span className="text-gray-400">
                    Vol: <span className="text-amber-400">{marketMood.volatility}</span>
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
