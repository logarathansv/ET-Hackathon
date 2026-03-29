/**
 * Format a number as currency
 */
export const formatCurrency = (value, decimals = 2) => {
  if (value === null || value === undefined) return 'N/A';
  return `$${parseFloat(value).toFixed(decimals)}`;
};

/**
 * Format a number as percentage
 */
export const formatPercent = (value, decimals = 2) => {
  if (value === null || value === undefined) return 'N/A';
  const percent = parseFloat(value) * 100;
  return `${percent >= 0 ? '+' : ''}${percent.toFixed(decimals)}%`;
};

/**
 * Format a number with thousands separator
 */
export const formatNumber = (value, decimals = 0) => {
  if (value === null || value === undefined) return 'N/A';
  return parseFloat(value).toLocaleString('en-US', {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  });
};

/**
 * Format a date to readable format
 */
export const formatDate = (date) => {
  if (!date) return 'N/A';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Format a time duration
 */
export const formatDuration = (seconds) => {
  if (!seconds) return '0s';
  if (seconds < 60) return `${Math.round(seconds)}s`;
  if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
  return `${Math.round(seconds / 3600)}h`;
};

/**
 * Get color class based on value (positive/negative)
 */
export const getValueColor = (value) => {
  if (value === null || value === undefined) return 'text-gray-400';
  const num = parseFloat(value);
  if (num > 0) return 'text-green-400';
  if (num < 0) return 'text-red-400';
  return 'text-gray-400';
};

/**
 * Get trend arrow based on value
 */
export const getTrendArrow = (value) => {
  if (value === null || value === undefined) return '→';
  const num = parseFloat(value);
  if (num > 0) return '↑';
  if (num < 0) return '↓';
  return '→';
};

/**
 * Truncate text to a maximum length
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Format signal type to display text
 */
export const formatSignalType = (type) => {
  const map = {
    BUY: '🟢 Buy',
    SELL: '🔴 Sell',
    HOLD: '🟡 Hold',
    BULLISH: '⬆️ Bullish',
    BEARISH: '⬇️ Bearish',
    NEUTRAL: '→ Neutral',
  };
  return map[type?.toUpperCase()] || type;
};

/**
 * Format confidence score
 */
export const formatConfidence = (value) => {
  if (value === null || value === undefined) return 'N/A';
  const percent = Math.round(parseFloat(value) * 100);
  if (percent >= 80) return `${percent}% - Very High`;
  if (percent >= 60) return `${percent}% - High`;
  if (percent >= 40) return `${percent}% - Medium`;
  return `${percent}% - Low`;
};
