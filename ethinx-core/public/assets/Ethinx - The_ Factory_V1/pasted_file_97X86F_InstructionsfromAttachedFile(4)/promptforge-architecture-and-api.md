# PromptForge — Complete Architecture Diagrams & OpenAPI Specification
## Production-Ready Architecture and API Contract

---

# PART 1: SYSTEM ARCHITECTURE DIAGRAMS

## 1.1 High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           PromptForge System                                │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                         FRONTEND LAYER                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐         │
│  │   Web App        │  │  Chrome Ext      │  │  Mobile App      │         │
│  │  (Next.js)       │  │  (Manifest v3)   │  │  (React Native)  │         │
│  │                  │  │                  │  │                  │         │
│  │ • Composer UI    │  │ • Popup UI       │  │ • Composer UI    │         │
│  │ • Execution UI   │  │ • Quick Access   │  │ • Execution UI   │         │
│  │ • History        │  │ • Cache          │  │ • Offline Cache  │         │
│  │ • Account        │  │ • Notifications  │  │ • Push Notif     │         │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘         │
│           │                    │                      │                    │
│           └────────────────────┼──────────────────────┘                    │
│                                │                                           │
│                        HTTPS / WebSocket                                   │
│                                │                                           │
└────────────────────────────────┼───────────────────────────────────────────┘
                                 │
┌────────────────────────────────┼───────────────────────────────────────────┐
│                         API GATEWAY / LOAD BALANCER                        │
│                                │                                           │
│                    • Auth Middleware                                       │
│                    • Rate Limiting                                         │
│                    • Request Validation                                    │
│                    • Logging                                              │
│                                │                                           │
└────────────────────────────────┼───────────────────────────────────────────┘
                                 │
┌────────────────────────────────┼───────────────────────────────────────────┐
│                      BACKEND SERVICES LAYER                                │
├────────────────────────────────┼───────────────────────────────────────────┤
│                                │                                           │
│  ┌──────────────────────────────────────────────────────────────────┐    │
│  │                    Core Services                                 │    │
│  ├──────────────────────────────────────────────────────────────────┤    │
│  │                                                                  │    │
│  │  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐   │    │
│  │  │ Pack Service   │  │ Composer Svc   │  │ Execution Svc  │   │    │
│  │  │                │  │                │  │                │   │    │
│  │  │ • List packs   │  │ • Compose seq  │  │ • Execute      │   │    │
│  │  │ • Get pack     │  │ • Simulate     │  │ • Track status │   │    │
│  │  │ • Metadata     │  │ • Recommend    │  │ • Stream out   │   │    │
│  │  └────────────────┘  └────────────────┘  └────────────────┘   │    │
│  │                                                                  │    │
│  │  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐   │    │
│  │  │ Credits Svc    │  │ Visualisation  │  │ User & Project │   │    │
│  │  │                │  │ Service        │  │ Service        │   │    │
│  │  │ • Balance      │  │                │  │                │   │    │
│  │  │ • Consume      │  │ • Generate     │  │ • Users        │   │    │
│  │  │ • Replenish    │  │ • Edit         │  │ • Projects     │   │    │
│  │  │ • Stripe       │  │ • History      │  │ • History      │   │    │
│  │  └────────────────┘  └────────────────┘  └────────────────┘   │    │
│  │                                                                  │    │
│  └──────────────────────────────────────────────────────────────────┘    │
│                                │                                           │
│  ┌──────────────────────────────────────────────────────────────────┐    │
│  │                    Supporting Services                            │    │
│  ├──────────────────────────────────────────────────────────────────┤    │
│  │                                                                  │    │
│  │  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐   │    │
│  │  │ Auth Service   │  │ Webhook Svc    │  │ Sync Service   │   │    │
│  │  │                │  │                │  │                │   │    │
│  │  │ • JWT          │  │ • Stripe       │  │ • Device sync  │   │    │
│  │  │ • OAuth        │  │ • Webhooks     │  │ • Conflict res │   │    │
│  │  │ • Sessions     │  │ • Retries      │  │ • Caching      │   │    │
│  │  └────────────────┘  └────────────────┘  └────────────────┘   │    │
│  │                                                                  │    │
│  └──────────────────────────────────────────────────────────────────┘    │
│                                                                           │
└───────────────────────────────────────────────────────────────────────────┘
                                 │
        ┌────────────────────────┼────────────────────────┐
        │                        │                        │
┌───────▼────────┐    ┌──────────▼──────────┐   ┌────────▼────────┐
│   Database     │    │   Cache Layer      │   │  AI Layer       │
│  (PostgreSQL)  │    │   (Redis)          │   │ (External LLMs) │
│                │    │                    │   │                 │
│ • Users        │    │ • Session cache    │   │ • OpenAI        │
│ • Projects     │    │ • Pack cache       │   │ • Anthropic     │
│ • Packs        │    │ • Execution cache  │   │ • Others        │
│ • Executions   │    │ • Rate limit       │   │                 │
│ • Credits      │    │ • Locks            │   │ (Orchestrated   │
│ • History      │    │                    │   │  by Backend)    │
│                │    │                    │   │                 │
└────────────────┘    └────────────────────┘   └─────────────────┘
        │                        │                        │
        └────────────────────────┼────────────────────────┘
                                 │
        ┌────────────────────────┼────────────────────────┐
        │                        │                        │
