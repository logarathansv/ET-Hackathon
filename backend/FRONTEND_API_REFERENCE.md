# Frontend API Reference & Integration Guide

**Base URL**: `http://localhost:8000` (development) or `https://api.yourdomain.com` (production)

---

## 📋 Quick Endpoint Overview

| # | Method | Endpoint | Purpose | Auth |
|---|--------|----------|---------|------|
| 1 | GET | `/radar` | Top investment signals with market mood | None |
| 2 | GET | `/radar/signal/{stock}` | Single stock signal analysis | None |
| 3 | GET | `/market-mood` | Market trend, risk level, volatility | None |
| 4 | GET | `/debate/{stock}` | Bull case + bear case analysis | None |
| 5 | POST | `/simulate` | Scenario impact analysis | None |
| 6 | GET | `/trace/{stock}` | Signal detection logic breakdown | None |
| 7 | POST | `/analyze` | AI-powered analysis with LLM reasoning | None |

---

## 1️⃣ GET /radar - Top Signals

Get the top 2-3 investment signals across market with market mood context.

### Request
```
GET /radar?top_k=5
```

**Parameters**:
- `top_k` (integer, optional): Number of signals to return. Range: 3-5. Default: 5

### Response Schema
```json
{
  "market_mood": {
    "trend": "Bullish|Bearish|Sideways",
    "confidence": "Low|Medium|High"
  },
  "top_signals": [
    {
      "stock": "string",
      "signal_type": "string",
      "urgency": "number (1-10)",
      "confidence": "Low|Medium|High",
      "explanation": "string (cause → confirmation → implication)",
      "insight": "string (why this matters)",
      "priority_reason": "string (why now)",
      "market_context": "string (macro effect)",
      "data_status": "ok|missing-news|limited-signal-confidence|insufficient-data",
      "action": "Avoid|Watch|Consider Entry",
      "reasoning": ["string"]
    }
  ]
}
```

### Example Request
```bash
curl -X GET "http://localhost:8000/radar?top_k=3"
```

### Example Response
```json
{
  "market_mood": {
    "trend": "Bearish",
    "confidence": "High"
  },
  "top_signals": [
    {
      "stock": "RELIANCE",
      "signal_type": "Risk Signal",
      "urgency": 7.8,
      "confidence": "High",
      "explanation": "Strong downtrend evident: price below SMA20 and SMA50, daily move: -4.60%. Trend structure is Bearish; momentum weak indicators suggest continued pressure. Risk skews downside unless negative catalysts cease.",
      "insight": "HIGH PRIORITY: Downside pressure evident; avoid until negative catalysts stabilize",
      "priority_reason": "Large-cap sector leader with urgent risk signal in current bearish market",
      "market_context": "Signal aligns with bearish market, increasing probability of continued pressure",
      "data_status": "ok",
      "action": "Avoid",
      "reasoning": ["Price 4.6% below previous close", "Trading below SMA20 and SMA50"]
    }
  ]
}
```

### React Example
```typescript
const useRadar = (topK = 5) => {
  return useQuery(
    ['radar', topK],
    async () => {
      const res = await fetch(`/radar?top_k=${topK}`);
      return res.json();
    },
    { staleTime: 30000, refetchInterval: 60000 }
  );
};

// Usage
const { data, isLoading } = useRadar(3);
return (
  <div>
    <h2>Market Trend: {data?.market_mood.trend}</h2>
    {data?.top_signals.map(signal => (
      <div key={signal.stock}>
        <h3>{signal.stock} - {signal.action}</h3>
        <p>Urgency: {signal.urgency.toFixed(1)}/{10}</p>
        <p>{signal.explanation}</p>
      </div>
    ))}
  </div>
);
```

### Python Example
```python
import httpx

async with httpx.AsyncClient() as client:
    response = await client.get("http://localhost:8000/radar?top_k=3")
    data = response.json()
    
    for signal in data['top_signals']:
        print(f"{signal['stock']}: {signal['action']}")
```

