# PromptForge — Final System Specification
## Complete Technical Specification for Production Implementation

---

# PART 1: REFINED PACK COMPOSER ENGINE

## 1. Purpose

The **Pack Composer Engine** dynamically assembles optimal pack sequences based on:
- **Goal**: build, monetise, automate, grow, optimise, full-journey
- **Asset Type**: SaaS, web app, mobile app, Chrome extension, Notion template, course, marketplace product, content system, AI tool
- **Niche**: finance, fitness, creator, education, parenting, e-commerce, etc.
- **Stage**: idea, pre-MVP, MVP, post-launch, scaling, plateaued
- **Growth Channel**: organic, viral, paid, hybrid, unknown
- **Time Horizon**: weeks available (2, 4, 8, 12+)
- **Budget**: low, medium, high
- **Skill Level**: beginner, intermediate, advanced

**Key Principle**: The Composer does NOT generate prompts; it selects and sequences packs from the 60-pack ecosystem.

---

## 2. Inputs & Data Model

### User Inputs
```typescript
interface ComposerUserInput {
  goal: 'build' | 'monetise' | 'automate' | 'grow' | 'optimise' | 'full-journey';
  assetType: string;  // SaaS, web app, mobile app, etc.
  niche: string;      // finance, fitness, creator, etc.
  stage: 'idea' | 'pre-MVP' | 'MVP' | 'post-launch' | 'scaling' | 'plateaued';
  growthChannel?: 'organic' | 'viral' | 'paid' | 'hybrid' | 'unknown';
  timeHorizonWeeks: number;  // 2, 4, 8, 12+
  budget: 'low' | 'medium' | 'high';
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
}
```

### Pack Metadata
```typescript
interface PackMetadata {
  id: string;
  name: string;
  category: 'MVP' | 'Monetisation' | 'Automation' | 'Niche' | 'AssetType' | 'Growth';
  phaseTags: string[];  // Discovery, Build, Monetise, Automate, Grow, Optimise
  assetTypes: string[];
  niches: string[];
  goals: string[];
  growthChannels: string[];
  complexity: 1 | 2 | 3;  // 1=simple, 3=complex
  timeCost: number;  // estimated hours
  creditCost: number;
  dependencies: string[];  // pack IDs that must precede this
  successRate: number;  // 0-100%
  userRating: number;  // 0-5
  completionRate: number;  // 0-100%
}
```

---

## 3. Core Logic

### 3.1 Normalisation

Map raw user answers to internal enums. Apply defaults if missing:
- `growthChannel` = 'hybrid' if not specified
- `stage` = 'idea' if user has no product yet
- `skillLevel` = 'beginner' if not specified

### 3.2 Phase Mapping

Based on stage and goal, determine which phases are in scope:

| Stage | Phases |
|-------|--------|
| Idea / pre-MVP | Discovery, Build |
| MVP | Build, Monetise |
| Post-launch | Monetise, Automate, Grow |
| Scaling / plateaued | Automate, Grow, Optimise |
| Full-journey | All six phases |

### 3.3 Candidate Pack Selection

Filter packs where:
1. `phaseTags` intersects with selected phases
2. `assetTypes` includes user asset type OR is generic
3. `niches` includes user niche OR is generic
4. `goals` includes user goal OR is multi-goal
5. `growthChannels` includes user growth channel OR is generic
6. `complexity` ≤ user skill level + 1
7. `timeCost` ≤ user time horizon (with buffer)
8. `creditCost` ≤ user credit budget (if known)

**Result**: Candidate set per phase

### 3.4 Scoring

For each candidate pack, compute a weighted score:

```
score = w₁·phase_fit + w₂·asset_fit + w₃·niche_fit + w₄·goal_fit + w₅·growth_fit - w₆·complexity_penalty
```

**Components:**
- `phase_fit`: 0–1 (how well pack aligns with selected phases)
- `asset_fit`: 0–1 (how well pack aligns with asset type)
- `niche_fit`: 0–1 (how well pack aligns with niche)
- `goal_fit`: 0–1 (how well pack aligns with goal)
- `growth_fit`: 0–1 (how well pack aligns with growth channel)
- `complexity_penalty`: scaled by skill level + time horizon