┌───────▼────────┐    ┌──────────▼──────────┐   ┌────────▼────────┐
│   Billing      │    │   Analytics        │   │  Storage        │
│   (Stripe)     │    │   (PostHog/GA4)    │   │  (S3)           │
│                │    │                    │   │                 │
│ • Subscriptions│    │ • User events      │   │ • Visualizations│
│ • Payments     │    │ • Execution metrics│   │ • Exports       │
│ • Webhooks     │    │ • Funnels          │   │ • Backups       │
│                │    │ • Cohorts          │   │                 │
└────────────────┘    └────────────────────┘   └─────────────────┘
```

---

## 1.2 Backend Service Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Backend Service Architecture                             │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│                         API Gateway / Router                                 │
│                                                                              │
│  • Route requests to services                                               │
│  • JWT validation                                                           │
│  • Rate limiting                                                            │
│  • Request/response logging                                                │
│  • Error handling                                                           │
└──────────────────────────────────────────────────────────────────────────────┘
                                    │
        ┌───────────────────────────┼───────────────────────────┐
        │                           │                           │
        ▼                           ▼                           ▼
┌──────────────────┐      ┌──────────────────┐      ┌──────────────────┐
│  Pack Service    │      │ Composer Service │      │ Execution Svc    │
├──────────────────┤      ├──────────────────┤      ├──────────────────┤
│                  │      │                  │      │                  │
│ Endpoints:       │      │ Endpoints:       │      │ Endpoints:       │
│ • GET /packs     │      │ • POST /composer/│      │ • POST /execute/ │
│ • GET /packs/:id │      │   sequence       │      │   prompt         │
│ • GET /packs/cat │      │ • GET /composer/ │      │ • POST /execute/ │
│ • GET /context   │      │   recommend      │      │   pack           │
│                  │      │ • POST /composer/│      │ • GET /exec/:id/ │
│ Database:        │      │   simulate       │      │   status         │
│ • Packs table    │      │                  │      │ • GET /exec/:id/ │
│ • Prompts table  │      │ Dependencies:    │      │   output         │
│ • Context vars   │      │ • Pack Service   │      │                  │
│                  │      │ • Credits Svc    │      │ Dependencies:    │
│ Cache:           │      │                  │      │ • Pack Service   │
│ • Pack metadata  │      │ Cache:           │      │ • Credits Svc    │
│ • Context vars   │      │ • Scoring cache  │      │ • AI Layer       │
│                  │      │ • Sequence cache │      │                  │
└──────────────────┘      └──────────────────┘      └──────────────────┘
        │                           │                           │
        │                           │                           │
        └───────────────────────────┼───────────────────────────┘
                                    │
        ┌───────────────────────────┼───────────────────────────┐
        │                           │                           │
        ▼                           ▼                           ▼
┌──────────────────┐      ┌──────────────────┐      ┌──────────────────┐
│ Credits & Billing│      │ Visualisation    │      │ User & Project   │
│ Service          │      │ Service          │      │ Service          │
├──────────────────┤      ├──────────────────┤      ├──────────────────┤
│                  │      │                  │      │                  │
│ Endpoints:       │      │ Endpoints:       │      │ Endpoints:       │
│ • GET /credits   │      │ • POST /visual/  │      │ • GET /me        │
│ • POST /credits/ │      │   generate       │      │ • PUT /me        │
│   consume        │      │ • POST /visual/  │      │ • GET /projects  │
│ • POST /credits/ │      │   edit           │      │ • POST /projects │
│   replenish      │      │ • GET /visual/:id│      │ • GET /projects/:│
│ • GET /billing   │      │                  │      │   id             │
│ • POST /stripe/  │      │ Dependencies:    │      │ • GET /projects/:│
│   webhook        │      │ • Execution Svc  │      │   id/context     │
│                  │      │                  │      │                  │
│ Dependencies:    │      │ Cache:           │      │ Dependencies:    │
│ • Stripe API     │      │ • Visualization  │      │ • Auth Service   │
│ • Database       │      │   prompts        │      │ • Database       │
│                  │      │ • History        │      │                  │
│ Cache:           │      │                  │      │ Cache:           │
│ • Credit balance │      │                  │      │ • User profile   │
│ • Subscription   │      │                  │      │ • Project list   │
│                  │      │                  │      │                  │
└──────────────────┘      └──────────────────┘      └──────────────────┘
        │                           │                           │
        │                           │                           │
        └───────────────────────────┼───────────────────────────┘
                                    │
        ┌───────────────────────────┼───────────────────────────┐
        │                           │                           │
        ▼                           ▼                           ▼
┌──────────────────┐      ┌──────────────────┐      ┌──────────────────┐
│ Auth Service     │      │ Webhook Service  │      │ Sync Service     │
├──────────────────┤      ├──────────────────┤      ├──────────────────┤
│                  │      │                  │      │                  │
│ Endpoints:       │      │ Endpoints:       │      │ Endpoints:       │
│ • POST /auth/    │      │ • POST /stripe/  │      │ • POST /sync/    │
│   login          │      │   webhook        │      │   state          │
│ • POST /auth/    │      │ • POST /webhook/ │      │ • GET /sync/     │
│   logout         │      │   retry          │      │   status         │
│ • POST /auth/    │      │                  │      │ • POST /sync/    │
│   refresh        │      │ Handles:         │      │   resolve        │
│                  │      │ • Subscription   │      │                  │
│ Integrations:    │      │   events         │      │ Handles:         │
│ • Supabase Auth  │      │ • Payment events │      │ • Cross-device   │
│ • Auth0          │      │ • Refunds        │      │   sync           │
│ • OAuth          │      │ • Chargebacks    │      │ • Conflict       │
│                  │      │                  │      │   resolution     │
│ Cache:           │      │ Retry logic:     │      │ • Cache sync     │
│ • Sessions       │      │ • Exponential    │      │                  │
│ • Tokens         │      │   backoff        │      │ Cache:           │
│                  │      │ • Max retries    │      │ • Sync state     │
│                  │      │                  │      │ • Device list    │
└──────────────────┘      └──────────────────┘      └──────────────────┘
```

---

## 1.3 Data Flow Diagrams

### Prompt Execution Flow
```
User initiates prompt execution
        │
        ▼
Frontend: POST /execute/prompt
        │
        ├─ Validate JWT token
        ├─ Check credit balance
        │
        ▼
Backend: Execution Service
        │
        ├─ Reserve credits
        ├─ Log execution start
        │
        ▼
Call LLM API (OpenAI/Anthropic)
        │
        ├─ Stream response to frontend (WebSocket)
        ├─ Track tokens used
        │
        ▼
LLM returns completion
        │
        ├─ Format output
        ├─ Save to database
        ├─ Deduct credits
        │
        ▼
Frontend displays result
        │
        ├─ User can save/export
        ├─ Trigger visualisation hooks
        │
        ▼
Execution complete
```

### Pack Execution Flow
```
User initiates pack execution
        │
        ▼
Frontend: POST /execute/pack
        │
        ├─ Validate JWT token
        ├─ Check credit balance
        │
        ▼
Backend: Execution Service
        │
        ├─ Fetch pack definition
        ├─ Reserve total credits
        ├─ Log execution start
        │
        ▼
For each prompt in pack (sequential):
        │
        ├─ Execute prompt (see Prompt Execution Flow)
        ├─ Check for errors
        ├─ Store intermediate results
        ├─ Update progress (WebSocket)
        │
        ▼
All prompts completed
        │
        ├─ Aggregate results
        ├─ Deduct total credits
        ├─ Save execution record
        ├─ Trigger visualisation hooks
        │
        ▼
Frontend displays results
        │
        ├─ User can save/export
        ├─ User can download visualisations
        │
        ▼
Pack execution complete
```

### Credit Consumption Flow
```
User executes pack
        │
        ▼
Backend: Execution Service
        │
        ├─ Calculate credit cost
        │  (based on pack complexity)
        │
        ▼
Credits & Billing Service
        │
        ├─ Check balance
        │  (GET /credits/balance)
        │
        ├─ If insufficient:
        │  └─ Return 402 error
        │     (Insufficient Credits)
        │
        ├─ If sufficient:
        │  └─ Reserve credits
        │     (POST /credits/reserve)
        │
        ▼
Execute pack
        │
        ├─ On success:
        │  └─ Deduct credits
        │     (POST /credits/consume)
        │
        ├─ On failure:
        │  └─ Refund credits
        │     (POST /credits/refund)
        │
        ▼
Update user balance
        │
        ├─ Log transaction
        ├─ Update database
        ├─ Cache new balance
        │
        ▼
Frontend displays new balance
```