---

## 2️⃣ GET /radar/signal/{stock} - Single Stock Signal

Get detailed signal analysis for a specific stock.

### Request
```
GET /radar/signal/AAPL
```

**Parameters**:
- `stock` (string, path): Stock symbol (e.g., "AAPL", "TCS")

### Response Schema
```json
{
  "stock": "string",
  "signal_type": "string",
  "urgency": "number (1-10)",
  "confidence": "Low|Medium|High",
  "explanation": "string",
  "insight": "string",
  "priority_reason": "string",
  "market_context": "string",
  "data_status": "string",
  "action": "Avoid|Watch|Consider Entry",
  "reasoning": ["string"]
}
```

### Example Request
```bash
curl -X GET "http://localhost:8000/radar/signal/INFY"
```

### Example Response
```json
{
  "stock": "INFY",
  "signal_type": "Data Unavailable",
  "urgency": 3.5,
  "confidence": "Low",
  "explanation": "Insufficient data across price/news signals to generate a reliable insight.",
  "insight": "Unable to analyze; check data availability.",
  "priority_reason": "Data unavailable for comprehensive analysis",
  "market_context": "Data unavailable for macro analysis",
  "data_status": "insufficient-data",
  "action": "Watch",
  "reasoning": ["Price or news data unavailable"]
}
```

### React Example
```typescript
const useStockSignal = (stock: string) => {
  return useQuery(
    ['radar-signal', stock],
    async () => {
      const res = await fetch(`/radar/signal/${stock}`);
      return res.json();
    },
    { enabled: !!stock, staleTime: 60000 }
  );
};

// Usage
const { data } = useStockSignal('AAPL');
return (
  <div className={`signal signal-${data?.action.toLowerCase()}`}>
    <h3>{data?.stock}</h3>
    <p className="action">{data?.action}</p>
    <p className="urgency">Urgency: {data?.urgency}/10</p>
    <p>{data?.explanation}</p>
  </div>
);
```

---

## 3️⃣ GET /market-mood - Market Analysis

Get current market trend, risk level, and volatility assessment.

### Request
```
GET /market-mood
```

### Response Schema
```json
{
  "trend": "Bullish|Bearish|Sideways",
  "risk_level": "Low|Medium|High",
  "volatility": "Low|Moderate|High"
}
```

### Example Request
```bash
curl -X GET "http://localhost:8000/market-mood"
```

### Example Response
```json
{
  "trend": "Bearish",
  "risk_level": "High",
  "volatility": "High"
}
```

### React Example
```typescript
const useMarketMood = () => {
  return useQuery(
    ['market-mood'],
    async () => {
      const res = await fetch('/market-mood');
      return res.json();
    },
    { staleTime: 30000, refetchInterval: 60000 }
  );
};

// Usage
const { data } = useMarketMood();
return (
  <div className="market-overview">
    <div className={`trend ${data?.trend.toLowerCase()}`}>
      {data?.trend} Market
    </div>
    <div>Risk: {data?.risk_level}</div>
    <div>Volatility: {data?.volatility}</div>
  </div>
);
```

---

## 4️⃣ GET /debate/{stock} - Bull vs Bear Case

Get contrarian analysis with bull case, bear case, and final verdict.

### Request
```
GET /debate/AAPL
```

**Parameters**:
- `stock` (string, path): Stock symbol

### Response Schema
```json
{
  "bull_case": ["string", "string", "string"],
  "bear_case": ["string", "string", "string"],
  "verdict": "Opportunity|Risk|Neutral"
}
```

### Example Request
```bash
curl -X GET "http://localhost:8000/debate/AAPL"
```

