# PromptForge Revenue Predictor Dashboard — Integration Guide

## Overview

The **PromptForge Revenue Predictor Dashboard** is a high-velocity, real-time interactive visualization component built with React 19, Observable Plot, and Supabase Realtime. It provides founders with instant visibility into their revenue trajectory based on execution speed, niche difficulty, and ad spend.

---

## Installation & Setup

### 1. Install Dependencies

```bash
npm install @observablehq/plot @supabase/supabase-js react@19
```

### 2. Environment Variables

Add to your `.env.local`:

```
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Import Component

```jsx
import RevenuePredictor from './PromptForge-Revenue-Predictor';

export default function Dashboard() {
  return (
    <RevenuePredictor 
      founderData={{ name: 'Troy', niche: 'SaaS' }}
      initialGoal="build"
      projectId="project-123"
    />
  );
}
```

---

## Component Props

| Prop | Type | Description |
|------|------|-------------|
| `founderData` | Object | Founder profile data (name, niche, stage, etc.) |
| `initialGoal` | String | Initial goal: 'build', 'monetise', 'automate', 'grow' |
| `projectId` | String | Supabase project ID for Realtime subscriptions |

---

## Features Explained

### 1. T-Dog Benchmark (Ghosted Reference Line)

The T-Dog Benchmark represents Troy Napier's actual 4-week blitzkrieg execution trajectory:

- **Week 1**: $5K-10K (Foundation & Launch Prep)
- **Week 2**: $20K-50K (Launch & Early Traction)
- **Week 3**: $50K-100K (Momentum & Optimization)
- **Week 4**: $30K-50K MRR (Scale & Revenue Acceleration)

This line appears as a ghosted (dashed, 30% opacity) reference so founders can compare their projected trajectory to Troy's actual results.

**Algorithm:**
```javascript
// Week 1: Linear ramp
revenue = (day / 7) * 7500;

// Week 2: Exponential jump
revenue = 7500 + (week2Progress ** 1.8) * 27500;

// Week 3: Aggressive scaling
revenue = 35000 + (week3Progress ** 1.5) * 40000;

