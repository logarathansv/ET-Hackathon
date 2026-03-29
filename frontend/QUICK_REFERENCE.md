# Frontend Quick Reference Guide

## Installation & Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies (first time only)
npm install

# Start development server (hot reload)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

## Common Development Tasks

### Adding a New View Component

1. **Create component file** `src/components/NewView.jsx`:
```jsx
import React, { useState, useEffect } from 'react';
import { apiFunction } from '../services/api';
import { LoadingSpinner, ErrorMessage } from './LoadingSpinner';

const NewView = ({ stock }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!stock) return;
      try {
        setLoading(true);
        setError(null);
        const result = await apiFunction(stock);
        setData(result);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [stock]);

  if (loading) return <LoadingSpinner message="Loading..." />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div className="space-y-6">
      {/* Your content here */}
    </div>
  );
};

export default NewView;
```

2. **Add to Dashboard** in `src/components/Dashboard.jsx`:
```jsx
// Add to tabs array
const tabs = [
  // ... existing tabs
  { id: 'new', label: 'New View', icon: IconName },
];

// Add to renderContent switch
case 'new':
  return <NewView stock={selectedStock} />;
```

3. **Import icon** from `lucide-react`:
```jsx
import { IconName } from 'lucide-react';
```

### Adding a New API Endpoint

1. **Create in** `src/services/api.js`:
```jsx
/**
 * Fetch new data
 * GET /endpoint?param=value
 */
export const newEndpoint = async (param) => {
  return apiClient.get('/endpoint', { params: { param } });
};
```

2. **Use in component**:
```jsx
import { newEndpoint } from '../services/api';

const result = await newEndpoint(value);
```

### Using Formatters

```jsx
import { formatCurrency, formatPercent } from '../utils/formatters';

// Format currency
<span>{formatCurrency(123456.78)}</span>  // $123456.78

// Format percentage
<span>{formatPercent(0.25)}</span>  // +25.00%

// Format number with commas
<span>{formatNumber(1000000)}</span>  // 1,000,000

// Get color class
<span className={getValueColor(5.5)}>↑ 5.5%</span>  // Green
<span className={getValueColor(-2)}>↓ -2%</span>   // Red
```

### Using Color Utilities

```jsx
import { getVerdictColor, getActionColor } from '../utils/colors';

// Verdict colors
<div className={getVerdictColor('Opportunity')}>Buy</div>
// Returns: 'bg-green-500/20 text-green-400 border-green-500/50'

// Action colors
<div className={getActionColor('Avoid')}>Avoid</div>
// Returns: 'text-red-500'

// Signal type colors
<div className={getSignalTypeColor('Risk Signal')}>Risk</div>
```

## Tailwind CSS Common Classes

### Spacing
```
p-4        # Padding all sides
px-4       # Padding horizontal
py-4       # Padding vertical
m-4        # Margin all sides
gap-4      # Gap in flex/grid
```

### Colors
```
text-white       # White text
text-gray-400    # Gray text
bg-amber-500/10  # Amber background with opacity
border-blue-500  # Blue border
```

### Layout
```
flex               # Flexbox display
grid               # Grid display
grid-cols-2        # 2 columns
md:grid-cols-4     # 4 columns on medium+ screens
gap-4              # Gap between items
```

### Responsive
```
md:flex-row        # Flex row on medium+ screens
lg:gap-6           # Gap 6 on large+ screens
flex-col md:flex-row  # Column on mobile, row on desktop
```

### Effects
```
rounded-xl         # Rounded corners
shadow-lg          # Box shadow
border border-gray-700
opacity-50         # 50% opacity
hover:bg-gray-700  # Hover state
transition-colors  # CSS transition
```

## Component Patterns

### Loading State
```jsx
if (loading) return <LoadingSpinner message="Loading data..." />;
```

### Error State
```jsx
if (error) return <ErrorMessage error={error} />;
```

### Empty State
```jsx
if (!data) {
  return (
    <div className="p-8 rounded-xl bg-slate-800 border border-slate-700 text-center">
      <p className="text-gray-400">No data available</p>
    </div>
  );
}
```

### Data Card
```jsx
<div className="bg-slate-700/30 border border-slate-700 rounded-xl p-6">
  <p className="text-xs text-gray-400 uppercase font-semibold mb-2">Label</p>
  <p className="text-2xl font-bold text-white">{data}</p>
</div>
```