### Subscription Lifecycle
```
User signs up (Free tier)
        │
        ├─ Create user account
        ├─ Allocate 100 free credits
        │
        ▼
User upgrades to Pro ($99/month)
        │
        ├─ Frontend: Redirect to Stripe
        ├─ User completes payment
        │
        ▼
Stripe webhook: customer.subscription.created
        │
        ├─ Backend: Webhook Service
        ├─ Verify webhook signature
        ├─ Create subscription record
        ├─ Allocate 5,000 monthly credits
        ├─ Update subscription_tier
        │
        ▼
User has Pro access
        │
        ├─ Can execute packs
        ├─ Can use visualisations
        ├─ Credits reset monthly
        │
        ▼
Month ends
        │
        ├─ Stripe webhook: invoice.payment_succeeded
        ├─ Backend: Replenish 5,000 credits
        ├─ Reset credit balance
        │
        ▼
Next month begins
```

### Visualisation Generation Flow
```
User completes pack execution
        │
        ▼
Execution Service triggers visualisation hooks
        │
        ├─ Identify visualisation prompts
        ├─ Calculate credit cost (25-150 credits)
        │
        ▼
Check user credit balance
        │
        ├─ If insufficient:
        │  └─ Skip visualisation
        │     (notify user)
        │
        ├─ If sufficient:
        │  └─ Reserve credits
        │
        ▼
Visualisation Service: Generate prompt
        │
        ├─ POST /visualisation/generate
        ├─ Create image generation prompt
        ├─ Store prompt in database
        ├─ Deduct credits
        │
        ▼
Frontend receives visualisation prompt
        │
        ├─ Can view prompt
        ├─ Can edit prompt
        ├─ Can generate image (external service)
        ├─ Can save/export
        │
        ▼
Visualisation complete
```

### Device Sync Flow
```
User executes pack on Web
        │
        ├─ Save execution to database
        ├─ Store in Redis cache
        │
        ▼
Mobile app polls for sync
        │
        ├─ GET /sync/status
        ├─ Receives new executions
        │
        ▼
Mobile app syncs locally
        │
        ├─ Store in SQLite
        ├─ Update local cache
        │
        ▼
User opens Mobile app
        │
        ├─ View synced execution
        ├─ Can edit/export
        │
        ▼
User makes changes on Mobile
        │
        ├─ POST /sync/state
        ├─ Update database
        ├─ Invalidate Web cache
        │
        ▼
Web app detects change
        │
        ├─ WebSocket notification
        ├─ Refresh local state
        │
        ▼
All devices in sync
```

---

## 1.4 Sequence Diagrams

### User Executes a Pack

```
User          Frontend         Backend          Database        LLM API
  │              │                │                │               │
  │─ Click ─────>│                │                │               │
  │  Execute     │                │                │               │
  │              │                │                │               │
  │              │─ POST /execute/pack ──────────>│               │
  │              │                │                │               │
  │              │                │─ Validate JWT ─┤               │
  │              │                │                │               │
  │              │                │─ Check Balance─┤               │
  │              │                │                │               │
  │              │                │─ Reserve ──────┤               │
  │              │                │  Credits       │               │
  │              │                │                │               │
  │              │<─ 202 Accepted ─               │               │
  │              │  (execution_id)                │               │
  │              │                │                │               │
  │              │─ WebSocket ─────────────────────────────────────│
  │              │  (subscribe to progress)       │               │
  │              │                │                │               │
  │              │                │─ For each prompt:             │
  │              │                │                │               │
  │              │                │─ POST to LLM ──────────────────>│
  │              │                │                │               │
  │              │                │<─ Stream response ────────────│
  │              │                │                │               │
  │              │<─ WebSocket ─────Progress update               │
  │              │  (50% complete)                │               │
  │              │                │                │               │
  │              │                │─ Save ─────────┤               │
  │              │                │  Results       │               │
  │              │                │                │               │
  │              │<─ WebSocket ─────100% complete              │
  │              │  (results)      │                │               │
  │              │                │                │               │
  │              │                │─ Deduct ───────┤               │
  │              │                │  Credits       │               │
  │              │                │                │               │
  │<─ Display ────│                │                │               │
  │  Results     │                │                │               │
  │              │                │                │               │
```

### User Upgrades Subscription

```
User          Frontend         Stripe API       Backend          Database
  │              │                │                │                │
  │─ Click ─────>│                │                │                │
  │  Upgrade     │                │                │                │
  │              │                │                │                │
  │              │─ Redirect ─────>│                │                │
  │              │  to Stripe      │                │                │
  │              │  Checkout       │                │                │
  │              │                │                │                │
  │<─ Checkout ───│<─ Stripe ──────│                │                │
  │  Page        │  Checkout      │                │                │
  │              │                │                │                │
  │─ Enter ─────>│                │                │                │
  │  Payment     │─ Submit ──────>│                │                │
  │              │  Payment       │                │                │
  │              │                │                │                │
  │              │<─ Success ──────│                │                │
  │              │  Redirect       │                │                │
  │              │                │                │                │
  │<─ Success ────│                │                │                │
  │  Page        │                │                │                │
  │              │                │                │                │
  │              │                │─ Webhook ──────>│                │
  │              │                │ (customer.     │                │
  │              │                │  subscription. │                │
  │              │                │  created)      │                │
  │              │                │                │                │
  │              │                │                │─ Create ───────┤
  │              │                │                │  Subscription  │
  │              │                │                │  Record        │
  │              │                │                │                │
  │              │                │                │─ Allocate ─────┤
  │              │                │                │  5,000 Credits │
  │              │                │                │                │
  │              │                │                │─ Update ───────┤
  │              │                │                │  Tier to Pro   │
  │              │                │                │                │
  │              │─ Fetch User ───────────────────>│                │
  │              │  Profile       │                │                │
  │              │                │                │                │
  │              │<─ User Profile ─               │                │
  │              │  (tier: Pro)   │                │                │
  │              │                │                │                │
  │<─ Display ────│                │                │                │
  │  Pro Features│                │                │                │
  │              │                │                │                │
```

### Stripe Webhook Event

```
Stripe          Backend          Database         Email Service
  │                │                │                │
  │─ Webhook ─────>│                │                │
  │ (payment.     │                │                │
  │  succeeded)   │                │                │
  │                │                │                │
  │                │─ Verify ───────┤                │
  │                │  Signature     │                │
  │                │                │                │
  │                │─ Check ─────────┤                │
  │                │  Idempotency    │                │
  │                │  (already       │                │
  │                │   processed?)   │                │
  │                │                │                │
  │                │─ Update ───────┤                │
  │                │  Subscription  │                │
  │                │  Status        │                │
  │                │                │                │
  │                │─ Replenish ────┤                │
  │                │  Credits       │                │
  │                │  (5,000)       │                │
  │                │                │                │
  │                │─ Log ──────────┤                │
  │                │  Transaction   │                │
  │                │                │                │
  │                │─ Send Email ──────────────────>│
  │                │  (payment      │                │
  │                │   receipt)     │                │
  │                │                │                │
  │<─ 200 OK ──────│                │                │
  │ (ACK)         │                │                │
  │                │                │                │
```

### Visualisation Generation

