# PromptForge Backend Architecture Specification
## Complete Production-Ready Infrastructure

---

## SECTION 1: BACKEND ARCHITECTURE

### 1.1 Recommended Backend Stack

**Technology Choices:**

| Component | Technology | Rationale |
|-----------|-----------|-----------|
| **Runtime** | Node.js 20 LTS | Fast, scalable, JavaScript ecosystem |
| **Framework** | Express.js + TypeScript | Lightweight, type-safe, proven |
| **API Gateway** | AWS API Gateway | Managed, scalable, integrated with AWS |
| **Authentication** | Auth0 + JWT | Enterprise-grade, OAuth2 support |
| **Database** | PostgreSQL 15 | ACID compliance, JSON support, scalable |
| **Cache** | Redis 7 | In-memory caching, session management |
| **Message Queue** | AWS SQS | Asynchronous processing, reliable delivery |
| **File Storage** | AWS S3 | Scalable, durable, cost-effective |
| **Compute** | AWS Lambda + ECS | Serverless + containerized options |
| **Monitoring** | DataDog + CloudWatch | Comprehensive observability |
| **Logging** | ELK Stack (Elasticsearch) | Centralized logging, searchable |
| **Search** | Elasticsearch | Full-text search for packs/templates |

**Architecture Pattern:** Microservices with API Gateway

---

### 1.2 Data Models

#### User Model
```typescript
interface User {
  id: string;                    // UUID
  email: string;                 // Unique, indexed
  passwordHash: string;          // Bcrypt hash
  firstName: string;
  lastName: string;
  avatar: string;                // S3 URL
  subscription: SubscriptionRef;
  credits: number;               // Current credit balance
  totalCreditsUsed: number;      // Lifetime tracking
  preferences: UserPreferences;
  createdAt: timestamp;
  updatedAt: timestamp;
  deletedAt: timestamp;          // Soft delete
  
  // Indices
  email_idx: unique
  subscription_idx: indexed
}

interface UserPreferences {
  theme: 'light' | 'dark';
  language: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  twoFactorEnabled: boolean;
  apiKeyRotationDays: number;
}
```

#### Subscription Model
```typescript
interface Subscription {
  id: string;                    // UUID
  userId: string;                // Foreign key
  stripeCustomerId: string;      // Stripe reference
  stripeSubscriptionId: string;  // Stripe reference
  plan: 'free' | 'pro' | 'enterprise';
  status: 'active' | 'past_due' | 'canceled' | 'paused';
  monthlyCredits: number;        // Credits per month
  creditsUsedThisMonth: number;
  creditResetDate: date;         // When credits reset
  currentPeriodStart: date;
  currentPeriodEnd: date;
  cancelAtPeriodEnd: boolean;
  canceledAt: timestamp;
  createdAt: timestamp;
  updatedAt: timestamp;
  
  // Indices
  userId_idx: indexed
  stripeCustomerId_idx: indexed
  status_idx: indexed
}

interface SubscriptionPlans {
  free: {
    monthlyCredits: 100;
    maxPacks: 5;
    maxVisualizations: 10;
    features: ['basic_packs', 'community_support'];
  };
  pro: {
    monthlyCredits: 5000;
    maxPacks: 'unlimited';
    maxVisualizations: 'unlimited';
    features: ['all_packs', 'priority_support', 'api_access', 'custom_integrations'];
    price: '$99/month';
  };
  enterprise: {
    monthlyCredits: 'custom';
    maxPacks: 'unlimited';
    maxVisualizations: 'unlimited';
    features: ['all_packs', 'dedicated_support', 'sso', 'custom_contracts'];
    price: 'custom';
  };
}
```

