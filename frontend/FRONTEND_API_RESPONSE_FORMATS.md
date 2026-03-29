# Frontend API Response Format Specifications

This document specifies the exact response structures that the frontend expects from each backend API endpoint. The backend should return JSON responses matching these schemas.

## 1. Analyze Endpoint

**Path:** `POST /analyze`

**Request Body:**
```json
{
  "query": "string (e.g., 'Should I buy this stock?')",
  "stock": "string (stock symbol e.g., 'AAPL')",
  "portfolio": "object (optional)"
}
```

**Expected Response:**
```json
{
  "analysis": "string (LLM analysis text, multi-paragraph)",
  "metrics": {
    "pe_ratio": "string or number",
    "dividend_yield": "string or number",
    "52w_high": "string or number",
    "52w_low": "string or number",
    "market_cap": "string or number"
  },
  "recommendation": "string (buy/hold/sell recommendation text)"
}
```

**Frontend Usage:** `AnalyzeView.jsx`
- Displays analysis in pre-formatted text area
- Renders metrics in 4-column grid
- Shows recommendation in highlighted box

---

## 2. Radar Endpoint

**Path:** `GET /radar?top_k=5`

**Query Parameters:**
- `top_k`: integer (number of top signals to return, default 5)

**Expected Response:**
```json
{
  "signals": [
    {
      "symbol": "string (stock symbol e.g., 'AAPL')",
      "type": "string (BUY, SELL, HOLD, BULLISH, BEARISH)",
      "price": "float (current price)",
      "change": "float (percentage change e.g., 2.5 for +2.5%)",
      "confidence": "float (0.0 to 1.0, e.g., 0.85)",
      "reason": "string (explanation of signal)"
    }
  ],
  "market_mood": "string (Bullish, Bearish, Neutral)",
  "volatility": "string (High, Medium, Low)"
}
```

**Frontend Usage:** `SignalRadarView.jsx`
- Displays market mood, volatility in header cards
- Renders each signal as a card in 3-column grid on desktop
- Shows confidence as percentage and progress bar
- Color-codes based on signal type (BUY=green, SELL=red)

---

## 3. Stock Signal Endpoint

**Path:** `GET /radar/signal/{stock}`

**Path Parameters:**
- `stock`: string (stock symbol)

**Expected Response:**
```json
{
  "symbol": "string",
  "type": "string (BUY, SELL, HOLD, BULLISH, BEARISH)",
  "price": "float",
  "change": "float",
  "confidence": "float (0.0 to 1.0)",
  "reason": "string",
  "timestamp": "string (ISO format, optional)",
  "indicators": {
    "key1": "value1",
    "key2": "value2"
  }
}
```

---

## 4. Market Mood Endpoint

**Path:** `GET /market-mood`

**Expected Response:**
```json
{
  "mood": "string (Bullish, Bearish, Neutral)",
  "risk": "string (High, Medium, Low)",
  "volatility": "string (High, Medium, Low)",
  "sentiment_score": "float (0.0 to 1.0, where 1.0 is most bullish)",
  "volatility_score": "float (0.0 to 1.0, where 1.0 is highest)",
  "vix": "float or string (VIX index value)",
  "indicators": {
    "sp500_yield": "string or number",
    "dxy_index": "string or number",
    "crypto_sentiment": "string or number",
    "put_call_ratio": "string or number"
  },
  "summary": "string (paragraph describing market situation)"
}
```

**Frontend Usage:** `MarketView.jsx`
- Displays mood/risk/volatility as 3 large metric cards
- Renders indicators in 4-column grid
- Shows mood as color-coded progress bar
- Displays risk status with color coding
- Shows alert if risk is "High"

---

## 5. Debate Endpoint

**Path:** `GET /debate/{stock}`

**Path Parameters:**
- `stock`: string (stock symbol)

**Expected Response:**
```json
{
  "bull_case": [
    "string (first bull argument)",
    "string (second bull argument)",
    "string (third bull argument)"
  ],
  "bear_case": [
    "string (first bear argument)",
    "string (second bear argument)",
    "string (third bear argument)"
  ],
  "verdict": "string (Opportunity, Risk, Neutral)"
}
```

**Frontend Usage:** `DebateView.jsx`
- Displays bull_case points in numbered green-bordered card
- Displays bear_case points in numbered red-bordered card
- Shows verdict with color-coded background:
  - Opportunity = green
  - Risk = red
  - Neutral = yellow