```
User          Frontend         Backend          Database         Viz Service
  │              │                │                │                │
  │─ View ──────>│                │                │                │
  │  Results     │                │                │                │
  │              │                │                │                │
  │              │─ Trigger ──────>│                │                │
  │              │  Visualisation  │                │                │
  │              │  Hooks          │                │                │
  │              │                │                │                │
  │              │                │─ Check ─────────┤                │
  │              │                │  Credit Balance │                │
  │              │                │                │                │
  │              │                │─ Reserve ──────┤                │
  │              │                │  Credits       │                │
  │              │                │  (50 credits)  │                │
  │              │                │                │                │
  │              │                │─ Generate ─────────────────────>│
  │              │                │  Prompt        │                │
  │              │                │                │                │
  │              │                │<─ Prompt ──────────────────────│
  │              │                │  (image        │                │
  │              │                │   generation   │                │
  │              │                │   instructions)│                │
  │              │                │                │                │
  │              │                │─ Save ─────────┤                │
  │              │                │  Prompt        │                │
  │              │                │                │                │
  │              │                │─ Deduct ───────┤                │
  │              │                │  Credits       │                │
  │              │                │                │                │
  │              │<─ Prompt ──────│                │                │
  │              │  (JSON)        │                │                │
  │              │                │                │                │
  │<─ Display ────│                │                │                │
  │  Prompt      │                │                │                │
  │  & Options   │                │                │                │
  │              │                │                │                │
  │─ Edit ──────>│                │                │                │
  │  Prompt      │                │                │                │
  │              │─ POST /visual/ ─────────────────────────────────>│
  │              │  edit          │                │                │
  │              │                │                │                │
  │              │                │<─ Updated Prompt ──────────────│
  │              │                │                │                │
  │              │<─ Updated ─────│                │                │
  │              │  Prompt        │                │                │
  │              │                │                │                │
  │<─ Display ────│                │                │                │
  │  Updated     │                │                │                │
  │  Prompt      │                │                │                │
  │              │                │                │                │
```

### Multi-Device Sync

```
Web App        Backend          Database         Mobile App
  │              │                │                │
  │─ Execute ────>│                │                │
  │  Pack         │                │                │
  │              │                │                │
  │              │─ Save ─────────┤                │
  │              │  Execution     │                │
  │              │                │                │
  │              │─ Cache ─────────┤                │
  │              │  Execution     │                │
  │              │                │                │
  │<─ Results ────│                │                │
  │              │                │                │
  │              │                │                │
  │              │                │                │
  │              │                │                │
  │              │                │                │
  │              │<─ Poll ─────────────────────────│
  │              │ /sync/status   │                │
  │              │                │                │
  │              │─ Query ─────────┤                │
  │              │  New Executions │                │
  │              │                │                │
  │              │─ Return ─────────────────────────>│
  │              │  Executions    │                │
  │              │                │                │
  │              │                │                │
  │              │                │                │
  │              │                │                │
  │              │<─ Store ─────────────────────────│
  │              │  Locally       │                │
  │              │  (SQLite)      │                │
  │              │                │                │
  │              │<─ Display ─────────────────────│
  │              │  Execution    │                │
  │              │                │                │
  │              │                │                │
  │              │<─ Edit ─────────────────────────│
  │              │  Execution    │                │
  │              │                │                │
  │              │─ POST /sync/ ───────────────────>│
  │              │  state         │                │
  │              │                │                │
  │              │─ Update ───────┤                │
  │              │  Database      │                │
  │              │                │                │
  │              │─ Invalidate ────┤                │
  │              │  Web Cache     │                │
  │              │                │                │
  │<─ WebSocket ──────────────────────────────────│
  │  Notification│                │                │
  │  (updated)   │                │                │
  │              │                │                │
  │─ Refresh ────>│                │                │
  │  State       │                │                │
  │              │                │                │
  │<─ New State ──│                │                │
  │              │                │                │
  │<─ Display ────│                │                │
  │  Updated     │                │                │
  │  Execution   │                │                │
  │              │                │                │
```

---

# PART 2: OPENAPI 3.1 SPECIFICATION

## Complete OpenAPI Specification

