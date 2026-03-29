import React, { useState } from 'react';
import { simulate } from '../services/api';
import { LoadingSpinner, ErrorMessage } from './LoadingSpinner';
import { Play, BarChart2 } from 'lucide-react';

const SimulateView = () => {
  const [scenario, setScenario] = useState('bull_market');
  const [portfolio, setPortfolio] = useState([
    { symbol: 'AAPL', quantity: 10, weight: 30 },
    { symbol: 'GOOGL', quantity: 5, weight: 25 },
    { symbol: 'MSFT', quantity: 8, weight: 25 },
    { symbol: 'TSLA', quantity: 3, weight: 20 },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const scenarios = [
    { value: 'bull_market', label: '📈 Bull Market', description: 'Strong economic growth and rising assets' },
    { value: 'bear_market', label: '📉 Bear Market', description: 'Economic slowdown and declining assets' },
    { value: 'recession', label: '💼 Recession', description: 'Severe economic contraction' },
    { value: 'high_inflation', label: '🔥 High Inflation', description: 'Significant price increases' },
    { value: 'rate_hike', label: '📊 Rate Hike', description: 'Central bank raises interest rates' },
    { value: 'tech_crash', label: '⚡ Tech Crash', description: 'Technology sector decline' },
  ];

  const handlePortfolioChange = (index, field, value) => {
    const newPortfolio = [...portfolio];
    newPortfolio[index] = { ...newPortfolio[index], [field]: value };
    setPortfolio(newPortfolio);
  };

  const handleSimulate = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await simulate(scenario, portfolio);
      setResult(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const totalInvestment = portfolio.reduce((sum, item) => sum + (item.quantity * 100), 0);

  return (
    <div className="space-y-6">
      {/* Scenario Selection */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Market Scenario</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {scenarios.map((s) => (
            <button
              key={s.value}
              onClick={() => setScenario(s.value)}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                scenario === s.value
                  ? 'border-amber-500 bg-amber-500/10'
                  : 'border-slate-700 bg-slate-700/30 hover:border-slate-600'
              }`}
            >
              <p className="font-semibold text-white">{s.label}</p>
              <p className="text-xs text-gray-400 mt-1">{s.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Portfolio Editor */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Portfolio</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-2 px-3 text-gray-400 font-semibold">Symbol</th>
                <th className="text-left py-2 px-3 text-gray-400 font-semibold">Quantity</th>
                <th className="text-left py-2 px-3 text-gray-400 font-semibold">Value</th>
                <th className="text-left py-2 px-3 text-gray-400 font-semibold">Weight</th>
              </tr>
            </thead>
            <tbody>
              {portfolio.map((item, idx) => (
                <tr key={idx} className="border-b border-slate-700 hover:bg-slate-700/20">
                  <td className="py-3 px-3">
                    <input
                      type="text"
                      value={item.symbol}
                      onChange={(e) => handlePortfolioChange(idx, 'symbol', e.target.value)}
                      className="w-20 px-2 py-1 bg-slate-700 border border-slate-600 rounded text-white text-sm"
                    />
                  </td>
                  <td className="py-3 px-3">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handlePortfolioChange(idx, 'quantity', parseInt(e.target.value))}
                      className="w-20 px-2 py-1 bg-slate-700 border border-slate-600 rounded text-white text-sm"
                    />
                  </td>
                  <td className="py-3 px-3 text-white font-semibold">
                    ${(item.quantity * 100).toLocaleString()}
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={item.weight}
                        onChange={(e) => handlePortfolioChange(idx, 'weight', parseInt(e.target.value))}
                        className="w-16 px-2 py-1 bg-slate-700 border border-slate-600 rounded text-white text-sm"
                      />
                      <span className="text-gray-400">%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-gray-400 mt-4">
          Total Value: <span className="text-white font-bold">${totalInvestment.toLocaleString()}</span>
        </p>
      </div>

      {/* Simulate Button */}
      <button
        onClick={handleSimulate}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-lg transition-all disabled:cursor-not-allowed"
      >
        <Play className="w-5 h-5" />
        {loading ? 'Running Simulation...' : 'Run Simulation'}
      </button>

      {/* Loading State */}
      {loading && <LoadingSpinner message="Simulating portfolio performance..." />}

      {/* Error State */}
      {error && <ErrorMessage error={error} />}

      {/* Results */}
      {result && (
        <div className="space-y-4">
          {/* Summary Card */}
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-blue-400" />
              Simulation Results
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-400 mb-1">Expected Return</p>
                <p className={`text-2xl font-bold ${result.expected_return >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {result.expected_return >= 0 ? '+' : ''}{(result.expected_return * 100).toFixed(1)}%
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Volatility</p>
                <p className="text-2xl font-bold text-amber-400">
                  {((result.volatility || 0) * 100).toFixed(1)}%
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Max Drawdown</p>
                <p className="text-2xl font-bold text-red-400">
                  {((result.max_drawdown || 0) * 100).toFixed(1)}%
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Sharpe Ratio</p>
                <p className="text-2xl font-bold text-blue-400">
                  {(result.sharpe_ratio || 0).toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Analysis */}
          {result.analysis && (
            <div className="bg-slate-700/30 border border-slate-700 rounded-xl p-6">
              <h4 className="font-semibold text-white mb-3">Analysis</h4>
              <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                {result.analysis}
              </p>
            </div>
          )}

          {/* Recommendation */}
          {result.recommendation && (
            <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/30 rounded-xl p-6">
              <p className="text-sm text-gray-400 uppercase font-semibold mb-2">Recommendation</p>
              <p className="text-white leading-relaxed">
                {result.recommendation}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SimulateView;