### Form Input
```jsx
<input
  type="text"
  placeholder="Enter value..."
  value={value}
  onChange={(e) => setValue(e.target.value)}
  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
/>
```

### Button
```jsx
<button
  onClick={handleClick}
  className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium rounded-lg transition-all disabled:opacity-50"
  disabled={loading}
>
  Click Me
</button>
```

### Tab Navigation
```jsx
<div className="flex gap-1 border-b border-slate-700">
  {tabs.map((tab) => (
    <button
      key={tab.id}
      onClick={() => setActiveTab(tab.id)}
      className={`px-6 py-3 font-medium border-b-2 transition-all ${
        activeTab === tab.id
          ? 'border-amber-500 text-amber-400'
          : 'border-transparent text-gray-400 hover:text-white'
      }`}
    >
      {tab.label}
    </button>
  ))}
</div>
```

## Icon Usage

```jsx
import { IconName, IconName2 } from 'lucide-react';

// Use as React component
<IconName className="w-6 h-6 text-amber-400" />

// Common sizes
w-4 h-4    # 16px (small)
w-5 h-5    # 20px (medium)
w-6 h-6    # 24px (default)
w-8 h-8    # 32px (large)
w-12 h-12  # 48px (very large)
```

**Common Icons:**
- `BarChart3` - Analytics
- `TrendingUp` - Bullish
- `TrendingDown` - Bearish
- `Zap` - Signal/Energy
- `Radar` - Detection
- `AlertTriangle` - Warning
- `Search` - Find
- `Send` - Submit
- `ChevronRight` - Direction
- `Download` - Export
- `Plus` - Add
- `X` - Close
- `Settings` - Configuration

## Environment Setup

Create `.env.local` in frontend directory:

```env
VITE_API_BASE_URL=http://localhost:8000
```

Access in component:
```jsx
const apiUrl = import.meta.env.VITE_API_BASE_URL;
```

## Debugging

### Check API Response
1. Open browser DevTools (F12)
2. Go to Network tab
3. Look for API calls
4. Click on request, view Response tab

### Console Logs
```jsx
// In component
useEffect(() => {
  console.log('Component mounted', data);
}, [data]);

// In api.js
console.error('API Error:', error.response?.data || error.message);
```

### Hot Module Reload Issues
```bash
# If styles/content not updating:
1. Check file is saved
2. Refresh browser (Cmd+Shift+R)
3. Check npm run dev is still running
4. Restart dev server if needed
```

## Performance Tips

1. **Use keys in lists**
```jsx
{data.map((item) => (
  <div key={item.id}>{item.name}</div>
))}
```

2. **Lazy load components**
```jsx
const HeavyComponent = React.lazy(() => import('./Heavy'));
// Use with Suspense
```

3. **Avoid inline functions in render**
```jsx
// Bad
onClick={() => doSomething(id)}
// Good
const handleClick = useCallback(() => doSomething(id), [id]);
```

4. **Minimize re-renders**
```jsx
// Use proper dependency arrays
useEffect(() => {
  // ...
}, [stock]); // Only re-run when stock changes
```

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| API calls fail with CORS error | Check backend CORS headers, verify proxy in vite.config.js |
| Styles not applying | Ensure class names are in JSX (not dynamic strings), rebuild |
| Component not updating | Check useEffect dependencies, verify state is being set |
| Hot reload not working | Restart `npm run dev` |
| Build errors with npm install | Delete node_modules, npm cache clean, npm install again |
| Port 5173 already in use | Kill process on port or specify different port in vite.config.js |

## Useful URLs

- **Dev Server**: `http://localhost:5173`
- **Backend API**: `http://localhost:8000`
- **Network Tab**: DevTools → Network
- **Console**: DevTools → Console
- **React DevTools**: Browser Extension

## Important Files to Know

| File | Purpose |
|------|---------|
| `src/App.jsx` | Root component |
| `src/components/Dashboard.jsx` | Main navigation and layout |
| `src/services/api.js` | All API calls |
| `src/utils/colors.js` | Color mappings |
| `src/utils/formatters.js` | Data formatting |
| `tailwind.config.js` | Tailwind theme |
| `vite.config.js` | Vite configuration |
| `package.json` | Dependencies and scripts |

## Useful Commands

```bash
# Start development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Check for unused imports
npm run lint

# Update packages (careful!)
npm update

# Check outdated packages
npm outdated

# Clean install
rm -rf node_modules && npm install
```