```yaml
openapi: 3.1.0

info:
  title: PromptForge API
  version: 1.0.0
  description: |
    Complete API specification for PromptForge - a system for building, monetising, 
    automating, and growing digital assets using 60 prompt packs.
  contact:
    name: PromptForge Support
    email: support@promptforge.io
  license:
    name: Proprietary
    url: https://promptforge.io/license

servers:
  - url: https://api.promptforge.io/v1
    description: Production API
  - url: https://staging-api.promptforge.io/v1
    description: Staging API
  - url: http://localhost:3000/v1
    description: Local development

security:
  - bearerAuth: []

tags:
  - name: Packs
    description: Pack metadata and definitions
  - name: Composer
    description: Pack Composer Engine endpoints
  - name: Execution
    description: Pack and prompt execution
  - name: Credits & Billing
    description: Credit management and billing
  - name: Visualisation
    description: Visualisation generation and management
  - name: User & Projects
    description: User profiles and projects
  - name: Auth
    description: Authentication and authorization
  - name: Webhooks
    description: Webhook endpoints

paths:
  /packs:
    get:
      tags:
        - Packs
      summary: List all packs
      operationId: listPacks
      parameters:
        - name: category
          in: query
          schema:
            type: string
            enum: [MVP, Monetisation, Automation, Niche, AssetType, Growth]
          description: Filter by pack category
        - name: limit
          in: query
          schema:
            type: integer
            default: 50
            minimum: 1
            maximum: 100
          description: Number of packs to return
        - name: offset
          in: query
          schema:
            type: integer
            default: 0
            minimum: 0
          description: Pagination offset
        - name: search
          in: query
          schema:
            type: string
          description: Search packs by name or description
      responses:
        '200':
          description: List of packs
          content:
            application/json:
              schema:
                type: object
                properties:
                  packs:
                    type: array
                    items:
                      $ref: '#/components/schemas/Pack'
                  total:
                    type: integer
                  limit:
                    type: integer
                  offset:
                    type: integer
        '401':
          $ref: '#/components/responses/UnauthorizedError'
        '429':
          $ref: '#/components/responses/RateLimitError'

  /packs/{packId}:
    get:
      tags:
        - Packs
      summary: Get pack details
      operationId: getPack
      parameters:
        - name: packId
          in: path
          required: true
          schema:
            type: string
          description: Pack ID
      responses:
        '200':
          description: Pack details
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/PackDetail'
        '404':
          $ref: '#/components/responses/NotFoundError'
        '401':
          $ref: '#/components/responses/UnauthorizedError'

  /packs/{packId}/context-variables:
    get:
      tags:
        - Packs
      summary: Get context variables for a pack
      operationId: getContextVariables
      parameters:
        - name: packId
          in: path
          required: true
          schema:
            type: string
          description: Pack ID
      responses:
        '200':
          description: Context variables
          content:
            application/json:
              schema:
                type: object
                properties:
                  variables:
                    type: array
                    items:
                      $ref: '#/components/schemas/ContextVariable'
        '404':
          $ref: '#/components/responses/NotFoundError'
        '401':
          $ref: '#/components/responses/UnauthorizedError'

  /composer/sequence:
    post:
      tags:
        - Composer
      summary: Generate optimal pack sequence
      operationId: generateComposerSequence
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ComposerInput'
      responses:
        '200':
          description: Optimal pack sequence
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ComposerOutput'
        '400':
          $ref: '#/components/responses/BadRequestError'
        '401':
          $ref: '#/components/responses/UnauthorizedError'
        '429':
          $ref: '#/components/responses/RateLimitError'

  /composer/recommendations:
    get:
      tags:
        - Composer
      summary: Get recommended pack patterns
      operationId: getRecommendations
      parameters:
        - name: goal
          in: query
          required: true
          schema:
            type: string
            enum: [build, monetise, automate, grow, optimise, full-journey]
          description: User goal
        - name: assetType
          in: query
          required: true
          schema:
            type: string
          description: Asset type
        - name: niche
          in: query
          required: true
          schema:
            type: string
          description: Niche
      responses:
        '200':
          description: Recommended patterns
          content:
            application/json:
              schema:
                type: object
                properties:
                  recommendations:
                    type: array
                    items:
                      $ref: '#/components/schemas/Recommendation'
        '400':
          $ref: '#/components/responses/BadRequestError'
        '401':
          $ref: '#/components/responses/UnauthorizedError'

  /composer/simulate:
    post:
      tags:
        - Composer
      summary: Simulate pack sequence
      operationId: simulateComposerSequence
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ComposerSimulateInput'
      responses:
        '200':
          description: Simulation results
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ComposerSimulateOutput'
        '400':
          $ref: '#/components/responses/BadRequestError'
        '401':
          $ref: '#/components/responses/UnauthorizedError'

  /execute/prompt:
    post:
      tags:
        - Execution
      summary: Execute single prompt
      operationId: executePrompt
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ExecutePromptInput'
      responses:
        '202':
          description: Execution accepted
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ExecutionResponse'
        '400':
          $ref: '#/components/responses/BadRequestError'
        '401':
          $ref: '#/components/responses/UnauthorizedError'
        '402':
          $ref: '#/components/responses/InsufficientCreditsError'
        '429':
          $ref: '#/components/responses/RateLimitError'

  /execute/pack:
    post:
      tags:
        - Execution
      summary: Execute pack sequence
      operationId: executePack
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ExecutePackInput'
      responses:
        '202':
          description: Execution accepted
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ExecutionResponse'
        '400':
          $ref: '#/components/responses/BadRequestError'
        '401':
          $ref: '#/components/responses/UnauthorizedError'
        '402':
          $ref: '#/components/responses/InsufficientCreditsError'
        '429':
          $ref: '#/components/responses/RateLimitError'

  /executions/{executionId}/status:
    get:
      tags:
        - Execution
      summary: Get execution status
      operationId: getExecutionStatus
      parameters:
        - name: executionId
          in: path
          required: true
          schema:
            type: string
          description: Execution ID
      responses:
        '200':
          description: Execution status
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ExecutionStatus'
        '404':
          $ref: '#/components/responses/NotFoundError'
        '401':
          $ref: '#/components/responses/UnauthorizedError'

  /executions/{executionId}/output:
    get:
      tags:
        - Execution
      summary: Get execution output
      operationId: getExecutionOutput
      parameters:
        - name: executionId
          in: path
          required: true
          schema:
            type: string
          description: Execution ID
      responses:
        '200':
          description: Execution output
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ExecutionOutput'
        '404':
          $ref: '#/components/responses/NotFoundError'
        '401':
          $ref: '#/components/responses/UnauthorizedError'

  /executions/{executionId}/cancel:
    post:
      tags:
        - Execution
      summary: Cancel execution
      operationId: cancelExecution
      parameters:
        - name: executionId
          in: path
          required: true
          schema:
            type: string
          description: Execution ID
      responses:
        '200':
          description: Execution cancelled
          content:
            application/json:
              schema:
                type: object
                properties:
                  status:
                    type: string
                    enum: [cancelled]
        '404':
          $ref: '#/components/responses/NotFoundError'
        '401':
          $ref: '#/components/responses/UnauthorizedError'

  /credits/balance:
    get:
      tags:
        - Credits & Billing
      summary: Get credit balance
      operationId: getCreditBalance
      responses:
        '200':
          description: Credit balance
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/CreditBalance'
        '401':
          $ref: '#/components/responses/UnauthorizedError'

  /credits/consume:
    post:
      tags:
        - Credits & Billing
      summary: Consume credits
      operationId: consumeCredits
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ConsumeCreditsInput'
      responses:
        '200':
          description: Credits consumed
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/CreditBalance'
        '402':
          $ref: '#/components/responses/InsufficientCreditsError'
        '401':
          $ref: '#/components/responses/UnauthorizedError'

  /credits/replenish:
    post:
      tags:
        - Credits & Billing
      summary: Replenish credits
      operationId: replenishCredits
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ReplenishCreditsInput'
      responses:
        '200':
          description: Credits replenished
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/CreditBalance'
        '401':
          $ref: '#/components/responses/UnauthorizedError'

  /billing/history:
    get:
      tags:
        - Credits & Billing
      summary: Get billing history
      operationId: getBillingHistory
      parameters:
        - name: limit
          in: query
          schema:
            type: integer
            default: 50
        - name: offset
          in: query
          schema:
            type: integer
            default: 0
      responses:
        '200':
          description: Billing history
          content:
            application/json:
              schema:
                type: object
                properties:
                  transactions:
                    type: array
                    items:
                      $ref: '#/components/schemas/BillingTransaction'
                  total:
                    type: integer
        '401':
          $ref: '#/components/responses/UnauthorizedError'

  /stripe/webhook:
    post:
      tags:
        - Webhooks
      summary: Handle Stripe webhook
      operationId: handleStripeWebhook
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
      responses:
        '200':
          description: Webhook processed
          content:
            application/json:
              schema:
                type: object
                properties:
                  received: true
        '400':
          $ref: '#/components/responses/BadRequestError'

  /visualisation/generate:
    post:
      tags:
        - Visualisation
      summary: Generate visualisation prompt
      operationId: generateVisualisation
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/GenerateVisualisationInput'
      responses:
        '200':
          description: Visualisation prompt generated
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Visualisation'
        '400':
          $ref: '#/components/responses/BadRequestError'
        '401':
          $ref: '#/components/responses/UnauthorizedError'
        '402':
          $ref: '#/components/responses/InsufficientCreditsError'

  /visualisation/{visualisationId}/edit:
    post:
      tags:
        - Visualisation
      summary: Edit visualisation prompt
      operationId: editVisualisation
      parameters:
        - name: visualisationId
          in: path
          required: true
          schema:
            type: string
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/EditVisualisationInput'
      responses:
        '200':
          description: Visualisation updated
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Visualisation'
        '404':
          $ref: '#/components/responses/NotFoundError'
        '401':
          $ref: '#/components/responses/UnauthorizedError'

  /visualisation/history:
    get:
      tags:
        - Visualisation
      summary: Get visualisation history
      operationId: getVisualisationHistory
      parameters:
        - name: limit
          in: query
          schema:
            type: integer
            default: 50
        - name: offset
          in: query
          schema:
            type: integer
            default: 0
      responses:
        '200':
          description: Visualisation history
          content:
            application/json:
              schema:
                type: object
                properties:
                  visualisations:
                    type: array
                    items:
                      $ref: '#/components/schemas/Visualisation'
                  total:
                    type: integer
        '401':
          $ref: '#/components/responses/UnauthorizedError'

  /me:
    get:
      tags:
        - User & Projects
      summary: Get current user profile
      operationId: getCurrentUser
      responses:
        '200':
          description: User profile
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
        '401':
          $ref: '#/components/responses/UnauthorizedError'

    put:
      tags:
        - User & Projects
      summary: Update user profile
      operationId: updateUserProfile
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UpdateUserInput'
      responses:
        '200':
          description: User profile updated
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
        '400':
          $ref: '#/components/responses/BadRequestError'
        '401':
          $ref: '#/components/responses/UnauthorizedError'

  /projects:
    get:
      tags:
        - User & Projects
      summary: List user projects
      operationId: listProjects
      parameters:
        - name: limit
          in: query
          schema:
            type: integer
            default: 50
        - name: offset
          in: query
          schema:
            type: integer
            default: 0
      responses:
        '200':
          description: User projects
          content:
            application/json:
              schema:
                type: object
                properties:
                  projects:
                    type: array
                    items:
                      $ref: '#/components/schemas/Project'
                  total:
                    type: integer
        '401':
          $ref: '#/components/responses/UnauthorizedError'

    post:
      tags:
        - User & Projects
      summary: Create project
      operationId: createProject
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateProjectInput'
      responses:
        '201':
          description: Project created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Project'
        '400':
          $ref: '#/components/responses/BadRequestError'
        '401':
          $ref: '#/components/responses/UnauthorizedError'

  /projects/{projectId}:
    get:
      tags:
        - User & Projects
      summary: Get project details
      operationId: getProject
      parameters:
        - name: projectId
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Project details
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Project'
        '404':
          $ref: '#/components/responses/NotFoundError'
        '401':
          $ref: '#/components/responses/UnauthorizedError'

  /projects/{projectId}/context:
    get:
      tags:
        - User & Projects
      summary: Get project context
      operationId: getProjectContext
      parameters:
        - name: projectId
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Project context
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ProjectContext'
        '404':
          $ref: '#/components/responses/NotFoundError'
        '401':
          $ref: '#/components/responses/UnauthorizedError'

  /auth/login:
    post:
      tags:
        - Auth
      summary: Login user
      operationId: loginUser
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/LoginInput'
      responses:
        '200':
          description: Login successful
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AuthResponse'
        '401':
          $ref: '#/components/responses/UnauthorizedError'

  /auth/logout:
    post:
      tags:
        - Auth
      summary: Logout user
      operationId: logoutUser
      responses:
        '200':
          description: Logout successful
          content:
            application/json:
              schema:
                type: object
                properties:
                  success: true
        '401':
          $ref: '#/components/responses/UnauthorizedError'

  /auth/refresh:
    post:
      tags:
        - Auth
      summary: Refresh authentication token
      operationId: refreshToken
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/RefreshTokenInput'
      responses:
        '200':
          description: Token refreshed
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AuthResponse'
        '401':
          $ref: '#/components/responses/UnauthorizedError'

components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
      description: JWT token obtained from /auth/login

  schemas:
    Pack:
      type: object
      properties:
        id:
          type: string
          description: Pack ID
        name:
          type: string
          description: Pack name
        category:
          type: string
          enum: [MVP, Monetisation, Automation, Niche, AssetType, Growth]
          description: Pack category
        description:
          type: string
          description: Pack description
        promptsCount:
          type: integer
          description: Number of prompts in pack
        estimatedTime:
          type: integer
          description: Estimated execution time in minutes
        estimatedCredits:
          type: integer
          description: Estimated credit cost
        complexity:
          type: integer
          enum: [1, 2, 3]
          description: Complexity level (1=simple, 3=complex)
        successRate:
          type: number
          format: float
          description: Success rate (0-100%)
        userRating:
          type: number
          format: float
          description: User rating (0-5)
        completionRate:
          type: number
          format: float
          description: Completion rate (0-100%)

    PackDetail:
      allOf:
        - $ref: '#/components/schemas/Pack'
        - type: object
          properties:
            phaseTags:
              type: array
              items:
                type: string
              description: Phase tags (Discovery, Build, Monetise, etc.)
            assetTypes:
              type: array
              items:
                type: string
              description: Compatible asset types
            niches:
              type: array
              items:
                type: string
              description: Compatible niches
            goals:
              type: array
              items:
                type: string
              description: Supported goals
            growthChannels:
              type: array
              items:
                type: string
              description: Supported growth channels
            dependencies:
              type: array
              items:
                type: string
              description: Pack IDs that should precede this
            prompts:
              type: array
              items:
                $ref: '#/components/schemas/Prompt'
              description: Prompts in this pack

    Prompt:
      type: object
      properties:
        id:
          type: string
          description: Prompt ID
        name:
          type: string
          description: Prompt name
        description:
          type: string
          description: Prompt description
        template:
          type: string
          description: Prompt template with variables
        contextVariables:
          type: array
          items:
            type: string
          description: Required context variables
        creditCost:
          type: integer
          description: Credit cost to execute
        estimatedTime:
          type: integer
          description: Estimated execution time in seconds

    ContextVariable:
      type: object
      properties:
        id:
          type: string
          description: Variable ID
        name:
          type: string
          description: Variable name
        description:
          type: string
          description: Variable description
        type:
          type: string
          enum: [string, number, boolean, array, object]
          description: Variable type
        required:
          type: boolean
          description: Whether variable is required
        default:
          description: Default value
        examples:
          type: array
          items: {}
          description: Example values

    ComposerInput:
      type: object
      required:
        - goal
        - assetType
        - niche
        - stage
        - timeHorizonWeeks
        - budget
        - skillLevel
      properties:
        goal:
          type: string
          enum: [build, monetise, automate, grow, optimise, full-journey]
          description: User goal
        assetType:
          type: string
          description: Asset type (SaaS, web app, mobile app, etc.)
        niche:
          type: string
          description: Niche (finance, fitness, creator, etc.)
        stage:
          type: string
          enum: [idea, pre-MVP, MVP, post-launch, scaling, plateaued]
          description: Current stage
        growthChannel:
          type: string
          enum: [organic, viral, paid, hybrid, unknown]
          description: Preferred growth channel
          default: hybrid
        timeHorizonWeeks:
          type: integer
          minimum: 1
          description: Available time in weeks
        budget:
          type: string
          enum: [low, medium, high]
          description: Budget level
        skillLevel:
          type: string
          enum: [beginner, intermediate, advanced]
          description: User skill level
        maxCredits:
          type: integer
          description: Maximum credit budget (optional)
        preferredPackTypes:
          type: array
          items:
            type: string
          description: Preferred pack types (optional)
        excludePackIds:
          type: array
          items:
            type: string
          description: Pack IDs to exclude (optional)

    ComposerOutput:
      type: object
      properties:
        sequenceId:
          type: string
          description: Sequence ID
        packs:
          type: array
          items:
            type: object
            properties:
              packId:
                type: string
              packName:
                type: string
              order:
                type: integer
              reason:
                type: string
              estimatedTime:
                type: integer
              estimatedCredits:
                type: integer
              alignment:
                type: object
                properties:
                  goal:
                    type: number
                  assetType:
                    type: number
                  niche:
                    type: number
                  stage:
                    type: number
                  growthChannel:
                    type: number
        totalPacks:
          type: integer
        totalTime:
          type: integer
        totalCredits:
          type: integer
        estimatedSuccess:
          type: number
          format: float
        riskLevel:
          type: string
          enum: [low, medium, high]
        suggestedPattern:
          type: string
        alternatives:
          type: array
          items:
            $ref: '#/components/schemas/ComposerOutput'

    ComposerSimulateInput:
      type: object
      required:
        - packIds
      properties:
        packIds:
          type: array
          items:
            type: string
          description: Pack IDs to simulate
        skillLevel:
          type: string
          enum: [beginner, intermediate, advanced]
          description: User skill level
        timeHorizonWeeks:
          type: integer
          description: Available time in weeks

    ComposerSimulateOutput:
      type: object
      properties:
        totalTime:
          type: integer
          description: Total time in minutes
        totalCredits:
          type: integer
          description: Total credits required
        complexity:
          type: integer
          enum: [1, 2, 3]
          description: Overall complexity
        feasible:
          type: boolean
          description: Whether sequence is feasible
        warnings:
          type: array
          items:
            type: string
          description: Any warnings

    ExecutePromptInput:
      type: object
      required:
        - promptId
        - contextVariables
      properties:
        promptId:
          type: string
          description: Prompt ID to execute
        contextVariables:
          type: object
          description: Context variables for prompt
        projectId:
          type: string
          description: Optional project ID

    ExecutePackInput:
      type: object
      required:
        - packId
        - contextVariables
      properties:
        packId:
          type: string
          description: Pack ID to execute
        contextVariables:
          type: object
          description: Context variables for pack
        projectId:
          type: string
          description: Optional project ID

    ExecutionResponse:
      type: object
      properties:
        executionId:
          type: string
          description: Execution ID
        status:
          type: string
          enum: [pending, running, completed, failed]
          description: Execution status
        createdAt:
          type: string
          format: date-time
          description: Creation timestamp
        estimatedCompletionTime:
          type: string
          format: date-time
          description: Estimated completion time

    ExecutionStatus:
      type: object
      properties:
        executionId:
          type: string
        status:
          type: string
          enum: [pending, running, completed, failed]
        progress:
          type: number
          format: float
          description: Progress percentage (0-100)
        creditsUsed:
          type: integer
        creditsRemaining:
          type: integer
        startedAt:
          type: string
          format: date-time
        completedAt:
          type: string
          format: date-time
        error:
          $ref: '#/components/schemas/Error'

    ExecutionOutput:
      type: object
      properties:
        executionId:
          type: string
        packId:
          type: string
        prompts:
          type: array
          items:
            type: object
            properties:
              promptId:
                type: string
              output:
                type: string
              tokensUsed:
                type: integer
        aggregatedOutput:
          type: string
        visualisations:
          type: array
          items:
            $ref: '#/components/schemas/Visualisation'

    CreditBalance:
      type: object
      properties:
        userId:
          type: string
        balance:
          type: integer
          description: Current credit balance
        subscriptionTier:
          type: string
          enum: [free, pro, enterprise]
        monthlyAllocation:
          type: integer
          description: Monthly credit allocation
        nextResetDate:
          type: string
          format: date-time
          description: Next reset date

    ConsumeCreditsInput:
      type: object
      required:
        - amount
        - reason
      properties:
        amount:
          type: integer
          minimum: 1
          description: Credits to consume
        reason:
          type: string
          description: Reason for consumption (execution_id, etc.)

    ReplenishCreditsInput:
      type: object
      required:
        - amount
        - reason
      properties:
        amount:
          type: integer
          minimum: 1
          description: Credits to replenish
        reason:
          type: string
          description: Reason for replenishment

    BillingTransaction:
      type: object
      properties:
        id:
          type: string
        userId:
          type: string
        amount:
          type: integer
        type:
          type: string
          enum: [debit, credit]
        reason:
          type: string
        createdAt:
          type: string
          format: date-time

    Visualisation:
      type: object
      properties:
        id:
          type: string
          description: Visualisation ID
        executionId:
          type: string
          description: Associated execution ID
        prompt:
          type: string
          description: Image generation prompt
        creditsCost:
          type: integer
          description: Credits consumed
        status:
          type: string
          enum: [pending, generated, edited]
        createdAt:
          type: string
          format: date-time
        editedAt:
          type: string
          format: date-time

    GenerateVisualisationInput:
      type: object
      required:
        - executionId
      properties:
        executionId:
          type: string
          description: Execution ID to generate visualisation for
        style:
          type: string
          description: Optional style preference

    EditVisualisationInput:
      type: object
      required:
        - prompt
      properties:
        prompt:
          type: string
          description: Updated prompt

    User:
      type: object
      properties:
        id:
          type: string
        email:
          type: string
          format: email
        subscriptionTier:
          type: string
          enum: [free, pro, enterprise]
        creditBalance:
          type: integer
        createdAt:
          type: string
          format: date-time
        updatedAt:
          type: string
          format: date-time

    UpdateUserInput:
      type: object
      properties:
        email:
          type: string
          format: email
        preferences:
          type: object
          description: User preferences

    Project:
      type: object
      properties:
        id:
          type: string
        userId:
          type: string
        name:
          type: string
        assetType:
          type: string
        niche:
          type: string
        stage:
          type: string
        createdAt:
          type: string
          format: date-time
        updatedAt:
          type: string
          format: date-time

    CreateProjectInput:
      type: object
      required:
        - name
        - assetType
        - niche
        - stage
      properties:
        name:
          type: string
        assetType:
          type: string
        niche:
          type: string
        stage:
          type: string

    ProjectContext:
      type: object
      properties:
        projectId:
          type: string
        goal:
          type: string
        assetType:
          type: string
        niche:
          type: string
        stage:
          type: string
        growthChannel:
          type: string
        customContext:
          type: object
          description: Custom context variables

    LoginInput:
      type: object
      required:
        - email
        - password
      properties:
        email:
          type: string
          format: email
        password:
          type: string
          format: password

    AuthResponse:
      type: object
      properties:
        accessToken:
          type: string
          description: JWT access token
        refreshToken:
          type: string
          description: JWT refresh token
        expiresIn:
          type: integer
          description: Token expiration in seconds
        user:
          $ref: '#/components/schemas/User'

    RefreshTokenInput:
      type: object
      required:
        - refreshToken
      properties:
        refreshToken:
          type: string

    Recommendation:
      type: object
      properties:
        pattern:
          type: string
        packs:
          type: integer
        estimatedTime:
          type: integer
        estimatedCredits:
          type: integer
        successRate:
          type: number

    Error:
      type: object
      properties:
        code:
          type: string
          description: Error code
        message:
          type: string
          description: Error message
        details:
          type: object
          description: Additional error details
        timestamp:
          type: string
          format: date-time

  responses:
    UnauthorizedError:
      description: Unauthorized
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
          example:
            code: UNAUTHORIZED
            message: Invalid or missing authentication token
            timestamp: 2024-01-28T12:00:00Z

    BadRequestError:
      description: Bad request
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
          example:
            code: BAD_REQUEST
            message: Invalid request parameters
            details:
              field: goal
              reason: Invalid enum value
            timestamp: 2024-01-28T12:00:00Z

    NotFoundError:
      description: Not found
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
          example:
            code: NOT_FOUND
            message: Resource not found
            timestamp: 2024-01-28T12:00:00Z

    InsufficientCreditsError:
      description: Insufficient credits
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
          example:
            code: INSUFFICIENT_CREDITS
            message: User does not have enough credits
            details:
              required: 450
              available: 100
            timestamp: 2024-01-28T12:00:00Z

    RateLimitError:
      description: Rate limit exceeded
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
          example:
            code: RATE_LIMIT_EXCEEDED
            message: Too many requests
            details:
              limit: 100
              window: 60
              retryAfter: 30
            timestamp: 2024-01-28T12:00:00Z
```

