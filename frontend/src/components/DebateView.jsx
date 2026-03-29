import React, { useState, useEffect } from 'react';
import { getDebate } from '../services/api';
import { LoadingSpinner, ErrorMessage } from './LoadingSpinner';
import { TrendingUp, TrendingDown, Scale } from 'lucide-react';
import { getVerdictColor } from '../utils/colors';

const DebateView = ({ stock }) => {
  const [debate, setDebate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchDebate = async () => {
      if (!stock) return;
      try {
        setLoading(true);
        setError(null);
        const data = await getDebate(stock);
        setDebate(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDebate();
  }, [stock]);

  if (!stock) {
    return (
      <div className="p-8 rounded-xl bg-slate-800 border border-slate-700 text-center">
        <p className="text-gray-400">Select a signal to view debate</p>
      </div>
    );
  }

  if (loading) {
    return <LoadingSpinner message={`Loading debate for ${stock}...`} />;
  }

  if (error) {
    return <ErrorMessage error={error} />;
  }

  if (!debate) {
    return (
      <div className="p-8 rounded-xl bg-slate-800 border border-slate-700 text-center">
        <p className="text-gray-400">No debate data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-slate-700">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-3 font-semibold border-b-2 transition-colors ${
            activeTab === 'overview'
              ? 'text-amber-400 border-amber-400'
              : 'text-gray-400 border-transparent hover:text-gray-300'
          }`}
        >
          Analysis
        </button>
        <button
          onClick={() => setActiveTab('verdict')}
          className={`px-4 py-3 font-semibold border-b-2 transition-colors ${
            activeTab === 'verdict'
              ? 'text-amber-400 border-amber-400'
              : 'text-gray-400 border-transparent hover:text-gray-300'
          }`}
        >
          Verdict
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-2 gap-6">
          {/* Bull Case */}
          <div className="rounded-xl border border-green-500/30 overflow-hidden bg-gradient-to-br from-green-500/5 to-transparent">
            <div className="bg-green-500/10 border-b border-green-500/30 px-6 py-4 flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-green-400" />
              <h3 className="text-xl font-bold text-green-400">Bull Case</h3>
            </div>
            <div className="p-6 space-y-4">
              {debate.bull_case.map((point, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-8 h-8 rounds bg-green-500/20 border border-green-500/50 rounded-full">
                      <span className="text-xs font-bold text-green-400">{idx + 1}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-green-100 leading-relaxed">
                      {point}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bear Case */}
          <div className="rounded-xl border border-red-500/30 overflow-hidden bg-gradient-to-br from-red-500/5 to-transparent">
            <div className="bg-red-500/10 border-b border-red-500/30 px-6 py-4 flex items-center gap-3">
              <TrendingDown className="w-6 h-6 text-red-400" />
              <h3 className="text-xl font-bold text-red-400">Bear Case</h3>
            </div>
            <div className="p-6 space-y-4">
              {debate.bear_case.map((point, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-8 h-8 bg-red-500/20 border border-red-500/50 rounded-full">
                      <span className="text-xs font-bold text-red-400">{idx + 1}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-red-100 leading-relaxed">
                      {point}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'verdict' && (
        <div className="flex items-center justify-center py-12">
          <div className={`rounded-2xl border-2 p-12 text-center ${getVerdictColor(debate.verdict)}`}>
            <Scale className="w-12 h-12 mx-auto mb-4 opacity-75" />
            <p className="text-sm uppercase font-semibold opacity-75 mb-2">Final Verdict</p>
            <h2 className="text-4xl font-bold mb-4">{debate.verdict}</h2>
            <p className="text-sm opacity-75">
              {debate.verdict === 'Opportunity'
                ? 'The balance of factors suggests a buying opportunity'
                : debate.verdict === 'Risk'
                ? 'The balance of factors suggests downside risk'
                : 'No clear edge in either direction at this time'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DebateView;