### Example Response
```json
{
  "bull_case": [
    "Oversold or dislocated pricing can support a rebound",
    "Current setup suggests upside if sentiment stabilizes",
    "Absence of fresh negative catalyst can limit incremental downside"
  ],
  "bear_case": [
    "Current signal is risk-dominant with weak near-term structure",
    "Trend reversal is not yet fully confirmed",
    "Negative news flow can quickly invalidate bullish setups"
  ],
  "verdict": "Neutral"
}
```

### React Example
```typescript
const useDebate = (stock: string) => {
  return useQuery(['debate', stock], async () => {
    const res = await fetch(`/debate/${stock}`);
    return res.json();
  });
};

// Usage
const { data } = useDebate('AAPL');
return (
  <div className="debate-container">
    <div className="bull-case">
      <h3>Bull Case 📈</h3>
      <ul>
        {data?.bull_case.map((point, i) => (
          <li key={i}>{point}</li>
        ))}
      </ul>
    </div>
    
    <div className={`verdict verdict-${data?.verdict.toLowerCase()}`}>
      <strong>{data?.verdict}</strong>
    </div>
    
    <div className="bear-case">
      <h3>Bear Case 📉</h3>
      <ul>
        {data?.bear_case.map((point, i) => (
          <li key={i}>{point}</li>
        ))}
      </ul>
    </div>
  </div>
);
```

---

## 5️⃣ POST /simulate - Scenario Analysis

Analyze impact of a market scenario on your portfolio.

### Request
```
POST /simulate
Content-Type: application/json

{
  "scenario": "string",
  "portfolio": ["AAPL", "MSFT", "GOOGL"]
}
```

**Body**:
- `scenario` (string, required): Scenario description (e.g., "Interest rate hike", "Fed cuts rates")
- `portfolio` (array of strings, required): List of stock symbols

### Response Schema
```json
{
  "impact": [
    {
      "stock": "string",
      "effect": "Positive|Neutral|Negative",
      "reason": "string",
      "confidence": "Low|Medium|High",
      "horizon": "Short-term|Medium-term"
    }
  ]
}
```

### Example Request
```bash
curl -X POST "http://localhost:8000/simulate" \
  -H "Content-Type: application/json" \
  -d '{
    "scenario": "Interest rate hike",
    "portfolio": ["HDFC", "INFY", "RELIANCE"]
  }'
```

### Example Response
```json
{
  "impact": [
    {
      "stock": "HDFC",
      "effect": "Positive",
      "reason": "Bank margins expand when rates rise",
      "confidence": "High",
      "horizon": "Medium-term"
    },
    {
      "stock": "INFY",
      "effect": "Negative",
      "reason": "Higher USD-INR correlation; IT margins compressed",
      "confidence": "Medium",
      "horizon": "Short-term"
    },
    {
      "stock": "RELIANCE",
      "effect": "Neutral",
      "reason": "Mixed impact on crude, refining spreads offset",
      "confidence": "Low",
      "horizon": "Medium-term"
    }
  ]
}
```

### React Example
```typescript
const useSimulate = () => {
  return useMutation(async (payload: { scenario: string; portfolio: string[] }) => {
    const res = await fetch('/simulate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  });
};

// Usage
const { mutateAsync } = useSimulate();
const handleScenario = async () => {
  const results = await mutateAsync({
    scenario: 'Interest rate hike by 1%',
    portfolio: ['HDFC', 'INFY', 'RELIANCE']
  });
  
  return results.impact.map(item => (
    <div key={item.stock} className={`impact impact-${item.effect.toLowerCase()}`}>
      <h4>{item.stock}</h4>
      <p className="effect">{item.effect}</p>
      <p>{item.reason}</p>
      <small>Confidence: {item.confidence}</small>
    </div>
  ));
};
```

---

## 6️⃣ GET /trace/{stock} - Signal Logic Trace

Get the reasoning chain for how a signal was detected.

### Request
```
GET /trace/AAPL
```

**Parameters**:
- `stock` (string, path): Stock symbol