**Default Weights:**
- w₁ = 0.25 (phase fit)
- w₂ = 0.20 (asset fit)
- w₃ = 0.15 (niche fit)
- w₄ = 0.25 (goal fit)
- w₅ = 0.10 (growth fit)
- w₆ = 0.15 (complexity penalty)

**Quality Modifiers:**
- User rating: multiply score by (rating / 5)
- Completion rate: multiply score by (completionRate / 100)
- Success rate: multiply score by (successRate / 100)

### 3.5 Sequence Construction

**Per phase:**
1. Sort candidate packs by score (descending)
2. Select top N packs, constrained by:
   - `timeCost` total ≤ user time horizon
   - `creditCost` total ≤ user credit budget
3. Respect dependencies: if pack B depends on pack A, ensure A is earlier

**Final ordered sequence:**
- Phase order: Discovery → Build → Monetise → Automate → Grow → Optimise
- Within each phase: sorted by score, then dependency order

### 3.6 Output Format

Composer returns:

```typescript
interface ComposerOutput {
  sequenceId: string;
  packs: {
    packId: string;
    packName: string;
    phase: string;
    order: number;
    rationale: string;  // "Selected because…"
    timeCost: number;
    creditCost: number;
    score: number;
  }[];
  summary: {
    totalPacks: number;
    totalTime: number;
    totalCredits: number;
    estimatedSuccess: number;  // 0-100%
    riskLevel: 'low' | 'medium' | 'high';
  };
  suggestedPattern: string;  // e.g. "SaaS + Finance + Growth (Organic + Hybrid)"
  alternatives: ComposerOutput[];
}
```

---

## 4. API Surface (Composer)

### POST /composer/sequence
Generate optimal pack sequence

**Request:**
```json
{
  "goal": "build",
  "assetType": "SaaS",
  "niche": "fitness",
  "stage": "idea",
  "growthChannel": "organic",
  "timeHorizonWeeks": 8,
  "budget": "medium",
  "skillLevel": "intermediate"
}
```

**Response:**
```json
{
  "sequenceId": "seq_123",
  "packs": [...],
  "summary": {...},
  "suggestedPattern": "SaaS + Fitness + Build (Organic)",
  "alternatives": [...]
}
```

### GET /composer/recommendations
Get top 3 recommended patterns

**Request:**
```
GET /composer/recommendations?goal=build&assetType=SaaS&niche=fitness
```

**Response:**
```json
{
  "recommendations": [
    {
      "pattern": "SaaS + Fitness + Build (Organic)",
      "packs": 5,
      "estimatedTime": 40,
      "estimatedCredits": 1500,
      "successRate": 85
    },
    ...
  ]
}
```

### POST /composer/simulate
Simulate time + credit + complexity for a candidate sequence

**Request:**
```json
{
  "packIds": ["pack_1", "pack_2", "pack_3"],
  "skillLevel": "intermediate",
  "timeHorizonWeeks": 8
}
```

**Response:**
```json
{
  "totalTime": 40,
  "totalCredits": 1500,
  "complexity": 2,
  "feasible": true,
  "warnings": []
}
```

---

## 5. Failure Modes & Safeguards

| Scenario | Action |
|----------|--------|
| Insufficient data | Ask 2–3 clarifying questions |
| No strong niche match | Fall back to generic packs |
| Time horizon too short | Propose "Ultra-Light Path" (2–3 critical packs) |
| Credit budget too low | Propose "Minimal Viable Sequence" (free tier compatible) |
| Conflicting packs selected | Remove lower-scoring pack |
| Unsatisfiable constraints | Return error with suggestions |

---

# PART 2: DEVELOPER HANDOVER DOCUMENT

## 1. System Overview

PromptForge is a multi-layer system for building, monetising, automating, and growing digital assets using:

