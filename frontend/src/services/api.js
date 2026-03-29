import axios from 'axios';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error?.code === 'ERR_CANCELED') {
      throw error;
    }

    console.error('API Error:', error.response?.data || error.message);
    throw error;
  }
);

// ============================================================================
// RADAR ENDPOINTS
// ============================================================================

/**
 * Fetch top investment signals with market mood
 * GET /radar?top_k=5
 */
export const getRadar = async (topK = 5, options = {}) => {
  return apiClient.get('/radar', {
    params: { top_k: topK },
    timeout: 30000,
    ...options,
  });
};

/**
 * Fetch signal for a specific stock
 * GET /radar/signal/{stock}
 */
export const getStockSignal = async (stock) => {
  return apiClient.get(`/radar/signal/${stock}`);
};

// ============================================================================
// MARKET ENDPOINTS
// ============================================================================

/**
 * Fetch current market mood, risk level, and volatility
 * GET /market-mood
 */
export const getMarketMood = async () => {
  return apiClient.get('/market-mood');
};

// ============================================================================
// DEBATE ENDPOINTS
// ============================================================================

/**
 * Fetch bull case and bear case for a stock
 * GET /debate/{stock}
 */
export const getDebate = async (stock) => {
  return apiClient.get(`/debate/${stock}`);
};

// ============================================================================
// TRACE ENDPOINTS
// ============================================================================

/**
 * Fetch signal detection logic trace
 * GET /trace/{stock}
 */
export const getTrace = async (stock) => {
  return apiClient.get(`/trace/${stock}`);
};

// ============================================================================
// SIMULATE ENDPOINTS
// ============================================================================

/**
 * Simulate scenario impact on portfolio
 * POST /simulate
 */
export const simulate = async (scenario, portfolio) => {
  return apiClient.post('/simulate', {
    scenario,
    portfolio,
  });
};

// ============================================================================
// ANALYZE ENDPOINTS
// ============================================================================

/**
 * AI-powered analysis with LLM reasoning
 * POST /analyze
 */
export const analyze = async (query, stock, portfolio = null) => {
  return apiClient.post('/analyze', {
    query,
    stock,
    portfolio,
  });
};

export default apiClient;
