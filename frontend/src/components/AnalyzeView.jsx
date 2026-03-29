import React, { useState } from 'react';
import { analyze } from '../services/api';
import { LoadingSpinner, ErrorMessage } from './LoadingSpinner';
import { Search, Send } from 'lucide-react';

const AnalyzeView = ({ onSelectStock }) => {
  const [stock, setStock] = useState('');
  const [submittedStock, setSubmittedStock] = useState('');
  const [query, setQuery] = useState('Should I buy this stock?');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!stock.trim()) return;

    const normalizedStock = stock.trim().toUpperCase();

    try {
      setLoading(true);
      setError(null);
      const data = await analyze(query, normalizedStock);
      setResult(data);
      setSubmittedStock(normalizedStock);
      onSelectStock(normalizedStock);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Stock Analysis</h2>
        <form onSubmit={handleAnalyze} className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Enter stock symbol (e.g., AAPL, TSLA)"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">Analysis Question</label>
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              rows="3"
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 resize-none"
              placeholder="Ask a question about the stock..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:from-gray-600 disabled:to-gray-700 text-white font-medium rounded-lg transition-all disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
            {loading ? 'Analyzing...' : 'Analyze'}
          </button>
        </form>
      </div>

      {/* Loading State */}
      {loading && <LoadingSpinner message={`Analyzing ${stock}...`} />}

      {/* Error State */}
      {error && <ErrorMessage error={error} />}

      {/* Results */}
      {result && (
        <div className="space-y-4">
          {/* Stock Header */}
          <div className="flex items-center gap-4 p-6 rounded-xl bg-blue-500/10 border border-blue-500/30">
            <div className="text-3xl font-bold text-blue-400">{submittedStock || stock.toUpperCase()}</div>
            <p className="text-gray-400 flex-1">Analysis Results</p>
          </div>

          {/* Summary */}
          {(result.summary || result.analysis) && (
            <div className="bg-slate-700/30 border border-slate-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-3">Summary</h3>
              <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                {result.summary || result.analysis}
              </p>
            </div>
          )}

          {/* Verdict + Confidence */}
          {(result.verdict || result.confidence) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-700/30 border border-slate-700 rounded-lg p-4">
                <p className="text-xs text-gray-400 uppercase font-semibold mb-1">Verdict</p>
                <p className="text-xl font-bold text-white">{result.verdict || 'N/A'}</p>
              </div>
              <div className="bg-slate-700/30 border border-slate-700 rounded-lg p-4">
                <p className="text-xs text-gray-400 uppercase font-semibold mb-1">Confidence</p>
                <p className="text-xl font-bold text-white">{result.confidence || 'N/A'}</p>
              </div>
            </div>
          )}

          {/* Bull vs Bear Cases */}
          {(Array.isArray(result.bull_case) || Array.isArray(result.bear_case)) && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-green-400 mb-3">Bull Case</h3>
                <ul className="space-y-2 text-green-100 text-sm">
                  {(result.bull_case || []).map((item, idx) => (
                    <li key={`bull-${idx}`} className="leading-relaxed">• {item}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-red-400 mb-3">Bear Case</h3>
                <ul className="space-y-2 text-red-100 text-sm">
                  {(result.bear_case || []).map((item, idx) => (
                    <li key={`bear-${idx}`} className="leading-relaxed">• {item}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Reasoning Trace */}
          {Array.isArray(result.reasoning_trace) && result.reasoning_trace.length > 0 && (
            <div className="bg-slate-700/30 border border-slate-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-3">Reasoning Trace</h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                {result.reasoning_trace.map((step, idx) => (
                  <li key={`trace-${idx}`} className="leading-relaxed">{idx + 1}. {step}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Legacy Metrics (if backend adds it) */}
          {result.metrics && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(result.metrics).map(([key, value]) => (
                <div key={key} className="bg-slate-700/30 border border-slate-700 rounded-lg p-4">
                  <p className="text-xs text-gray-400 uppercase font-semibold mb-1">{key}</p>
                  <p className="text-xl font-bold text-white">{value}</p>
                </div>
              ))}
            </div>
          )}

          {/* Recommendation (legacy compatibility) */}
          {result.recommendation && (
            <div className="p-6 rounded-xl bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/30">
              <p className="text-sm text-gray-400 uppercase font-semibold mb-2">Recommendation</p>
              <p className="text-white font-semibold">
                {result.recommendation}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AnalyzeView;