- **60 Prompt Packs** across 6 categories
- **229 Prompts** with 700+ context variables
- **60 Visualisation Hooks** for image generation
- **Six-Phase Execution Model** (Discovery, Build, Monetise, Automate, Grow, Optimise)
- **Credit-Based Execution Economy** (subscription + usage)

**Core Surfaces:**
- Web app (Next.js)
- Chrome extension (Manifest v3)
- Mobile app (React Native/Expo)
- Backend API (Node.js + PostgreSQL)
- Pack Composer Engine
- Pack Execution Engine

---

## 2. High-Level Architecture

### Frontend Layer
```
Web: Next.js (React 19, TypeScript, Tailwind 4)
├─ Pages: Home, Composer, Execution, History, Account
├─ Components: PackCard, ComposerWizard, ExecutionProgress
└─ State: Redux / Zustand

Chrome Extension: Manifest v3
├─ Popup UI: React
├─ Background Worker: Message passing
└─ Local Storage: Pack cache, project context

Mobile: React Native / Expo
├─ Screens: Home, Composer, Execution, History
├─ Local DB: SQLite (offline history)
└─ Push Notifications: Firebase Cloud Messaging
```

### Backend Layer
```
API: Node.js + TypeScript (NestJS or Fastify)
├─ Pack Service
├─ Composer Service
├─ Execution Service
├─ Credits & Billing Service
├─ Visualisation Service
└─ User & Project Service

Database: PostgreSQL (Supabase)
├─ Users table
├─ Projects table
├─ Packs table (metadata)
├─ Executions table
├─ CreditTransactions table
└─ ExecutionHistory table

Auth: Supabase Auth or Auth0
├─ JWT tokens
├─ OAuth providers (Google, GitHub)
└─ Magic links

Billing: Stripe
├─ Subscriptions (Free, Pro, Enterprise)
├─ Usage-based billing
└─ Webhooks for payment events

Analytics: PostHog / GA4
├─ User events
├─ Execution metrics
└─ Conversion funnels

AI Layer: External LLMs
├─ OpenAI (GPT-4, GPT-3.5)
├─ Anthropic (Claude)
└─ PromptForge orchestrates; does not host models
```

---

## 3. Core Services

### Pack Service
Stores pack metadata + prompt definitions

**Endpoints:**
- `GET /packs` - List all packs
- `GET /packs/:id` - Get pack details
- `GET /packs/category/:category` - Get packs by category
- `GET /packs/search?q=...` - Search packs

### Composer Service
Implements Pack Composer Engine

**Endpoints:**
- `POST /composer/sequence` - Generate optimal sequence
- `POST /composer/simulate` - Simulate sequence
- `GET /composer/recommendations` - Get top patterns

### Execution Service
Executes prompts/packs via LLM, tracks credit usage

**Endpoints:**
- `POST /execute/prompt` - Execute single prompt
- `POST /execute/pack` - Execute pack sequence
- `GET /executions/:id/status` - Get execution status
- `POST /executions/:id/cancel` - Cancel execution

### Credits & Billing Service
Integrates with Stripe, manages credit balances

**Endpoints:**
- `GET /credits/balance` - Get user credit balance
- `POST /credits/consume` - Consume credits
- `POST /stripe/webhook` - Handle Stripe events
- `GET /billing/history` - Get billing history

### Visualisation Service
Generates image prompts (not images themselves)

**Endpoints:**
- `POST /visualisation/generate` - Generate visualization prompt
- `POST /visualisation/edit` - Edit visualization
- `GET /visualisations/:id` - Get visualization details

### User & Project Service
Manages users, projects, history

**Endpoints:**
- `GET /me` - Get current user
- `GET /projects` - List user projects
- `POST /projects` - Create project
- `GET /history` - Get execution history

---

## 4. Data Model (Simplified)

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  auth_provider VARCHAR,
  subscription_tier VARCHAR,  -- free, pro, enterprise
  credit_balance INTEGER,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### Projects Table