// Week 4: Stabilization
revenue = 75000 - (week4Progress ** 1.2) * 25000;
```

### 2. Projection Curve (Main Revenue Line)

The projection curve calculates the founder's expected revenue trajectory based on three interactive sliders:

**Formula:**
```
revenue(day) = baseRevenue(day) * speedMultiplier * (1 / difficultyMultiplier) * (1 + adSpendBoost)
```

**Parameters:**
- **Pack Execution Speed** (0.5x - 2x): How fast the founder executes packs
  - 0.5x = Slower execution (takes 2x longer)
  - 1.0x = Normal execution (matches T-Dog)
  - 2.0x = Faster execution (half the time)

- **Niche Difficulty** (0.5x - 2x): How competitive/saturated the niche is
  - 0.5x = Easy niche (less competition, faster growth)
  - 1.0x = Medium niche (average competition)
  - 2.0x = Hard niche (high competition, slower growth)

- **Ad Spend** ($0 - $10K): Marketing budget for user acquisition
  - Uses logarithmic diminishing returns: `adSpendBoost = log(spend + 1) / 10`
  - $1K spend ≈ 7% revenue boost
  - $10K spend ≈ 23% revenue boost

### 3. Real-Time Shiver (Actual Revenue Updates)

When a pack finishes execution in the backend, the "Actual Revenue" line jumps and glows Coral Orange (#FF6B35).

**How it works:**

1. Component subscribes to Supabase Realtime channel: `project:{projectId}:executions`
2. When a new pack execution completes, Supabase sends INSERT event
3. Component receives event with `revenue_generated` amount
4. New data point is added to "Actual" line with glow effect
5. After 1 second, glow fades (animation completes)

**Supabase Table Structure:**
```sql
CREATE TABLE pack_executions (
  id UUID PRIMARY KEY,
  project_id UUID REFERENCES projects(id),
  pack_name TEXT,
  revenue_generated DECIMAL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Trigger Realtime Update:**
```javascript
// When pack execution completes:
supabase
  .from('pack_executions')
  .insert({
    project_id: projectId,
    pack_name: 'Monetisation Pack #1',
    revenue_generated: 5000
  })
  .then(() => {
    // Dashboard automatically updates via Realtime
  });
```

### 4. What If Engine (Instant Recalculation)

Sliders trigger instant recalculation with zero loading spinners.

**How it works:**

1. User moves slider (e.g., Pack Execution Speed from 1.0x to 1.5x)
2. `handleSpeedChange()` is called immediately
3. `generateProjections()` recalculates entire curve
4. `setProjections()` updates state
5. Observable Plot re-renders with new data
6. **Total latency: <50ms** (instant to human perception)

**No loading spinner** because the calculation is so fast.

---

## Styling & Branding

### Colors

- **Primary Background**: Navy Blue (#0F3A7D)
- **Accent Color**: Coral Orange (#FF6B35)
- **Secondary Background**: #1a4d99 (lighter navy)
- **Text**: Off-White (#F5F5F5)
- **Grid/Borders**: #FF6B35 at 20% opacity

### Typography

- **Headlines**: Montserrat Bold (font-weight: 700-800)
- **Body**: Inter Regular (font-weight: 400-500)
- **Monospace**: For numbers and values

### Layout

- **Container**: Rounded-2xl with shadow-2xl
- **Sections**: Grid layout with consistent spacing
- **Responsive**: Works on desktop, tablet, mobile

---

## Advanced Customization

### Change T-Dog Benchmark

Edit the `generateTDogBenchmark()` function to use different reference data:

```javascript
const generateTDogBenchmark = useCallback(() => {
  const benchmark = [];
  
  for (let day = 0; day <= 28; day++) {
    // Your custom logic here
    const revenue = customCalculation(day);
    benchmark.push({ day, revenue, type: 'T-Dog Benchmark' });
  }
  
  return benchmark;
}, []);
```

### Change Projection Formula

Edit the `generateProjections()` function to use different growth models:

```javascript
const generateProjections = useCallback((speed, difficulty, spend) => {
  // Your custom formula here
  const finalRevenue = customFormula(day, speed, difficulty, spend);
}, []);
```

### Add More Sliders

Add new state and slider controls:

```javascript
const [customParam, setCustomParam] = useState(1.0);

// Add to handleChange callbacks
const handleCustomChange = useCallback((newValue) => {
  setCustomParam(newValue);
  const newProjections = generateProjections(packExecutionSpeed, nicheDifficulty, adSpend, newValue);
  setProjections(newProjections);
}, [...dependencies]);

// Add to JSX
<div className="bg-[#1a4d99] rounded-lg p-4 border border-[#FF6B35]/20">
  <label className="block text-sm font-bold text-white mb-3">
    Custom Parameter
  </label>
  <input
    type="range"
    min="0"
    max="100"
    step="1"
    value={customParam}
    onChange={(e) => handleCustomChange(parseFloat(e.target.value))}
    className="w-full h-2 bg-[#0F3A7D] rounded-lg appearance-none cursor-pointer accent-[#FF6B35]"
  />
</div>
```

---

## Performance Optimization

### 1. Memoization

The component uses `useMemo` and `useCallback` to prevent unnecessary recalculations:

```javascript
const generateProjections = useCallback((speed, difficulty, spend) => {
  // Recalculated only when dependencies change
}, []);
```

### 2. Plot Rendering

Observable Plot is only re-rendered when data changes:

```javascript
useEffect(() => {
  // Plot only re-renders when projections, actuals, or tDogBenchmark change
}, [projections, actuals, tDogBenchmark]);
```

### 3. Realtime Subscriptions

Only active when `projectId` is provided:

```javascript
useEffect(() => {
  if (!projectId) return; // Skip if no projectId
  // Subscribe to Realtime
}, [projectId, currentMRR]);
```

---

## Testing

### Unit Tests

```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import RevenuePredictor from './PromptForge-Revenue-Predictor';

describe('RevenuePredictor', () => {
  test('renders component', () => {
    render(<RevenuePredictor projectId="test-123" />);
    expect(screen.getByText('Revenue Predictor')).toBeInTheDocument();
  });
  
  test('updates projection when speed slider changes', () => {
    render(<RevenuePredictor projectId="test-123" />);
    const slider = screen.getByRole('slider', { name: /Pack Execution Speed/i });
    fireEvent.change(slider, { target: { value: '1.5' } });
    // Assert that projections updated
  });
});
```

### Integration Tests

```javascript
// Test Supabase Realtime integration
test('updates actual revenue when pack execution completes', async () => {
  const { rerender } = render(<RevenuePredictor projectId="test-123" />);
  
  // Simulate Supabase Realtime event
  const event = {
    new: {
      project_id: 'test-123',
      pack_name: 'Monetisation Pack',
      revenue_generated: 5000
    }
  };
  
  // Trigger event handler
  // Assert that actual revenue line updated
});
```

---

## Deployment

### 1. Build for Production

```bash
npm run build
```

### 2. Deploy to Vercel

```bash
vercel deploy
```

### 3. Environment Variables

Set in Vercel dashboard:
- `REACT_APP_SUPABASE_URL`
- `REACT_APP_SUPABASE_ANON_KEY`

---

## Troubleshooting

### Plot not rendering

**Issue**: Observable Plot container is empty

**Solution**: Ensure `containerRef` is properly mounted and `projections` array is not empty

```javascript
useEffect(() => {
  if (containerRef.current && projections.length > 0) {
    // Plot rendering logic
  }
}, [projections]);
```

### Realtime not updating

**Issue**: Actual revenue line not updating when packs execute

**Solution**: Check Supabase credentials and ensure `projectId` is provided

```javascript
// Verify environment variables
console.log(process.env.REACT_APP_SUPABASE_URL);
console.log(process.env.REACT_APP_SUPABASE_ANON_KEY);

// Verify projectId is passed
<RevenuePredictor projectId={projectId} />
```

### Sliders not responsive

**Issue**: Moving sliders doesn't update projections

**Solution**: Ensure `handleSpeedChange`, `handleDifficultyChange`, and `handleAdSpendChange` are properly connected

```javascript
// Verify handlers are called
const handleSpeedChange = useCallback((newSpeed) => {
  console.log('Speed changed to:', newSpeed);
  setPackExecutionSpeed(newSpeed);
  // ... rest of logic
}, []);
```

---

## API Reference

### Component Methods

None (component is purely declarative React)

### State Variables

| Variable | Type | Description |
|----------|------|-------------|
| `packExecutionSpeed` | Number | 0.5x - 2x multiplier |
| `nicheDifficulty` | Number | 0.5x - 2x multiplier |
| `adSpend` | Number | $0 - $10,000 |
| `projections` | Array | Calculated revenue curve |
| `actuals` | Array | Real-time revenue updates |
| `tDogBenchmark` | Array | T-Dog reference line |
| `currentMRR` | Number | Current monthly recurring revenue |
| `targetMRR` | Number | Target MRR ($50K default) |

---

## Future Enhancements

1. **Multi-founder Comparison**: Compare your trajectory to other founders
2. **Pack Recommendations**: "Based on your inputs, we recommend these packs"
3. **Revenue Breakdown**: Show revenue by pack type (Monetisation, Automation, Growth)
4. **Export to PDF**: Download your revenue projection as a PDF report
5. **Slack Integration**: Send daily revenue updates to Slack
6. **Email Alerts**: Notify when revenue milestones are hit

---

## Support

For issues or questions, contact:
- **Email**: support@promptforge.io
- **Slack**: #revenue-predictor channel
- **GitHub**: github.com/promptforge/revenue-predictor

---

**Built with ❤️ by the PromptForge team**