#### Pack Execution Model
```typescript
interface PackExecution {
  id: string;                    // UUID
  userId: string;                // Foreign key
  packId: string;                // Which pack was executed
  promptId: string;              // Which prompt in pack
  status: 'pending' | 'running' | 'completed' | 'failed';
  inputVariables: Record<string, any>;
  output: string;                // Generated prompt/content
  creditsUsed: number;           // Credits consumed
  executionTime: number;         // Milliseconds
  model: string;                 // LLM model used (gpt-4, claude-3, etc.)
  temperature: number;           // LLM temperature
  maxTokens: number;             // LLM max tokens
  error: string;                 // Error message if failed
  createdAt: timestamp;
  updatedAt: timestamp;
  
  // Indices
  userId_idx: indexed
  packId_idx: indexed
  status_idx: indexed
  createdAt_idx: indexed
}
```

#### Usage Tracking Model
```typescript
interface UsageRecord {
  id: string;                    // UUID
  userId: string;                // Foreign key
  subscriptionId: string;        // Foreign key
  eventType: 'pack_execution' | 'visualization' | 'api_call' | 'export';
  creditsUsed: number;
  metadata: Record<string, any>; // Event-specific data
  ipAddress: string;             // For fraud detection
  userAgent: string;
  createdAt: timestamp;
  
  // Indices
  userId_idx: indexed
  subscriptionId_idx: indexed
  eventType_idx: indexed
  createdAt_idx: indexed
}

interface UsageSummary {
  userId: string;
  month: date;
  totalCreditsUsed: number;
  packExecutions: number;
  visualizations: number;
  apiCalls: number;
  exports: number;
  averageExecutionTime: number;
}
```

#### History Model
```typescript
interface ExecutionHistory {
  id: string;                    // UUID
  userId: string;                // Foreign key
  title: string;                 // User-provided title
  description: string;
  packExecution: PackExecutionRef;
  tags: string[];                // For filtering/search
  starred: boolean;              // Favorite marker
  sharedWith: string[];          // User IDs with access
  isPublic: boolean;             // Public sharing
  publicUrl: string;             // Shareable link
  createdAt: timestamp;
  updatedAt: timestamp;
  deletedAt: timestamp;          // Soft delete
  
  // Indices
  userId_idx: indexed
  createdAt_idx: indexed
  tags_idx: indexed
}
```

#### Visualisation Module Model
```typescript
interface VisualisationJob {
  id: string;                    // UUID
  userId: string;                // Foreign key
  packExecutionId: string;       // Reference to pack execution
  prompt: string;                // Image generation prompt
  imageUrl: string;              // Generated image S3 URL
  status: 'pending' | 'processing' | 'completed' | 'failed';
  model: string;                 // Image model (DALL-E, Midjourney, etc.)
  creditsUsed: number;           // Credits for visualization
  error: string;                 // Error message if failed
  createdAt: timestamp;
  completedAt: timestamp;
  
  // Indices
  userId_idx: indexed
  packExecutionId_idx: indexed
  status_idx: indexed
}
```

---

### 1.3 API Endpoints

#### Authentication Endpoints
```
POST   /auth/signup              → Register new user
POST   /auth/login               → Login with email/password
POST   /auth/logout              → Logout and invalidate token
POST   /auth/refresh             → Refresh JWT token
POST   /auth/forgot-password     → Request password reset
POST   /auth/reset-password      → Reset password with token
POST   /auth/oauth/google        → OAuth2 Google login
POST   /auth/oauth/github        → OAuth2 GitHub login
POST   /auth/2fa/enable          → Enable two-factor auth
POST   /auth/2fa/verify          → Verify 2FA code
```

#### User Profile Endpoints
```
GET    /users/me                 → Get current user profile
PUT    /users/me                 → Update user profile
GET    /users/me/preferences     → Get user preferences
PUT    /users/me/preferences     → Update user preferences
GET    /users/me/subscription    → Get subscription details
GET    /users/me/credits         → Get credit balance
GET    /users/me/usage           → Get usage statistics
DELETE /users/me                 → Delete account
```