```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  name VARCHAR,
  asset_type VARCHAR,
  niche VARCHAR,
  stage VARCHAR,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### Packs Table
```sql
CREATE TABLE packs (
  id VARCHAR PRIMARY KEY,
  name VARCHAR,
  category VARCHAR,
  phase_tags TEXT[],
  asset_types TEXT[],
  niches TEXT[],
  goals TEXT[],
  growth_channels TEXT[],
  complexity INTEGER,
  time_cost INTEGER,
  credit_cost INTEGER,
  dependencies TEXT[],
  success_rate INTEGER,
  user_rating DECIMAL,
  completion_rate INTEGER,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### Executions Table
```sql
CREATE TABLE executions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  project_id UUID REFERENCES projects(id),
  pack_id VARCHAR REFERENCES packs(id),
  prompt_ids TEXT[],
  credits_used INTEGER,
  status VARCHAR,  -- pending, running, completed, failed
  output TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### CreditTransactions Table
```sql
CREATE TABLE credit_transactions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  amount INTEGER,
  type VARCHAR,  -- debit, credit
  reason VARCHAR,
  created_at TIMESTAMP
);
```

---

## 5. Environments & Deployment

### Environments
- **dev**: Local development
- **staging**: Pre-production testing
- **prod**: Production

### CI/CD Pipeline (GitHub Actions)
```yaml
1. Lint + format check on PR
2. Run unit tests (80%+ coverage)
3. Run integration tests
4. Build Docker image
5. Deploy to staging on merge to main
6. Manual promotion to prod
```

### Hosting
- **Frontend**: Vercel (Next.js)
- **API**: Vercel Functions or separate Node backend (Fly.io, Render, Railway)
- **Database**: Supabase (PostgreSQL)
- **Storage**: S3 (for visualizations, exports)
- **CDN**: CloudFront (for static assets)

### Monitoring & Observability
- **Logs**: CloudWatch / Datadog
- **Metrics**: Prometheus / Grafana
- **Errors**: Sentry
- **Uptime**: UptimeRobot
- **Performance**: Vercel Analytics

---

## 6. Security & Compliance

### Authentication
- JWT-based auth with 24-hour expiry
- Refresh tokens for extended sessions
- OAuth providers: Google, GitHub
- Magic links for passwordless auth

### Authorization
- Role-based access control (RBAC)
- Roles: user, admin
- Row-level security (RLS) on Supabase

### Rate Limiting
- 100 requests/minute per user (execution endpoints)
- 50 requests/minute per user (composer endpoints)
- 10 requests/minute per user (billing endpoints)

### Stripe Webhooks
- Verify webhook signatures
- Never trust client for billing state
- Idempotent webhook handling
- Retry logic for failed webhooks

### Data Security
- No sensitive data in logs
- PII minimised (email only)
- Encrypt API keys in environment variables
- Use HTTPS everywhere
- CORS restricted to known domains

### Compliance
- GDPR: Data deletion, export, consent management
- PCI: No credit card storage (Stripe handles)
- SOC 2: Security controls, audit logs
- CCPA: Privacy rights, opt-out

---

## 7. Extension & Mobile Specifics

### Chrome Extension
- Popup UI calls backend via HTTPS
- Local cache for:
  - Last used packs
  - Last project context
  - User preferences
- No direct Stripe calls; always via backend
- Message passing for background worker
- Manifest v3 compliance

### Mobile App
- Uses same API as web
- Local SQLite for offline history
- Sync on reconnect
- Push notifications for:
  - Credit low
  - Execution finished
  - New pack recommendations
- Biometric auth support

---

## 8. Dev Guardrails

### Do NOT:
- Change pack definitions without versioning
- Bypass credit checks
- Call LLMs directly from frontend
- Store API keys in client code
- Hardcode environment variables
- Skip error handling
- Trust client-side credit balance

### DO:
- Treat packs as immutable content with version tags
- Keep Composer logic in one service
- Log all executions with user + project + pack IDs
- Keep a feature flag system for new flows
- Validate all user inputs on backend
- Use database transactions for credit operations
- Monitor execution success rates
- Implement graceful degradation

---

## 9. Handover Checklist

Before handing to external team:

- ✅ Finalised pack metadata (IDs, categories, tags, complexity)
- ✅ Chosen backend stack (Supabase vs custom Postgres)
- ✅ Chosen auth provider (Supabase Auth vs Auth0)
- ✅ Stripe account + products + prices defined
- ✅ Domain + DNS ready
- ✅ Repo structure agreed (monorepo vs split)
- ✅ Environment variables documented
- ✅ Database schema reviewed
- ✅ API specification reviewed
- ✅ Security review completed
- ✅ Load testing plan defined
- ✅ Monitoring & alerting configured
- ✅ Backup & recovery plan documented
- ✅ SLA definitions agreed
- ✅ Support workflow documented

---

# PART 3: SYSTEM INTEGRATION & DEPLOYMENT

## 1. Complete Data Flow

### User Journey: Composer → Execution → History

```
1. User opens PromptForge
   └─ Frontend loads user profile + projects

