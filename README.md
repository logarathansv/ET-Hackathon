# Catalyst AI

Catalyst AI is an AI-powered investment intelligence platform that combines a FastAPI backend, a React dashboard, and a dedicated MCP server for tool-augmented market analysis.

It helps you move from raw market signals to explainable decisions with radar signals, sentiment-aware analysis, bull vs bear debate, scenario simulation, and reasoning traces.

## Features

- AI-driven stock analysis with structured bull case, bear case, confidence, and verdict outputs
- Signal Radar for top-ranked opportunities with urgency and confidence context
- Single-stock deep dive signals with market context and action guidance
- Market Mood endpoint for trend, volatility, and risk-level snapshots
- Debate engine for balanced opportunity vs risk reasoning
- Scenario simulation for portfolio impact under custom market events
- Explainability trace flow to inspect how a signal was derived
- MCP server with specialized tools for price, sentiment, filings, deals, technicals, and portfolio context

## Monorepo Structure

```text
.
├── backend/      # FastAPI app with routes, services, and analysis logic
├── frontend/     # React + Vite dashboard UI
└── mcp-server/   # FastMCP server exposing financial analysis tools
```

## Tech Stack

- Backend: FastAPI, Pydantic, Uvicorn, HTTPX, yfinance
- Frontend: React 18, Vite, Tailwind CSS, Axios
- MCP Layer: FastMCP + modular finance tools

## Backend API (Core Endpoints)

- `GET /radar?top_k=5` - Top ranked investment signals
- `GET /radar/signal/{stock}` - Detailed signal for one stock
- `GET /market-mood` - Market trend and risk snapshot
- `GET /debate/{stock}` - Bull vs bear argument set + verdict
- `GET /trace/{stock}` - Signal reasoning flow
- `POST /simulate` - Portfolio impact for custom scenarios
- `POST /analyze` - AI analysis endpoint (query + stock + optional portfolio)

## Quick Start

### 1) Clone and enter the repository

```bash
git clone <your-repo-url>
cd HProject
```

### 2) Configure environment variables

Create a root `.env` file for API keys and runtime configuration used by backend and MCP services.

Example variables typically needed:

```env
OPENAI_API_KEY=your_key
FINNHUB_API_KEY=your_key
NEWS_API_KEY=your_key
```

## Run the Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

Backend will be available at `http://localhost:8000`.

## Run the Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend will be available at `http://localhost:5173`.

## Run the MCP Server (Optional)

```bash
cd mcp-server
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python server.py
```

## Typical Development Flow

1. Start backend on port 8000.
2. Start frontend on port 5173.
3. (Optional) Start MCP server for tool-augmented analysis features.
4. Use the dashboard to run radar, debate, trace, simulate, and analyze workflows.

## Why Catalyst AI

Catalyst AI is designed for explainable intelligence, not just predictions.

- You get actionable signals and the reasoning behind them
- You can compare bullish and bearish narratives before deciding
- You can simulate what-if scenarios before taking portfolio risk

## Roadmap Ideas

- Authentication and user portfolios
- Historical backtesting UI and strategy library
- Alerting for sentiment or technical trigger changes
- Deployment recipes (Docker + cloud hosting)

## License

This project is currently unlicensed. Add a LICENSE file before public distribution.
