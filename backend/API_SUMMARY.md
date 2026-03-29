# Frontend API Summary

**Quick reference for all backend endpoints and their schemas.**

---

## 📚 Documentation Files

| File | Purpose | Audience |
|------|---------|----------|
| **[FRONTEND_API_REFERENCE.md](./FRONTEND_API_REFERENCE.md)** | Complete API documentation with examples | Frontend developers |
| **[openapi-schema.json](./openapi-schema.json)** | OpenAPI 3.0 specification | API tools, code generators |
| **[api-types.ts](./api-types.ts)** | TypeScript type definitions | TypeScript/React developers |

---

## 🚀 7 Core Endpoints

### 1. **GET /radar** - Top Investment Signals
```
Query: ?top_k=5
Returns: { market_mood, top_signals[] }
Cache: 30 seconds
Refetch: Every 1 minute
```
Get 2-3 ranked investment signals with market context.

### 2. **GET /radar/signal/{stock}** - Single Stock Analysis  
```
Path: /radar/signal/AAPL
Returns: SignalItem
Cache: 60 seconds
```
Deep dive on specific stock signal.

### 3. **GET /market-mood** - Market Assessment
```
Returns: { trend, risk_level, volatility }
Cache: 30 seconds
```
Current market trend, risk, and volatility level.

### 4. **GET /debate/{stock}** - Bull vs Bear Case
```
Path: /debate/AAPL
Returns: { bull_case[], bear_case[], verdict }
Cache: 5 minutes
```
Balanced analysis with opposing viewpoints.

### 5. **POST /simulate** - Scenario Planning
```
Body: { scenario: string, portfolio: string[] }
Returns: { impact[] }
Cache: None (on-demand)
```
Analyze impact of market scenario on portfolio.

### 6. **GET /trace/{stock}** - Signal Logic Trace
```
Path: /trace/AAPL
Returns: { signal: string, logic_flow[] }
Cache: None (on-demand)
```
Step-by-step reasoning for signal detection.

### 7. **POST /analyze** - AI Analysis
```
Body: { query: string, stock: string, portfolio?: [] }
Returns: { summary, bull_case, bear_case, verdict, confidence }
Cache: None (on-demand)
```
LLM-powered comprehensive analysis with reasoning.

---

## 📊 Response Schema Summary

### SignalItem (Common Structure)
```typescript
{
  stock: string;
  signal_type: string;
  urgency: 1-10;  // Numeric score
  confidence: "Low" | "Medium" | "High";
  explanation: string;
  insight: string;
  priority_reason: string;
  market_context: string;
  data_status: "ok" | "missing-news" | "limited-signal-confidence" | "insufficient-data";
  action: "Avoid" | "Watch" | "Consider Entry";
  reasoning: string[];
}
```

### RadarResponse
```typescript
{
  market_mood: { trend, confidence };
  top_signals: SignalItem[];
}
```

### MarketMoodResponse
```typescript
{
  trend: "Bullish" | "Bearish" | "Sideways";
  risk_level: "Low" | "Medium" | "High";
  volatility: "Low" | "Moderate" | "High";
}
```

### DebateResponse
```typescript
{
  bull_case: string[];  // 3 points
  bear_case: string[];  // 3 points
  verdict: "Opportunity" | "Risk" | "Neutral";
}
```

### SimulateResponse
```typescript
{
  impact: [
    {
      stock: string;
      effect: "Positive" | "Neutral" | "Negative";
      reason: string;
      confidence: "Low" | "Medium" | "High";
      horizon: "Short-term" | "Medium-term";
    }
  ];
}
```

### TraceResponse
```typescript
{
  signal: string;
  logic_flow: string[];  // Step-by-step reasoning
}
```

### AnalysisResponse
```typescript
{
  summary: string;  // 2-3 lines
  bull_case: string[];  // 3 points
  bear_case: string[];  // 3 points
  reasoning_trace: string[];  // Steps taken
  confidence: "Low" | "Medium" | "High";
  verdict: "Risk" | "Opportunity" | "Neutral";
}
```

---

## 🛠️ Integration Quick Start

### React with react-query
```typescript
import { useQuery } from 'react-query';

const { data, isLoading } = useQuery('radar', async () => {
  const res = await fetch('/radar?top_k=5');
  return res.json();
});
```

### TypeScript Types
```typescript
import type { RadarResponse, SignalItem } from './api-types';

const processSignals = (data: RadarResponse) => {
  data.top_signals.forEach((signal: SignalItem) => {
    console.log(signal.stock, signal.action);
  });
};
```

### fetch API
```javascript
const getRadar = async () => {
  try {
    const response = await fetch('/radar?top_k=5');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch radar:', error);
  }
};
```

---

## ⚡ Performance & Caching

| Endpoint | Cache | Refetch | Best For |
|----------|-------|---------|----------|
| GET /radar | 30s | 1 min | Dashboard updates |
| GET /radar/signal/{stock} | 60s | 2 min | Stock detail pages |
| GET /market-mood | 30s | 1 min | Market indicator |
| GET /debate/{stock} | 5 min | 10 min | Deep analysis |
| POST /simulate | None | On-demand | Planning |
| GET /trace/{stock} | None | On-demand | Debugging |
| POST /analyze | None | On-demand | Fresh analysis |

---

## 🚨 Error Handling

All endpoints return HTTP 200 on success. Server errors (5xx) are rare and retryable.

### Error Response
```json
{
  "detail": "Analysis failed"
}
```

### Retry Strategy
```typescript
async function fetchWithRetry(url, maxRetries = 3, backoff = 1000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url);
      if (!response.ok && response.status >= 500) {
        throw new Error(`HTTP ${response.status}`);
      }
      return response.json();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(r => setTimeout(r, backoff * Math.pow(2, i)));
    }
  }
}
```

---

## 📦 API Client Implementation

**Recommended setup** (see FRONTEND_API_REFERENCE.md for full examples):

```typescript
// api-client.ts
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
  timeout: 15000,
});

// Usage
export const getRadar = (topK = 5) =>
  apiClient.get('/radar', { params: { top_k: topK } });

export const getStockSignal = (stock: string) =>
  apiClient.get(`/radar/signal/${stock}`);

export const analyze = (payload) =>
  apiClient.post('/analyze', payload);
```

---

## ✅ Deployment Checklist

Before going to production:

- [ ] Update `REACT_APP_API_URL` to production domain
- [ ] Enable HTTPS (SSL/TLS)
- [ ] Test all 7 endpoints
- [ ] Implement error boundaries
- [ ] Set up caching strategy
- [ ] Configure retry logic
- [ ] Monitor API response times
- [ ] Add loading/error states
- [ ] Test network failure scenarios

---

## 🔗 Related Files

- Backend main: `backend/main.py`
- Radar engine: `backend/services/radar_engine.py`
- Routes: `backend/routes/`

---

**Quick Links**:
- 📖 Full API Reference: [FRONTEND_API_REFERENCE.md](./FRONTEND_API_REFERENCE.md)
- 🔄 OpenAPI Schema: [openapi-schema.json](./openapi-schema.json)
- 📘 TypeScript Types: [api-types.ts](./api-types.ts)

**Last Updated**: March 2026  
**Version**: 1.0.0
