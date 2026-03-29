# Stock Intelligence Frontend

A modern React-based frontend for the Stock Intelligence platform, featuring real-time stock analysis, signal detection, and AI-powered insights.

## Features

- **Real-time Analysis**: Analyze stock patterns with technical and fundamental indicators
- **Signal Radar**: Visualize detected trading signals across multiple stocks
- **Trace View**: Follow the logic behind signal detection step-by-step
- **Market Overview**: View broader market trends and correlations
- **Debate View**: See different perspectives on stock analysis
- **Simulation**: Simulate trading strategies and backtest performance

## Tech Stack

- **React 18** - UI framework
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Modern icon library
- **Axios** - HTTP client for API calls

## Getting Started

### Prerequisites
- Node.js 16+ / npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The frontend will be available at `http://localhost:5173`

API requests are proxied to `http://localhost:8000` (backend server).

## Project Structure

```
src/
├── components/        # React components
│   ├── AnalyzeView.jsx       # Stock analysis view
│   ├── SignalRadarView.jsx    # Signal detection radar
│   ├── TraceView.jsx          # Signal trace logic
│   ├── MarketView.jsx         # Market overview
│   ├── DebateView.jsx         # Analysis debate
│   ├── SimulateView.jsx       # Trading simulation
│   ├── Dashboard.jsx          # Main dashboard layout
│   └── LoadingSpinner.jsx     # Loading/error states
├── services/          # API integration
│   └── api.js        # API client functions
├── utils/            # Utility functions
│   └── formatters.js # Data formatting helpers
├── App.jsx           # Root component
├── App.css           # App styles
├── index.css         # Global styles
└── main.jsx          # Entry point
```

## Available APIs

The frontend communicates with these backend endpoints:

- `GET /api/analyze?symbol=AAPL` - Analyze a stock
- `GET /api/signals` - Get all detected signals
- `GET /api/radar` - Get signal radar data
- `GET /api/trace?symbol=AAPL` - Get signal trace logic
- `GET /api/market` - Get market overview
- `POST /api/debate` - Get analysis debate
- `POST /api/simulate` - Simulate trading strategy

## Environment Variables

Create a `.env.local` file if you need to customize the API endpoint:

```env
VITE_API_BASE_URL=http://localhost:8000
```

## Development

### Hot Module Replacement (HMR)
Changes to React components are automatically reflected in the browser without full page reload.

### ESLint
```bash
npm run lint
```

### Styling
- Uses Tailwind CSS with custom theme colors
- Custom utilities defined in `src/index.css`
- Dark theme with amber and blue accents

## Building for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` directory, ready for deployment.

## Performance Optimizations

- Code splitting with Vite
- Image optimization
- CSS tree-shaking
- Minification and compression
- Lazy loading of components

## License

Proprietary - Stock Intelligence Platform