---

# PART 3: DATA MODELS & SCHEMA DEFINITIONS

## Complete Data Models

### User Model
```typescript
interface User {
  id: UUID;
  email: string;
  authProvider: 'supabase' | 'auth0' | 'oauth';
  subscriptionTier: 'free' | 'pro' | 'enterprise';
  creditBalance: integer;
  monthlyAllocation: integer;
  nextResetDate: timestamp;
  preferences: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    theme: 'light' | 'dark';
    language: string;
  };
  createdAt: timestamp;
  updatedAt: timestamp;
  deletedAt: timestamp | null;
}
```

### Project Model
```typescript
interface Project {
  id: UUID;
  userId: UUID;
  name: string;
  description: string | null;
  assetType: string;
  niche: string;
  stage: 'idea' | 'pre-MVP' | 'MVP' | 'post-launch' | 'scaling' | 'plateaued';
  status: 'active' | 'archived' | 'deleted';
  customContext: object;
  createdAt: timestamp;
  updatedAt: timestamp;
  deletedAt: timestamp | null;
}
```

### Pack Model
```typescript
interface Pack {
  id: string;
  name: string;
  category: 'MVP' | 'Monetisation' | 'Automation' | 'Niche' | 'AssetType' | 'Growth';
  description: string;
  phaseTags: string[];
  assetTypes: string[];
  niches: string[];
  goals: string[];
  growthChannels: string[];
  complexity: 1 | 2 | 3;
  timeCost: integer;
  creditCost: integer;
  dependencies: string[];
  successRate: float;
  userRating: float;
  completionRate: float;
  version: integer;
  createdAt: timestamp;
  updatedAt: timestamp;
}
```

