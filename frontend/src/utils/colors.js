/**
 * Color utility functions for the financial theme
 */

export const colors = {
  // Theme colors
  background: {
    primary: '#0B0F19',
    secondary: '#121826',
    card: '#1F2937',
  },
  text: {
    primary: '#E5E7EB',
    secondary: '#9CA3AF',
  },
  accent: {
    risk: '#EF4444',      // Red
    opportunity: '#22C55E', // Green
    neutral: '#FACC15',    // Yellow
    gold: '#F59E0B',       // Gold
  },
};

/**
 * Get color based on action type
 */
export const getActionColor = (action) => {
  switch (action) {
    case 'Avoid':
      return 'text-red-500';
    case 'Consider Entry':
      return 'text-green-500';
    case 'Watch':
      return 'text-yellow-500';
    default:
      return 'text-gray-400';
  }
};

/**
 * Get action background color class
 */
export const getActionBgColor = (action) => {
  switch (action) {
    case 'Avoid':
      return 'bg-red-500/20 border-red-500/50';
    case 'Consider Entry':
      return 'bg-green-500/20 border-green-500/50';
    case 'Watch':
      return 'bg-yellow-500/20 border-yellow-500/50';
    default:
      return 'bg-gray-500/20 border-gray-500/50';
  }
};

/**
 * Get signal type badge color
 */
export const getSignalTypeColor = (signalType) => {
  if (signalType.includes('Risk')) {
    return 'bg-red-500/20 text-red-400 border-red-500/50';
  }
  if (signalType.includes('Momentum') || signalType.includes('Smart Money')) {
    return 'bg-green-500/20 text-green-400 border-green-500/50';
  }
  return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
};

/**
 * Get verdict badge color
 */
export const getVerdictColor = (verdict) => {
  switch (verdict) {
    case 'Opportunity':
      return 'bg-green-500/20 text-green-400 border-green-500/50';
    case 'Risk':
      return 'bg-red-500/20 text-red-400 border-red-500/50';
    case 'Neutral':
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
    default:
      return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
  }
};

/**
 * Get confidence color
 */
export const getConfidenceColor = (confidence) => {
  switch (confidence) {
    case 'High':
      return 'bg-green-500/20 text-green-400';
    case 'Medium':
      return 'bg-yellow-500/20 text-yellow-400';
    case 'Low':
      return 'bg-red-500/20 text-red-400';
    default:
      return 'bg-gray-500/20 text-gray-400';
  }
};

/**
 * Get effect (scenario impact) color
 */
export const getEffectColor = (effect) => {
  switch (effect) {
    case 'Positive':
      return 'text-green-400 bg-green-500/10 border-green-500/30';
    case 'Negative':
      return 'text-red-400 bg-red-500/10 border-red-500/30';
    case 'Neutral':
      return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
    default:
      return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
  }
};

/**
 * Get trend color
 */
export const getTrendColor = (trend) => {
  switch (trend) {
    case 'Bullish':
      return 'text-green-500';
    case 'Bearish':
      return 'text-red-500';
    case 'Sideways':
      return 'text-yellow-500';
    default:
      return 'text-gray-400';
  }
};

/**
 * Format urgency as readable percentage
 */
export const formatUrgency = (urgency) => {
  return ((urgency / 10) * 100).toFixed(0);
};

export default {
  colors,
  getActionColor,
  getActionBgColor,
  getSignalTypeColor,
  getVerdictColor,
  getConfidenceColor,
  getEffectColor,
  getTrendColor,
  formatUrgency,
};