### Response Schema
```json
{
  "signal": "string",
  "logic_flow": ["string"]
}
```

### Example Request
```bash
curl -X GET "http://localhost:8000/trace/AAPL"
```

### Example Response
```json
{
  "signal": "Risk Signal",
  "logic_flow": [
    "Step 1: Fetched price snapshot - AAPL trading at 185.42",
    "Step 2: Calculated daily change - -4.60% move",
    "Step 3: Evaluated against SMA20 (184.50) - PRICE BELOW",
    "Step 4: Evaluated against SMA50 (182.30) - PRICE BELOW",
    "Step 5: Checked RSI signal - Weak momentum",
    "Step 6: Risk alignment confirmed - Downtrend structure",
    "Conclusion: Strong downtrend detected with weak recovery signals"
  ]
}
```

### React Example
```typescript
const useTrace = (stock: string) => {
  return useQuery(['trace', stock], async () => {
    const res = await fetch(`/trace/${stock}`);
    return res.json();
  });
};

// Usage
const { data } = useTrace('AAPL');
return (
  <div className="trace-container">
    <h3>Signal: {data?.signal}</h3>
    <ol className="logic-flow">
      {data?.logic_flow.map((step, i) => (
        <li key={i}>{step}</li>
      ))}
    </ol>
  </div>
);
```

---

## 7️⃣ POST /analyze - AI Analysis

Comprehensive AI-powered analysis using LLM with tool integration.

### Request
```
POST /analyze
Content-Type: application/json

{
  "query": "string",
  "stock": "string",
  "portfolio": ["string"] (optional)
}
```

**Body**:
- `query` (string, required): Your investment question (e.g., "Should I buy AAPL now?")
- `stock` (string, required): Primary stock to analyze
- `portfolio` (array of strings, optional): Additional stocks for context

### Response Schema
```json
{
  "summary": "string (2-3 line explanation)",
  "bull_case": ["string", "string", "string"],
  "bear_case": ["string", "string", "string"],
  "reasoning_trace": ["string"],
  "confidence": "Low|Medium|High",
  "verdict": "Risk|Opportunity|Neutral"
}
```

### Example Request
```bash
curl -X POST "http://localhost:8000/analyze" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Is AAPL a good entry point right now?",
    "stock": "AAPL",
    "portfolio": ["MSFT", "GOOGL"]
  }'
```

### Example Response
```json
{
  "summary": "AAPL shows mixed signals with technical weakness offset by strong fundamentals. Current bearish market context suggests waiting for confirmation before entry.",
  "bull_case": [
    "Strong brand moat and ecosystem lock-in",
    "Services segment provides recurring revenue stream",
    "Cash generation remains robust with potential for buybacks"
  ],
  "bear_case": [
    "Valuation stretched at current P/E ratio",
    "Macro headwinds from higher interest rates impacting growth",
    "iPhone sales plateau concerns in developed markets"
  ],
  "reasoning_trace": [
    "Analyzed price action relative to moving averages",
    "Evaluated sentiment from recent news flow",
    "Assessed insider trading activity",
    "Cross-referenced with portfolio correlation"
  ],
  "confidence": "Medium",
  "verdict": "Neutral"
}
```