### Execution Model
```typescript
interface Execution {
  id: UUID;
  userId: UUID;
  projectId: UUID | null;
  packId: string | null;
  promptIds: string[];
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  creditsUsed: integer;
  creditsReserved: integer;
  output: string | null;
  error: object | null;
  startedAt: timestamp;
  completedAt: timestamp | null;
  createdAt: timestamp;
  updatedAt: timestamp;
}
```

### Visualisation Model
```typescript
interface Visualisation {
  id: UUID;
  userId: UUID;
  executionId: UUID;
  prompt: string;
  editedPrompt: string | null;
  creditsCost: integer;
  status: 'pending' | 'generated' | 'edited';
  createdAt: timestamp;
  editedAt: timestamp | null;
  deletedAt: timestamp | null;
}
```

### CreditTransaction Model
```typescript
interface CreditTransaction {
  id: UUID;
  userId: UUID;
  amount: integer;
  type: 'debit' | 'credit';
  reason: string;
  referenceId: string | null;
  createdAt: timestamp;
}
```

### Subscription Model
```typescript
interface Subscription {
  id: UUID;
  userId: UUID;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  tier: 'free' | 'pro' | 'enterprise';
  status: 'active' | 'cancelled' | 'past_due';
  currentPeriodStart: timestamp;
  currentPeriodEnd: timestamp;
  cancelledAt: timestamp | null;
  createdAt: timestamp;
  updatedAt: timestamp;
}
```