#### Pack Execution Endpoints
```
POST   /packs/:packId/execute    → Execute a pack
  Request: {
    promptId: string;
    inputVariables: Record<string, any>;
    model?: string;
    temperature?: number;
    maxTokens?: number;
  }
  Response: {
    executionId: string;
    status: string;
    output: string;
    creditsUsed: number;
    executionTime: number;
  }

GET    /executions/:executionId  → Get execution details
GET    /executions               → List user's executions (paginated)
DELETE /executions/:executionId  → Delete execution
POST   /executions/:executionId/save → Save to history
POST   /executions/:executionId/export → Export execution
```

#### Subscription Endpoints
```
GET    /subscriptions/plans      → List available plans
POST   /subscriptions/upgrade    → Upgrade subscription
POST   /subscriptions/downgrade  → Downgrade subscription
POST   /subscriptions/cancel     → Cancel subscription
GET    /subscriptions/invoices   → Get invoice history
GET    /subscriptions/usage      → Get usage breakdown
POST   /subscriptions/add-credits → Add credits (one-time)
```

#### Visualisation Endpoints
```
POST   /visualisations           → Generate visualization
  Request: {
    packExecutionId: string;
    prompt: string;
    model?: string;
  }
  Response: {
    jobId: string;
    status: string;
    imageUrl?: string;
  }

GET    /visualisations/:jobId    → Get visualization status
GET    /visualisations           → List user's visualizations
DELETE /visualisations/:jobId    → Delete visualization
```

#### History Endpoints
```
GET    /history                  → List execution history
POST   /history/:executionId/save → Save execution to history
GET    /history/:historyId       → Get history item
PUT    /history/:historyId       → Update history item
DELETE /history/:historyId       → Delete history item
POST   /history/:historyId/share → Share history item
GET    /history/:historyId/public → Get public history item
```

#### Admin Endpoints
```
GET    /admin/users              → List all users (paginated)
GET    /admin/users/:userId      → Get user details
PUT    /admin/users/:userId      → Update user
DELETE /admin/users/:userId      → Delete user
GET    /admin/subscriptions      → List all subscriptions
GET    /admin/usage              → Global usage statistics
GET    /admin/analytics          → Analytics dashboard
POST   /admin/credits/adjust     → Adjust user credits
```

---

### 1.4 Security Model

#### Authentication & Authorization
```
JWT Token Structure:
{
  sub: userId,
  email: user.email,
  iat: issuedAt,
  exp: expiresAt (24 hours),
  role: 'user' | 'admin' | 'enterprise',
  permissions: ['read:packs', 'execute:packs', 'create:visualizations']
}

Refresh Token:
- Stored in httpOnly cookie
- 30-day expiration
- Rotated on each refresh
- Invalidated on logout
```

#### Role-Based Access Control (RBAC)
```
Roles:
- user: Standard user access
- admin: Full platform access
- enterprise: Custom permissions

Permissions Matrix:
┌─────────────────────┬──────┬───────┬────────────┐
│ Resource            │ User │ Admin │ Enterprise │
├─────────────────────┼──────┼───────┼────────────┤
│ Read own profile    │  ✓   │  ✓    │     ✓      │
│ Update own profile  │  ✓   │  ✓    │     ✓      │
│ Execute packs       │  ✓   │  ✓    │     ✓      │
│ Create visualizations│ ✓   │  ✓    │     ✓      │
│ Read all users      │  ✗   │  ✓    │     ✗      │
│ Manage subscriptions│  ✓   │  ✓    │     ✓      │
│ API access          │  ✓   │  ✓    │     ✓      │
│ SSO setup           │  ✗   │  ✗    │     ✓      │
└─────────────────────┴──────┴───────┴────────────┘
```

#### Rate Limiting
```
Tier-Based Rate Limiting:

Free Tier:
- 10 requests/minute (general)
- 5 pack executions/minute
- 100 requests/day (total)

Pro Tier:
- 60 requests/minute (general)
- 30 pack executions/minute
- 10,000 requests/day (total)

Enterprise:
- Custom limits
- Dedicated rate limit pool

Implementation:
- Redis-backed rate limiter
- Token bucket algorithm
- Per-user tracking
- IP-based fallback
```

