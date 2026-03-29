import React from 'react';
import {
  getActionColor,
  getActionBgColor,
  getSignalTypeColor,
  getConfidenceColor,
  formatUrgency,
} from '../utils/colors';
import { ChevronRight, AlertTriangle, TrendingUp } from 'lucide-react';

const SignalCard = ({ signal, onSelect, isSelected }) => {
  const urgencyPercent = formatUrgency(signal.urgency);

  const getUrgencyColor = () => {
    if (signal.urgency >= 7) return 'bg-red-500';
    if (signal.urgency >= 5) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div
      onClick={() => onSelect(signal.stock)}
      className={`
        relative overflow-hidden cursor-pointer
        bg-slate-800/50 border border-slate-700/50 rounded-xl
        transition-all duration-300 group
        hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/20
        ${isSelected ? 'ring-2 ring-amber-500 border-amber-500/50' : ''}
      `}
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 via-transparent to-transparent group-hover:from-amber-500/10 transition-all duration-300" />

      <div className="relative p-6">
        {/* High Priority Badge */}
        {signal.urgency >= 7 && (
          <div className="absolute top-4 right-4">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/50">
              <AlertTriangle className="w-3 h-3 text-amber-400" />
              <span className="text-xs font-semibold text-amber-400 uppercase">
                HIGH PRIORITY
              </span>
            </div>
          </div>
        )}

        {/* Stock Name */}
        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-amber-400 transition-colors">
          {signal.stock}
        </h3>

        {/* Signal Type & Confidence Row */}
        <div className="flex gap-2 mb-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getSignalTypeColor(signal.signal_type)}`}>
            {signal.signal_type}
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getConfidenceColor(signal.confidence)}`}>
            {signal.confidence} Confidence
          </span>
        </div>

        {/* Urgency Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400 font-medium">URGENCY</span>
            <span className="text-sm font-bold text-white">{urgencyPercent}%</span>
          </div>
          <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${getUrgencyColor()}`}
              style={{ width: `${urgencyPercent}%` }}
            />
          </div>
        </div>

        {/* Explanation (2 lines max) */}
        <p className="text-sm text-gray-300 mb-4 line-clamp-2">
          {signal.explanation}
        </p>

        {/* Insight (Highlighted) */}
        <div className="mb-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
          <p className="text-xs text-amber-200 font-medium mb-1">KEY INSIGHT</p>
          <p className="text-sm text-amber-100 line-clamp-2">
            {signal.insight}
          </p>
        </div>

        {/* Action Button - VERY PROMINENT */}
        <div className={`p-4 rounded-lg border transition-all ${getActionBgColor(signal.action)}`}>
          <p className="text-xs text-gray-400 font-semibold mb-1 uppercase">Recommended Action</p>
          <div className="flex items-center justify-between">
            <p className={`text-lg font-bold ${getActionColor(signal.action)}`}>
              {signal.action}
            </p>
            <ChevronRight className={`w-5 h-5 ${getActionColor(signal.action)} group-hover:translate-x-1 transition-transform`} />
          </div>
        </div>

        {/* Data Status Badge */}
        {signal.data_status !== 'ok' && (
          <div className="mt-4 p-2 rounded bg-yellow-500/10 border border-yellow-500/30">
            <p className="text-xs text-yellow-200">
              Data Status: <span className="font-semibold">{signal.data_status}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignalCard;