---

## 6. Trace Endpoint

**Path:** `GET /trace/{stock}`

**Path Parameters:**
- `stock`: string (stock symbol)

**Expected Response:**
```json
{
  "signal": "string (the detected signal, e.g., 'BUY')",
  "logic_flow": [
    "string (first detection step, e.g., 'Price broke above 200-day MA')",
    "string (next step)",
    "string (next step)",
    "string (final conclusion)"
  ]
}
```

**Frontend Usage:** `TraceView.jsx`
- Displays signal type in header with Zap icon
- Renders logic_flow as vertical timeline
- Each step has numbered circle and hover card
- Shows arrow between steps
- Conclusion displayed in highlighted box

---

## 7. Simulate Endpoint

**Path:** `POST /simulate`

**Request Body:**
```json
{
  "scenario": "string (bull_market, bear_market, recession, high_inflation, rate_hike, tech_crash)",
  "portfolio": [
    {
      "symbol": "string (stock symbol)",
      "quantity": "integer (number of shares)",
      "weight": "float (portfolio weight percentage)"
    }
  ]
}
```

**Expected Response:**
```json
{
  "expected_return": "float (e.g., 0.15 for 15% return)",
  "volatility": "float (annual volatility e.g., 0.20 for 20%)",
  "max_drawdown": "float (maximum drawdown e.g., -0.25 for -25%)",
  "sharpe_ratio": "float (risk-adjusted return metric)",
  "analysis": "string (paragraph explaining simulation results)",
  "recommendation": "string (actionable recommendation text)"
}
```

**Frontend Usage:** `SimulateView.jsx`
- Displays metrics in 4-column grid (returns, volatility, drawdown, sharpe)
- Shows expected_return in green if positive, red if negative
- Displays analysis in text area format
- Shows recommendation in highlighted box

---

## Error Handling

All endpoints should return error responses in this format:

**Error Response (Any Endpoint):**
```json
{
  "detail": "string (error message)",
  "code": "string (error code, optional)"
}
```

**HTTP Status Codes:**
- `200/201`: Success
- `400`: Bad request (invalid parameters)
- `404`: Not found (stock not found, etc)
- `500`: Server error

**Frontend Behavior:**
- Displays `error.response.data.detail` or `error.message` to user
- Shows ErrorMessage component with error text
- Provides retry button if retryable
- Logs error to console for debugging

---

## Response Format Guidelines

### Numeric Values
- **Floats/Percentages**: Use 0.85 for 85%, not "85%"
- **Prices**: Use float (e.g., 154.32)
- **Large Numbers**: Can be string or number (e.g., "1.2B" or 1200000000)

### String Values
- **Dates**: Use ISO 8601 format (e.g., "2024-01-15T10:30:00Z")
- **Text**: Can be single sentence or multi-paragraph
- **Enums**: Use uppercase for status/type (BUY, SELL, HOLD)

### Colors/Icons
Frontend handles all color mapping based on type/value:
- No need to send hex colors
- Frontend maps "BUY" → green, "SELL" → red, etc.

### Null/Missing Values
- Can omit optional fields entirely
- Or send null for null values
- Frontend handles both gracefully

---

## Data Validation Notes

- **Confidence values** must be between 0.0 and 1.0
- **Portfolio weight** percentages should sum to 100 (or close)
- **Returns/volatility** should be decimals (0.15 = 15%)
- **Stock symbols** should be uppercase
- All required fields must be present

---

## Testing with Frontend

To verify your API returns correct format:

1. Start frontend: `npm run dev` (at port 5173)
2. Start backend: `python main.py` (at port 8000)
3. Check browser console for errors
4. Use browser DevTools Network tab to inspect responses
5. Verify all fields match expected types

---

## Example Requests & Responses

### Example: Analyze
```bash
curl -X POST http://localhost:8000/analyze \
  -H "Content-Type: application/json" \
  -d '{"query":"Should I buy?","stock":"AAPL"}'
```

### Example: Radar
```bash
curl http://localhost:8000/radar?top_k=5
```

### Example: Debate
```bash
curl http://localhost:8000/debate/TSLA
```

---

## Version History

- **v1.0** (Current): Initial API format specification
- Backend should follow these specs exactly for full frontend compatibility