#### Data Encryption
```
In Transit:
- TLS 1.3 for all connections
- HSTS headers
- Certificate pinning for mobile apps

At Rest:
- AES-256 encryption for sensitive data
- Encrypted database fields:
  - User passwords (bcrypt)
  - API keys (hashed)
  - Payment information (tokenized via Stripe)
  - Personal data (encrypted with KMS)

Key Management:
- AWS KMS for key storage
- Key rotation every 90 days
- Separate keys per environment
```

---

### 1.5 Error Handling & Logging Strategy

#### Error Codes
```
2xx Success
- 200: OK
- 201: Created
- 204: No Content

4xx Client Errors
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 409: Conflict
- 429: Too Many Requests
- 422: Unprocessable Entity

5xx Server Errors
- 500: Internal Server Error
- 502: Bad Gateway
- 503: Service Unavailable
- 504: Gateway Timeout

Custom Error Codes:
- 1001: Insufficient Credits
- 1002: Pack Not Found
- 1003: Invalid Input Variables
- 1004: Execution Timeout
- 1005: Rate Limit Exceeded
```

#### Error Response Format
```json
{
  "error": {
    "code": "1001",
    "message": "Insufficient credits for this operation",
    "details": {
      "required": 500,
      "available": 200
    },
    "requestId": "req_12345",
    "timestamp": "2024-01-28T10:30:00Z"
  }
}
```

#### Logging Strategy
```
Log Levels:
- ERROR: System errors, exceptions
- WARN: Warnings, deprecated usage
- INFO: General information, key events
- DEBUG: Detailed debugging information
- TRACE: Very detailed trace information

Logged Events:
- User authentication (login, logout, token refresh)
- Pack executions (start, completion, errors)
- Credit transactions
- Subscription changes
- API errors
- Security events (failed auth, rate limits)
- Performance metrics (execution time, latency)

Log Format:
{
  "timestamp": "2024-01-28T10:30:00Z",
  "level": "INFO",
  "service": "promptforge-api",
  "userId": "user_123",
  "requestId": "req_12345",
  "action": "pack_executed",
  "packId": "pack_456",
  "status": "success",
  "duration": 1234,
  "creditsUsed": 50,
  "metadata": {}
}

Retention:
- ERROR logs: 90 days
- WARN logs: 30 days
- INFO logs: 7 days
- DEBUG logs: 1 day
```

---

### 1.6 Scalability Plan

#### Horizontal Scaling
```
Load Balancing:
- AWS Application Load Balancer (ALB)
- Round-robin distribution
- Health checks every 30 seconds
- Connection draining: 30 seconds

Auto-Scaling:
- Target: 70% CPU utilization
- Min instances: 2
- Max instances: 20
- Scale-up: +2 instances per minute
- Scale-down: -1 instance per 5 minutes

Database Scaling:
- Read replicas for read-heavy operations
- Connection pooling (PgBouncer)
- Query optimization and indexing
- Sharding strategy for user data (by userId)
```

#### Caching Strategy
```
Redis Caching Layers:

Layer 1: User Session Cache
- Key: session:{sessionId}
- TTL: 24 hours
- Size: ~1KB per session

Layer 2: Pack Metadata Cache
- Key: pack:{packId}
- TTL: 7 days
- Size: ~10KB per pack
- Invalidation: On pack update

Layer 3: User Credits Cache
- Key: credits:{userId}
- TTL: 1 hour
- Size: ~100 bytes per user
- Invalidation: On credit transaction

Layer 4: Subscription Cache
- Key: subscription:{userId}
- TTL: 1 hour
- Size: ~500 bytes per subscription
- Invalidation: On subscription change

Cache Hit Target: 80%+
Cache Size: 100GB Redis cluster
```