### React Example
```typescript
const useAnalyze = () => {
  return useMutation(
    async (payload: {
      query: string;
      stock: string;
      portfolio?: string[];
    }) => {
      const res = await fetch('/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        throw new Error(`Analysis failed: ${res.statusText}`);
      }
      return res.json();
    }
  );
};

// Usage
const AnalysisForm = () => {
  const { mutateAsync, isLoading } = useAnalyze();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await mutateAsync({
      query: "Should I buy AAPL now?",
      stock: "AAPL",
      portfolio: ["MSFT", "GOOGL"]
    });

    return (
      <div className="analysis-result">
        <p className="summary">{result.summary}</p>
        
        <div className="cases">
          <div className="bull">
            <h4>🟢 Bull Case</h4>
            <ul>
              {result.bull_case.map((point, i) => (
                <li key={i}>{point}</li>
              ))}
            </ul>
          </div>

          <div className={`verdict verdict-${result.verdict.toLowerCase()}`}>
            {result.verdict}
            <p>Confidence: {result.confidence}</p>
          </div>

          <div className="bear">
            <h4>🔴 Bear Case</h4>
            <ul>
              {result.bear_case.map((point, i) => (
                <li key={i}>{point}</li>
              ))}
            </ul>
          </div>
        </div>

        <details className="trace">
          <summary>View Reasoning</summary>
          <ol>
            {result.reasoning_trace.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </details>
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="query" placeholder="Your question..." />
      <input type="text" name="stock" placeholder="Stock symbol..." />
      <button disabled={isLoading}>
        {isLoading ? 'Analyzing...' : 'Analyze'}
      </button>
    </form>
  );
};
```

---

## 🛠️ Common Integration Patterns

### Pattern 1: Real-Time Monitoring Dashboard
```typescript
useQuery(['radar'], async () => {
  const radar = await fetch('/radar?top_k=5').then(r => r.json());
  const mood = await fetch('/market-mood').then(r => r.json());
  return { radar, mood };
}, { refetchInterval: 30000 });
```

### Pattern 2: Stock Deep Dive
```typescript
Promise.all([
  fetch(`/radar/signal/${stock}`).then(r => r.json()),
  fetch(`/debate/${stock}`).then(r => r.json()),
  fetch(`/trace/${stock}`).then(r => r.json()),
  fetch(`/analyze`, {
    method: 'POST',
    body: JSON.stringify({ query: userQuestion, stock, portfolio })
  }).then(r => r.json())
]);
```

### Pattern 3: Scenario Planning
```typescript
const scenarios = [
  'Interest rate hike',
  'Fed cuts rates',
  'Recession expected'
];

Promise.all(
  scenarios.map(scenario =>
    fetch('/simulate', {
      method: 'POST',
      body: JSON.stringify({ scenario, portfolio: userPortfolio })
    }).then(r => r.json())
  )
);
```

---

## ⚡ Performance & Caching Strategy

| Endpoint | Recommended Cache | Refetch Interval |
|----------|------------------|------------------|
| `/radar` | 30 seconds | 1 minute |
| `/radar/signal/{stock}` | 60 seconds | 2 minutes |
| `/market-mood` | 30 seconds | 1 minute |
| `/debate/{stock}` | 5 minutes | 10 minutes |
| `/simulate` | No cache | On-demand |
| `/trace/{stock}` | No cache | On-demand |
| `/analyze` | No cache | On-demand |

---

## 🚨 Error Handling

### Success Response
```json
{
  "market_mood": { ... },
  "top_signals": [ ... ]
}
```

### Error Response (5xx)
```json
Status: 500 Internal Server Error
{
  "detail": "Analysis failed"
}
```

### Retry Strategy
```typescript
async function fetchWithRetry(url, options, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) return response.json();
      
      if (response.status >= 500) {
        await new Promise(resolve => 
          setTimeout(resolve, 1000 * Math.pow(2, i))
        );
        continue;
      }
      
      throw new Error(`HTTP ${response.status}`);
    } catch (error) {
      if (i === maxRetries - 1) throw error;
    }
  }
}
```

---

## ✅ Deployment Checklist

- [ ] Update `REACT_APP_API_URL` environment variable
- [ ] Test all 7 endpoints in staging
- [ ] Implement proper error boundaries
- [ ] Add loading states to all queries
- [ ] Cache responses appropriately
- [ ] Monitor API response times
- [ ] Test error paths (network failures, timeouts)
- [ ] Set up API monitoring/alerting

---

**Last Updated**: March 2026  
**Version**: 1.0.0  
**Status**: Production Ready
