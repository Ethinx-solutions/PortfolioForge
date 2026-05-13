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
(Content truncated due to size limit. Use line ranges to read remaining content)