#### Serverless vs. Containerized
```
Serverless (AWS Lambda):
- Pack execution (short-lived)
- Visualization generation
- Email sending
- Webhook processing
- Scheduled tasks

Containerized (ECS):
- API server (always-on)
- WebSocket server (real-time updates)
- Background workers
- Data processing pipelines

Hybrid Benefits:
- Cost optimization
- Scalability
- Reliability
- Flexibility
```

---

## SECTION 2: SUBSCRIPTION & BILLING SYSTEM

### 2.1 Subscription Architecture

#### Plan Structure
```
Free Plan:
- Monthly Credits: 100
- Pack Executions: Unlimited (within credits)
- Visualizations: 10/month
- API Access: No
- Support: Community
- Price: $0

Pro Plan:
- Monthly Credits: 5,000
- Pack Executions: Unlimited
- Visualizations: Unlimited
- API Access: Yes (1,000 calls/day)
- Support: Email (24-hour response)
- Price: $99/month or $990/year (10% discount)

Enterprise Plan:
- Monthly Credits: Custom
- Pack Executions: Unlimited
- Visualizations: Unlimited
- API Access: Yes (unlimited)
- Support: Dedicated account manager
- SSO: Yes
- Custom contracts: Yes
- Price: Custom (starting $5,000/month)
```

#### Credit System
```
Credit Consumption:

Pack Execution:
- Small pack (< 1000 tokens): 10 credits
- Medium pack (1000-5000 tokens): 50 credits
- Large pack (> 5000 tokens): 100 credits
- Custom model (GPT-4): 2x multiplier
- Custom model (Claude 3): 1.5x multiplier

Visualization:
- Basic visualization: 25 credits
- Advanced visualization: 50 credits
- Custom style: 75 credits

API Calls:
- Included in plan limits
- Overage: $0.01 per call

Credit Replenishment:
- Monthly: On subscription renewal
- Rollover: No (unused credits expire)
- Purchase: $0.01 per credit (minimum 1,000 credits)
- Bonus: Referral program (100 credits per referral)
```

---

### 2.2 Stripe Integration

#### Stripe Setup
```
Stripe Products:
- Product: PromptForge Pro
  - Price: $99/month (recurring)
  - Price: $990/year (recurring)
  - Metadata: tier=pro, credits=5000

- Product: PromptForge Enterprise
  - Price: Custom (contact sales)
  - Metadata: tier=enterprise

Webhook Events:
- customer.subscription.created
- customer.subscription.updated
- customer.subscription.deleted
- invoice.payment_succeeded
- invoice.payment_failed
- charge.refunded
```

#### Webhook Handler
```typescript
interface WebhookEvent {
  type: string;
  data: Record<string, any>;
  timestamp: number;
}

Webhook Processing:
1. Verify Stripe signature
2. Idempotency check (using event ID)
3. Process event
4. Update database
5. Send confirmation email
6. Log event

Retry Logic:
- Exponential backoff
- Maximum 5 retries
- Dead letter queue for failed events
```

#### Customer Portal
```
Stripe Customer Portal Features:
- View current subscription
- Update payment method
- Download invoices
- Change billing email
- Cancel subscription
- Upgrade/downgrade plan
- View billing history

Portal Configuration:
- Hosted on Stripe domain
- Redirect after session: /dashboard
- Allowed return URLs: [production domain]
```

---

### 2.3 Usage-Based Billing

#### Metered Billing
```
Optional Usage-Based Add-On:

Base Plan: $99/month (Pro)
- Includes: 5,000 credits

Usage-Based Add-On:
- $0.01 per credit
- Billed at end of month
- Aggregated usage tracking
- Overage notifications

Example:
- Base: $99
- Usage: 10,000 credits × $0.01 = $100
- Total: $199

Billing Cycle:
- Meter usage daily
- Aggregate monthly
- Invoice on subscription renewal date
- Payment due within 30 days
```

---

### 2.4 Freemium → Pro → Enterprise Tier Structure