### WebhookEvent Model
```typescript
interface WebhookEvent {
  id: UUID;
  source: 'stripe' | 'other';
  eventType: string;
  payload: object;
  processed: boolean;
  processedAt: timestamp | null;
  error: string | null;
  retries: integer;
  createdAt: timestamp;
  updatedAt: timestamp;
}
```

---

# PART 4: SECURITY & COMPLIANCE LAYER

## JWT Structure
```typescript
interface JWTPayload {
  sub: string;  // User ID
  email: string;
  tier: 'free' | 'pro' | 'enterprise';
  iat: number;  // Issued at
  exp: number;  // Expiration (24 hours)
  aud: string;  // Audience (PromptForge)
  iss: string;  // Issuer
}
```

## Role Model
```typescript
enum Role {
  USER = 'user',
  ADMIN = 'admin'
}

interface RolePermission {
  role: Role;
  permissions: {
    canExecutePacks: boolean;
    canCompose: boolean;
    canViewBilling: boolean;
    canManageUsers: boolean;  // Admin only
    canModifyPacks: boolean;  // Admin only
  };
}
```

## Rate Limits
```typescript
interface RateLimitConfig {
  execution: {
    requestsPerMinute: 100;
    burstSize: 10;
  };
  composer: {
    requestsPerMinute: 50;
    burstSize: 5;
  };
  billing: {
    requestsPerMinute: 10;
    burstSize: 2;
  };
  auth: {
    requestsPerMinute: 20;
    burstSize: 3;
  };
}
```

## Abuse Prevention
```typescript
interface AbuseDetection {
  // Track suspicious patterns
  unusualCreditConsumption: {
    threshold: 10000;  // credits in 1 hour
    action: 'flag' | 'block';
  };
  
  // Detect credential stuffing
  failedLoginAttempts: {
    threshold: 5;
    window: 300;  // seconds
    action: 'block';
  };
  
  // Detect API abuse
  unusualRequestPatterns: {
    threshold: 1000;  // requests in 1 hour
    action: 'rate_limit' | 'block';
  };
}
```

## Stripe Signature Verification
```typescript
// Verify webhook signature
function verifyStripeWebhook(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const timestamp = signature.split(',')[0].split('=')[1];
  const signatures = signature.split(',');
  
  const signedContent = `${timestamp}.${payload}`;
  const hash = crypto
    .createHmac('sha256', secret)
    .update(signedContent)
    .digest('hex');
  
  return signatures.some(sig => {
    const [scheme, value] = sig.split('=');
    return scheme === 'v1' && value === hash;
  });
}
```

## Data Retention
```typescript
interface DataRetention {
  executionHistory: {
    retention: 90;  // days
    archiveAfter: 30;
  };
  
  creditTransactions: {
    retention: 365;  // days
    archiveAfter: 90;
  };
  
  logs: {
    retention: 30;  // days
    archiveAfter: 7;
  };
  
  deletedUsers: {
    retention: 30;  // days (for recovery)
    permanentDelete: true;
  };
}
```

## Logging & Audit Trails
```typescript
interface AuditLog {
  id: UUID;
  userId: UUID;
  action: string;
  resource: string;
  resourceId: string;
  changes: {
    before: object;
    after: object;
  };
  ipAddress: string;
  userAgent: string;
  timestamp: timestamp;
}

// Log all critical actions:
// - User login/logout
// - Credit consumption
// - Subscription changes
// - Pack execution
// - Admin actions
```

---

This completes the comprehensive Architecture Diagram Set and OpenAPI Specification for PromptForge.