2. User clicks "Compose"
   └─ Composer Wizard starts
   └─ User answers 8 questions

3. Frontend calls POST /composer/sequence
   └─ Backend normalizes inputs
   └─ Backend filters candidate packs (9 criteria)
   └─ Backend scores packs (weighted algorithm)
   └─ Backend constructs sequence (respects dependencies)
   └─ Backend returns optimal sequence + alternatives

4. User reviews sequence
   └─ Can view alternatives
   └─ Can simulate time/credits
   └─ Can save for later or start execution

5. User clicks "Execute"
   └─ Frontend calls POST /execute/pack
   └─ Backend checks credit balance
   └─ Backend reserves credits
   └─ Backend executes prompts in sequence
   └─ Backend tracks progress in real-time
   └─ Frontend displays progress via WebSocket

6. Execution completes
   └─ Backend confirms credit deduction
   └─ Backend saves execution to history
   └─ Frontend displays results
   └─ User can save, share, or export

7. User views history
   └─ Frontend calls GET /history
   └─ Backend returns paginated executions
   └─ User can filter, search, export
```

## 2. Credit Flow

```
1. User subscribes to Pro ($99/month)
   └─ Stripe creates subscription
   └─ Webhook triggers credit replenishment
   └─ Backend adds 5,000 credits to user account

2. User executes pack (450 credits)
   └─ Backend reserves 450 credits
   └─ Backend calls LLM API
   └─ Backend deducts 450 credits on success
   └─ Backend refunds on failure

3. User runs out of credits
   └─ Backend returns 402 (Insufficient Credits)
   └─ Frontend prompts to purchase more
   └─ User can buy 1,000 credits for $10

4. Month ends
   └─ Unused credits expire
   └─ New month's allocation added
   └─ Cycle repeats
```

## 3. Deployment Checklist

### Pre-Deployment
- [ ] All tests passing (unit, integration, E2E)
- [ ] Code review completed
- [ ] Security review completed
- [ ] Performance testing completed
- [ ] Load testing completed (1000+ concurrent users)
- [ ] Staging environment tested
- [ ] Database migrations tested
- [ ] Rollback plan documented

### Deployment
- [ ] Create database backup
- [ ] Run database migrations
- [ ] Deploy backend API
- [ ] Deploy frontend
- [ ] Verify all endpoints responding
- [ ] Verify Stripe integration
- [ ] Verify email notifications
- [ ] Verify analytics tracking

### Post-Deployment
- [ ] Monitor error rates
- [ ] Monitor response times
- [ ] Monitor credit usage
- [ ] Monitor user signups
- [ ] Monitor execution success rates
- [ ] Check Sentry for errors
- [ ] Check logs for warnings

---

## 4. Success Metrics

### User Metrics
- Signups per day
- Composer usage rate
- Execution success rate
- Pack completion rate
- User retention (7-day, 30-day)

### Business Metrics
- Subscription conversion rate
- Average revenue per user (ARPU)
- Lifetime value (LTV)
- Churn rate
- Credit consumption per user

### Technical Metrics
- API response time (p50, p95, p99)
- Execution success rate
- Error rate
- Database query performance
- Cache hit rate

---

This completes the final comprehensive PromptForge system specification, ready for handover to external development teams.