#### Upgrade/Downgrade Logic
```
Upgrade (Free → Pro):
1. User selects Pro plan
2. Redirect to Stripe checkout
3. Create Stripe subscription
4. Webhook: customer.subscription.created
5. Update user subscription in database
6. Grant Pro features immediately
7. Send welcome email
8. Proration: Charge difference for remainder of month

Downgrade (Pro → Free):
1. User selects Free plan
2. Confirm downgrade
3. Cancel Stripe subscription (at period end)
4. Update user subscription status
5. Send confirmation email
6. On period end:
   - Webhook: customer.subscription.deleted
   - Revoke Pro features
   - Reset credits to Free tier limit
   - Archive API keys

Downgrade (Pro → Enterprise):
1. Contact sales
2. Custom quote generated
3. New Stripe subscription created
4. SSO setup
5. Dedicated support assigned
6. Proration: Credit for unused Pro time
```

---

### 2.5 Anti-Fraud & Abuse Prevention

#### Fraud Detection
```
Velocity Checks:
- Multiple signups from same IP: Flag if > 5/hour
- Multiple payment methods from same IP: Flag if > 3/day
- Rapid subscription changes: Flag if > 2/day
- Unusual credit consumption: Flag if > 10x average

Behavioral Analysis:
- Anomaly detection on usage patterns
- Geographic inconsistencies
- Device fingerprinting
- User agent analysis

Actions:
- Warn: Send security email
- Block: Require verification
- Suspend: Manual review required
```

#### Abuse Prevention
```
Credit Limits:
- Daily execution limit: 1,000 (Pro)
- Hourly execution limit: 100 (Pro)
- Concurrent executions: 5 (Pro)

Rate Limiting:
- API rate limits per tier
- IP-based rate limiting
- User-based rate limiting

Monitoring:
- Alert on unusual patterns
- Manual review queue
- Automatic suspension for confirmed abuse
```

---

### 2.6 Refund Logic

#### Refund Policy
```
Refund Eligibility:
- Within 14 days of purchase
- Unused credits only
- Subscription cancellations: Prorated refund

Refund Process:
1. User requests refund
2. Verify eligibility
3. Calculate refund amount
4. Process via Stripe
5. Update database
6. Send confirmation email
7. Log refund reason

Refund Scenarios:
- Accidental purchase: Full refund
- Service issue: Full refund
- Changed mind: 50% refund
- Technical problem: Full refund + credit

Refund Timeline:
- Processing: Immediate in system
- Bank: 3-5 business days
```

---

### 2.7 Compliance

#### PCI Compliance
```
PCI DSS Level 1:
- All payment processing via Stripe
- No credit card data stored
- Tokenized payment methods
- Encrypted connections (TLS 1.3)
- Regular security audits
- Vulnerability scanning
```

#### GDPR Compliance
```
Data Rights:
- Right to access: /api/users/me/export
- Right to deletion: /api/users/me/delete
- Right to portability: /api/users/me/export
- Right to rectification: /api/users/me (PUT)

Data Processing:
- Privacy policy on website
- Terms of service
- Data processing agreement
- Consent management
- Cookie consent
- Third-party vendor agreements

Data Retention:
- User data: Until account deletion
- Usage logs: 90 days
- Billing records: 7 years (tax requirement)
- Support tickets: 1 year
```

#### Tax Compliance
```
Tax Calculation:
- Stripe Tax integration
- Automatic tax rate lookup
- Tax ID validation
- Reverse charge for B2B

Tax Reporting:
- Monthly tax summary
- Quarterly tax filings
- Annual tax reports
- VAT/GST compliance

Supported Jurisdictions:
- US (all states)
- EU (all countries)
- UK
- Canada
- Australia
```

---

This completes the Backend Architecture and Subscription & Billing System specification. The next sections will cover Transaction Flow, Marketing Infrastructure, Build/Deployment, Delivery Infrastructure, and Operational Playbooks.

