# Frontend Architecture & Setup Guide

## Quick Start

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server (hot reload enabled)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will run at `http://localhost:5173`

## Architecture Overview

### Component Hierarchy

```
App (root)
└── Dashboard (main layout)
    ├── Navigation Tabs
    └── Content Router
        ├── AnalyzeView
        ├── SignalRadarView
        ├── TraceView
        ├── MarketView
        ├── DebateView
        └── SimulateView
```

### Key Components

#### Dashboard (`src/components/Dashboard.jsx`)
- Main container with sticky header and navigation
- Tabs for switching between different views
- Manages selectedStock state for cross-view communication

#### AnalyzeView (`src/components/AnalyzeView.jsx`)
- Stock symbol input and query textarea
- Calls `/analyze` endpoint with LLM analysis
- Displays analysis results, metrics, and recommendations
- Emits stock selection to parent for other views

#### SignalRadarView (`src/components/SignalRadarView.jsx`)
- Displays signal radar data from `/radar` endpoint
- Shows market mood, volatility, and total signals
- Card-based grid of top trading signals
- Includes confidence bars and signal reasoning

#### TraceView (`src/components/TraceView.jsx`)
- Shows signal detection logic flow
- Timeline-style display of detection steps
- Uses selectedStock from parent component
- Calls `/trace/{stock}` endpoint

#### MarketView (`src/components/MarketView.jsx`)
- Overall market metrics and indicators
- Market mood, risk level, and volatility scores
- Market summary and risk alerts
- Calls `/market-mood` endpoint

#### DebateView (`src/components/DebateView.jsx`)
- Bull case vs bear case analysis
- Uses selectedStock from parent
- Calls `/debate/{stock}` endpoint
- Tabbed interface for different arguments

#### SimulateView (`src/components/SimulateView.jsx`)
- Market scenario selection (6 scenarios)
- Portfolio editor with editable holdings
- Simulation results with performance metrics
- Calls `/simulate` endpoint with POST

### Service Layer (`src/services/api.js`)

All API calls go through centralized Axios client with:
- Base URL configuration (defaults to `http://127.0.0.1:8000`)
- 15-second timeout
- Response/error interceptors
- Automatic error logging

**Available APIs:**
- `getRadar(topK)` - Signal radar data
- `getStockSignal(stock)` - Signal for specific stock
- `getMarketMood()` - Market metrics
- `getDebate(stock)` - Bull/bear analysis
- `getTrace(stock)` - Signal detection logic
- `simulate(scenario, portfolio)` - Trading simulation
- `analyze(query, stock, portfolio)` - LLM analysis

### Utility Files

#### `src/utils/colors.js`
- Color mappings for different signal types
- Verdict color getters

#### `src/utils/formatters.js`
- `formatCurrency()` - Format as currency
- `formatPercent()` - Format as percentage
- `formatNumber()` - Thousands separator
- `formatDate()` - Date formatting
- `formatDuration()` - Duration formatting
- `getValueColor()` - Color CSS class based on value
- `getTrendArrow()` - Arrow based on trend direction
- `truncateText()` - Text truncation
- `formatSignalType()` - Signal type display text
- `formatConfidence()` - Confidence score with label

## Styling

### Tailwind Configuration
- Dark theme with `slate-900/slate-800` base
- Custom colors: amber (primary), blue (secondary), purple (accent)
- Custom shadows for neon effects
- Extended shadows: `shadow-neon-amber`, `shadow-neon-blue`, `shadow-neon-green`

### Custom Utilities (src/index.css)
- `gradient-primary` - Main background gradient
- `gradient-accent` - Accent gradient
- `glass-effect` - Glassmorphism effect
- `animate-pulse-glow` - Pulsing animation

### Color Scheme
- **Primary**: Amber (#fb923c)
- **Secondary**: Blue (#3b82f6)
- **Accent**: Purple
- **Success**: Green (#22c55e)
- **Error**: Red (#ef4444)
- **Background**: Slate (#0f172a)

## Development Workflow

### Adding a New Component

1. Create in `src/components/YourComponent.jsx`
2. Import in Dashboard.jsx if it's a view
3. Add tab configuration if it's a top-level view
4. Use LoadingSpinner and ErrorMessage for states
5. Follow component naming: PascalCase + "View" for view components

### Adding an API Endpoint

1. Add function in `src/services/api.js`
2. Use apiClient with proper method (GET/POST)
3. Include JSDoc comments
4. Handle errors in component using try/catch

### Styling Components

1. Use Tailwind classes exclusively
2. Follow dark theme patterns
3. Use custom shadows for depth
4. Ensure focus states for accessibility
5. Use hover states for interactivity

## API Integration

The frontend expects these backend endpoints:

```
GET  /radar?top_k=5
GET  /radar/signal/{stock}
GET  /market-mood
GET  /debate/{stock}
GET  /trace/{stock}
POST /simulate
POST /analyze
```

See `backend/FRONTEND_API_REFERENCE.md` for detailed endpoint specs.

## Performance Optimizations

- Code splitting with Vite (automatic)
- Component lazy loading when needed
- Image optimization
- Minification in production
- CSS tree-shaking via Tailwind
- No external font loaders (system fonts)

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES2020+ syntax
- CSS Grid and Flexbox
- Local Storage for state persistence (future)

## Troubleshooting

**API calls fail with CORS errors:**
- Ensure backend is running on `http://localhost:8000`
- Check `vite.config.js` proxy configuration
- Verify backend has CORS headers enabled

**Styles not applying:**
- Rebuild Tailwind cache: `rm -rf node_modules/.vite`
- Ensure all class names are in HTML/JSX (dynamic classes won't work)
- Check `tailwind.config.js` includes all template paths

**Hot reload not working:**
- Check Vite dev server is running
- Verify file is in `src/` directory
- Try refreshing browser manually

**Components not rendering:**
- Check browser console for JavaScript errors
- Verify component is imported in parent
- Check component export is default export
- Verify props are passed correctly

## Environment Variables

Create `.env.local` to override defaults:

```env
VITE_API_BASE_URL=http://localhost:8000
```

Note: Vite requires `VITE_` prefix for client-side variables.

## Production Deployment

1. Build: `npm run build`
2. Output in `dist/` directory
3. Deploy `dist/` folder to static hosting
4. Point API requests to production backend
5. Update `VITE_API_BASE_URL` for production

## Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [Lucide React Icons](https://lucide.dev)
- [Axios Documentation](https://axios-http.com)
