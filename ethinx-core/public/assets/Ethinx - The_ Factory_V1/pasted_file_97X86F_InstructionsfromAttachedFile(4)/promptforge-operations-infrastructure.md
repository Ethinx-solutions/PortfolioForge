# PromptForge Operations & Infrastructure Specification
## Transaction Flow, Marketing, Build/Deployment, and Delivery

---

## SECTION 3: TRANSACTION FLOW

### 3.1 User Signup → Onboarding → Subscription → Usage → Renewal

#### Signup Flow
```
Step 1: User Registration
- User navigates to /signup
- Enters email, password, name
- Email verification sent
- User clicks verification link
- Account created in database
- Default to Free tier
- Onboarding email sent

Step 2: Email Verification
- Verification token generated (24-hour expiration)
- Email sent with verification link
- User clicks link
- Token validated
- Email marked as verified
- User redirected to onboarding

Step 3: Profile Completion
- User completes profile (optional)
- Avatar upload
- Bio/description
- Preferences set
- Onboarding tutorial shown
- Free credits granted (100)
```

#### Onboarding Flow
```
Step 1: Welcome Email
- Sent immediately after signup
- Contains: Getting started guide, first pack recommendation
- CTA: Start with first pack

Step 2: In-App Onboarding
- Interactive tutorial (5 minutes)
- Show: Packs, execution, history, settings
- Offer: Free trial of Pro features (7 days)
- CTA: Upgrade to Pro

Step 3: First Pack Execution
- Guided walkthrough of first pack
- Explain: Input variables, output, credits
- Show: Execution history
- CTA: Try another pack

Step 4: Onboarding Email Sequence (7 days)
- Day 1: Welcome + getting started
- Day 2: First pack execution guide
- Day 3: Monetisation packs overview
- Day 4: Automation packs overview
- Day 5: Growth packs overview
- Day 6: Pro features overview
- Day 7: Upgrade offer (20% discount for 3 months)
```

#### Subscription Flow
```
Step 1: User Selects Plan
- User navigates to /pricing
- Selects Pro plan
- Clicks "Subscribe Now"
- Redirected to Stripe checkout

Step 2: Payment Processing
- Stripe checkout page
- User enters payment details
- Stripe validates payment
- Subscription created
- Webhook: customer.subscription.created

Step 3: Database Update
- Subscription record created
- User tier updated to Pro
- Credits reset to 5,000
- Pro features enabled
- API keys generated

Step 4: Confirmation Email
- Sent to user
- Contains: Subscription details, invoice, next billing date
- CTA: Start using Pro features

Step 5: Welcome Email (Pro)
- Sent after subscription
- Contains: Pro features guide, API documentation
- CTA: Explore advanced features
```

#### Usage Flow
```
Step 1: Pack Execution
- User selects pack
- Enters input variables
- Clicks "Execute"
- Request sent to API

Step 2: Credit Deduction
- Check user has sufficient credits
- If insufficient: Return error (1001)
- Deduct credits from account
- Create usage record
- Proceed with execution

Step 3: Execution Processing
- Route to appropriate LLM
- Generate output
- Store execution record
- Update usage statistics

Step 4: Result Display
- Return output to user
- Show credits used
- Show execution time
- Offer: Save to history, export, share

Step 5: History Tracking
- User can save execution to history
- Add title, description, tags
- Store in history database
- Make shareable (optional)
```

#### Renewal Flow
```
Step 1: Subscription Renewal (Monthly)
- 3 days before renewal: Reminder email sent
- On renewal date: Stripe charges payment
- Webhook: invoice.payment_succeeded

Step 2: Credit Reset
- Credits reset to monthly limit
- Unused credits expire
- Usage counter reset
- New billing period starts

Step 3: Renewal Confirmation
- Email sent with invoice
- Contains: Charges, next billing date, usage summary
- CTA: View invoice

Step 4: Failed Payment Handling
- Webhook: invoice.payment_failed
- Retry after 3 days
- If retry fails: Dunning sequence starts
```

---

### 3.2 Pack Execution Credit Cost Model

#### Credit Calculation
```
Base Cost Calculation:
- Small pack (< 1000 tokens): 10 credits
- Medium pack (1000-5000 tokens): 50 credits
- Large pack (> 5000 tokens): 100 credits

Model Multipliers:
- GPT-3.5: 1x (base cost)
- GPT-4: 2x (base cost)
- Claude 3 Opus: 1.5x (base cost)
- Claude 3 Sonnet: 1.2x (base cost)

Temperature/Token Adjustments:
- Higher temperature: +10% cost
- Higher max tokens: +5% per 1000 tokens

Final Cost:
cost = base_cost × model_multiplier × (1 + temp_adjustment + token_adjustment)

Example:
- Medium pack: 50 credits
- GPT-4 model: 50 × 2 = 100 credits
- Higher temperature: 100 × 1.1 = 110 credits
- Higher tokens: 110 × 1.05 = 115.5 credits (rounded to 116)
```

#### Credit Limits
```
Free Tier:
- Monthly credits: 100
- Daily limit: 20 credits
- Hourly limit: 5 credits
- Concurrent executions: 1

Pro Tier:
- Monthly credits: 5,000
- Daily limit: 500 credits
- Hourly limit: 100 credits
- Concurrent executions: 5

Enterprise:
- Monthly credits: Custom
- Daily limit: Custom
- Hourly limit: Custom
- Concurrent executions: 20
```

---

### 3.3 Visualisation Module Credit Cost Model

#### Visualization Costs
```
Basic Visualization: 25 credits
- Simple chart/diagram
- Standard layout
- Default styling

Advanced Visualization: 50 credits
- Complex visualization
- Custom layout
- Advanced styling

Custom Visualization: 75 credits
- Highly customized
- Multiple elements
- Premium styling
- Custom branding

Bulk Visualization: Discounted
- 10+ visualizations: 10% discount
- 50+ visualizations: 20% discount
- 100+ visualizations: 30% discount
```

---

### 3.4 Failed Payment Handling

#### Dunning Sequence
```
Payment Failure:
1. Webhook: invoice.payment_failed
2. Retry attempt scheduled (3 days later)
3. Email sent: "Payment failed - please update payment method"

Day 3 - Retry Attempt:
- Automatic retry
- If successful: Webhook: invoice.payment_succeeded
- If failed: Continue to Day 7

Day 7 - Second Retry:
- Email: "Your subscription will be canceled in 3 days"
- Manual retry option provided
- Offer: Update payment method

Day 10 - Cancellation:
- Subscription canceled
- Email: "Your subscription has been canceled"
- Offer: Reactivate subscription
- Pro features disabled
- Free tier restored

Reactivation:
- User can reactivate within 30 days
- Same subscription terms
- No data loss
- Immediate Pro restoration
```

---

### 3.5 Upgrade/Downgrade Logic

#### Upgrade (Free → Pro)
```
Process:
1. User clicks "Upgrade to Pro"
2. Redirected to Stripe checkout
3. User completes payment
4. Webhook: customer.subscription.created
5. Subscription record created
6. Proration calculation:
   - Days remaining in current month: X
   - Pro monthly cost: $99
   - Prorated cost: $99 × (X / 30)
   - Charged immediately

Example:
- Upgrade on day 15 of month
- Days remaining: 16
- Prorated cost: $99 × (16 / 30) = $52.80
- Charged immediately
- Next billing: 30 days from upgrade date

Features Enabled:
- 5,000 monthly credits
- Unlimited visualizations
- API access
- Priority support
```

#### Downgrade (Pro → Free)
```
Process:
1. User clicks "Downgrade to Free"
2. Confirmation dialog shown
3. Confirm downgrade
4. Subscription canceled (at period end)
5. Email: "Your subscription will end on [date]"

On Period End:
- Webhook: customer.subscription.deleted
- Subscription status: canceled
- Pro features disabled
- Credits reset to 100 (Free tier)
- Unused credits lost
- API keys revoked
- Email: "Your Pro subscription has ended"

Reactivation:
- User can reactivate Pro anytime
- Same terms as original
- No data loss
```

#### Upgrade (Pro → Enterprise)
```
Process:
1. User contacts sales
2. Sales team creates custom quote
3. Quote sent to user
4. User approves
5. Stripe subscription created (custom price)
6. SSO setup initiated
7. Dedicated support assigned

Proration:
- Credit for unused Pro time
- Applied to Enterprise subscription
- First invoice reduced by credit amount

Example:
- Pro subscription ends: 2024-02-15
- Enterprise starts: 2024-02-01
- Pro credit: $99 × (14 / 30) = $46.20
- Enterprise monthly: $5,000
- First invoice: $5,000 - $46.20 = $4,953.80
```

---

## SECTION 4: MARKETING INFRASTRUCTURE

### 4.1 Landing Page Architecture

#### Landing Page Structure
```
Homepage (/):
- Hero section: Value proposition
- Feature highlights: 6-8 key features
- Pricing section: 3 tiers
- Social proof: Testimonials, logos
- CTA: "Get Started Free"
- FAQ section
- Footer: Links, legal

Pricing Page (/pricing):
- Plan comparison table
- Feature matrix
- CTA per plan
- FAQ for pricing
- Contact sales button

About Page (/about):
- Company story
- Team bios
- Mission/vision
- Press mentions
- Contact info

Blog (/blog):
- Latest articles
- Category filtering
- Search
- Related articles
- Author info

Documentation (/docs):
- Getting started guide
- API documentation
- Pack guides
- Tutorials
- Support links
```

#### SEO Structure
```
Technical SEO:
- Sitemap: /sitemap.xml
- Robots.txt: /robots.txt
- Meta tags: Title, description, keywords
- Open Graph: Social sharing
- Structured data: Schema.org markup
- Mobile optimization: Responsive design
- Page speed: < 2 second load time

Content SEO:
- Keyword research: 50+ target keywords
- Content strategy: Blog, guides, tutorials
- Internal linking: Cross-linking strategy
- External links: Backlink building
- Content calendar: 2 posts/week

Technical Optimizations:
- CDN: CloudFront for static assets
- Image optimization: WebP, lazy loading
- Code splitting: Lazy load JavaScript
- Caching: Browser cache, service worker
- Compression: Gzip compression
```

---

### 4.2 Email Automation Flows

#### Onboarding Email Sequence (7 days)
```
Day 0 - Welcome Email
- Subject: "Welcome to PromptForge!"
- Content: Platform overview, getting started guide
- CTA: "Start with your first pack"
- Personalization: User's first name

Day 1 - First Pack Guide
- Subject: "Your first pack awaits"
- Content: Step-by-step pack execution guide
- CTA: "Execute your first pack"
- Personalization: Recommended pack based on interests

Day 2 - Features Overview
- Subject: "Discover PromptForge features"
- Content: Packs, visualizations, history, sharing
- CTA: "Explore all features"
- Personalization: Feature recommendations

Day 3 - Monetisation Packs
- Subject: "Make money with PromptForge"
- Content: Monetisation pack overview, use cases
- CTA: "Explore monetisation packs"
- Personalization: Relevant niches

Day 4 - Automation Packs
- Subject: "Automate your workflow"
- Content: Automation pack overview, benefits
- CTA: "Explore automation packs"
- Personalization: Relevant automation types

Day 5 - Growth Packs
- Subject: "Scale your business"
- Content: Growth pack overview, strategies
- CTA: "Explore growth packs"
- Personalization: Relevant growth channels

Day 6 - Pro Features
- Subject: "Unlock Pro features"
- Content: Pro tier benefits, pricing, testimonials
- CTA: "Upgrade to Pro (20% off for 3 months)"
- Personalization: Usage-based recommendations
```

#### Upgrade Nurture Sequence (14 days)
```
Day 0 - Upgrade Offer
- Subject: "Special offer: 20% off Pro"
- Content: Pro benefits, pricing, testimonials
- CTA: "Upgrade now"
- Personalization: Based on usage

Day 3 - Feature Highlight
- Subject: "See what you're missing"
- Content: Specific Pro feature benefits
- CTA: "Upgrade to Pro"
- Personalization: Based on usage patterns

Day 7 - Success Stories
- Subject: "How others use PromptForge Pro"
- Content: Case studies, testimonials, results
- CTA: "Join Pro users"
- Personalization: Relevant use cases

Day 10 - Limited Time Offer
- Subject: "Offer expires in 3 days"
- Content: Urgency messaging, benefits recap
- CTA: "Upgrade now (20% off)"
- Personalization: Countdown timer

Day 14 - Final Offer
- Subject: "Last chance: 20% off Pro"
- Content: Final benefits recap, testimonials
- CTA: "Upgrade now"
- Personalization: Expiration messaging
```

#### Retention Email Sequence (Monthly)
```
Day 1 - Monthly Summary
- Subject: "Your PromptForge summary for [month]"
- Content: Usage stats, credits used, top packs
- CTA: "View detailed analytics"
- Personalization: User's data

Day 7 - Feature Tip
- Subject: "Pro tip: [feature name]"
- Content: Feature explanation, use case, tutorial
- CTA: "Learn more"
- Personalization: Based on usage

Day 14 - New Pack Announcement
- Subject: "New pack: [pack name]"
- Content: Pack description, use case, benefits
- CTA: "Try new pack"
- Personalization: Relevant to user

Day 21 - Community Highlight
- Subject: "See what the community created"
- Content: Featured executions, user stories
- CTA: "View community"
- Personalization: Relevant categories

Day 28 - Renewal Reminder
- Subject: "Your subscription renews in 2 days"
- Content: Renewal details, next billing date
- CTA: "Manage subscription"
- Personalization: Renewal date
```

---

### 4.3 Affiliate System Architecture

#### Affiliate Program
```
Program Structure:
- Commission: 30% recurring
- Cookie duration: 30 days
- Payout: Monthly
- Minimum payout: $50

Affiliate Tiers:
- Bronze: 0-10 referrals → 30% commission
- Silver: 11-50 referrals → 35% commission
- Gold: 51-100 referrals → 40% commission
- Platinum: 100+ referrals → 45% commission

Affiliate Dashboard:
- Referral link generation
- Click tracking
- Conversion tracking
- Commission tracking
- Payout history
- Marketing materials

Marketing Materials:
- Email templates
- Social media posts
- Blog post templates
- Landing page copy
- Banner ads
- Video scripts
```

#### Affiliate Tracking
```
Tracking System:
1. Affiliate generates unique link
2. User clicks link
3. Cookie set: affiliate_id=xyz, expires 30 days
4. User signs up
5. Conversion recorded
6. Commission calculated
7. Monthly payout processed

Fraud Prevention:
- IP address validation
- Device fingerprinting
- Referral source verification
- Unusual pattern detection
- Manual review for high-value referrals
```

---

### 4.4 Referral/Viral Loop Integration

#### Referral Program
```
Program Structure:
- Referrer reward: 100 credits
- Referee reward: 50 credits (on first purchase)
- Unlimited referrals
- Referral link: /ref/{code}

Referral Flow:
1. User generates referral link
2. Shares link with friend
3. Friend clicks link
4. Cookie set: referrer_id=xyz
5. Friend signs up
6. Friend makes first purchase
7. Both receive rewards
8. Rewards credited immediately

Viral Mechanics:
- Share button on dashboard
- Email referral template
- Social media sharing
- Referral leaderboard
- Monthly referral contests
- Bonus rewards for top referrers
```

---

### 4.5 Analytics & Attribution

#### Analytics Setup
```
GA4 Integration:
- Tracking ID: G-XXXXXXXXXX
- Events tracked:
  - page_view
  - user_signup
  - pack_executed
  - subscription_upgrade
  - feature_used
  - error_occurred

PostHog Integration:
- Session recording
- Feature flags
- A/B testing
- Funnel analysis
- Cohort analysis
- User segmentation

Segment Integration:
- Centralized event tracking
- Multi-destination routing
- Data warehouse integration
- Real-time dashboards
```

#### Attribution Model
```
Attribution Windows:
- First-click: Credit first touchpoint
- Last-click: Credit last touchpoint
- Linear: Equal credit to all touchpoints
- Time decay: More credit to recent touchpoints

Channels Tracked:
- Organic search
- Paid search
- Paid social
- Email
- Referral
- Direct
- Affiliate
- Social media

Conversion Funnel:
1. Landing page view
2. Signup
3. First pack execution
4. Subscription upgrade
5. Sustained usage

Attribution Dashboard:
- Channel performance
- Conversion rates
- CAC by channel
- LTV by channel
- ROI by channel
```

---

## SECTION 5: BUILD & DEPLOYMENT PIPELINE

### 5.1 CI/CD Pipeline

#### GitHub Actions Workflow
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run lint
      - run: npm run test
      - run: npm run test:integration
      - run: npm run test:e2e

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build
      - run: npm run build:docker
      - uses: docker/login-action@v2
        with:
          registry: ecr
          username: ${{ secrets.AWS_ACCESS_KEY_ID }}
          password: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
      - uses: docker/build-push-action@v4
        with:
          push: true
          tags: ${{ env.ECR_REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }}

  deploy-staging:
    needs: build
    if: github.ref == 'refs/heads/develop'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: aws ecs update-service --cluster staging --service promptforge-api --force-new-deployment
      - run: aws ecs update-service --cluster staging --service promptforge-worker --force-new-deployment

  deploy-production:
    needs: build
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: aws ecs update-service --cluster production --service promptforge-api --force-new-deployment
      - run: aws ecs update-service --cluster production --service promptforge-worker --force-new-deployment
      - run: npm run smoke-test
```

---

### 5.2 Testing Strategy

#### Unit Tests
```
Coverage Target: 80%+

Test Areas:
- Authentication logic
- Authorization logic
- Credit calculation
- Pack execution
- Error handling
- Utility functions

Tools:
- Jest: Test framework
- Supertest: HTTP testing
- Mock: Mocking library

Example:
describe('Credit Calculation', () => {
  test('calculates credits correctly', () => {
    const cost = calculateCredits({
      packSize: 'medium',
      model: 'gpt-4',
      temperature: 0.7
    });
    expect(cost).toBe(116);
  });
});
```

#### Integration Tests
```
Coverage Target: 60%+

Test Areas:
- API endpoints
- Database operations
- Stripe integration
- Email sending
- Cache operations

Tools:
- Jest: Test framework
- Testcontainers: Docker containers for services
- PostgreSQL: Test database

Example:
describe('Pack Execution API', () => {
  test('executes pack and deducts credits', async () => {
    const response = await request(app)
      .post('/packs/pack_123/execute')
      .set('Authorization', `Bearer ${token}`)
      .send({ promptId: 'prompt_456', inputVariables: {} });
    
    expect(response.status).toBe(200);
    expect(response.body.creditsUsed).toBe(50);
  });
});
```

#### Load Tests
```
Load Testing Tool: Apache JMeter / k6

Scenarios:
- Normal load: 100 concurrent users
- Peak load: 1,000 concurrent users
- Stress test: 10,000 concurrent users

Metrics:
- Response time: < 200ms (p95)
- Error rate: < 0.1%
- Throughput: > 1,000 req/sec

Example:
import http from 'k6/http';
import { check } from 'k6';

export let options = {
  stages: [
    { duration: '2m', target: 100 },
    { duration: '5m', target: 100 },
    { duration: '2m', target: 200 },
    { duration: '5m', target: 200 },
    { duration: '2m', target: 0 },
  ],
};

export default function() {
  let response = http.post('https://api.promptforge.com/packs/pack_123/execute', {
    promptId: 'prompt_456',
    inputVariables: {}
  });
  check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 200ms': (r) => r.timings.duration < 200,
  });
}
```

---

### 5.3 Versioning & Release Management

#### Semantic Versioning
```
Version Format: MAJOR.MINOR.PATCH

MAJOR: Breaking changes
MINOR: New features (backward compatible)
PATCH: Bug fixes

Example: 1.2.3
- 1: Major version (breaking changes)
- 2: Minor version (new features)
- 3: Patch version (bug fixes)

Release Cadence:
- Patch releases: Weekly (as needed)
- Minor releases: Bi-weekly
- Major releases: Quarterly
```

#### Release Process
```
1. Feature Development
   - Create feature branch
   - Develop and test
   - Create pull request
   - Code review
   - Merge to develop

2. Release Preparation
   - Create release branch
   - Update version number
   - Update changelog
   - Create release notes
   - Tag release

3. Staging Deployment
   - Deploy to staging
   - Run smoke tests
   - QA testing
   - Performance testing

4. Production Deployment
   - Deploy to production (blue-green)
   - Monitor metrics
   - Run smoke tests
   - Gradual rollout (10% → 50% → 100%)

5. Post-Release
   - Monitor error rates
   - Monitor performance
   - Gather feedback
   - Document issues
```

---

### 5.4 Rollback Strategy

#### Automatic Rollback
```
Triggers:
- Error rate > 5%
- Response time > 1 second (p95)
- CPU usage > 90%
- Memory usage > 90%
- Database connection errors > 10%

Rollback Process:
1. Detect anomaly
2. Alert team
3. Automatic rollback to previous version
4. Notify team
5. Investigate root cause
6. Fix and redeploy

Rollback Time: < 5 minutes
```

#### Manual Rollback
```
Process:
1. Team identifies issue
2. Initiates rollback
3. Previous version deployed
4. Verify rollback successful
5. Investigate root cause
6. Fix and redeploy

Rollback Time: < 10 minutes
```

---

### 5.5 Environment Separation

#### Development Environment
```
Purpose: Feature development and testing
Database: PostgreSQL (dev instance)
Cache: Redis (dev instance)
Secrets: Dev API keys
Monitoring: Limited
Logging: Verbose
Retention: 7 days
```

#### Staging Environment
```
Purpose: Pre-production testing
Database: PostgreSQL (staging instance, anonymized data)
Cache: Redis (staging instance)
Secrets: Staging API keys
Monitoring: Full
Logging: Standard
Retention: 30 days
```

#### Production Environment
```
Purpose: Live user environment
Database: PostgreSQL (production, replicated)
Cache: Redis (production, clustered)
Secrets: Production API keys (KMS encrypted)
Monitoring: Full with alerting
Logging: Standard with archival
Retention: 90 days
```

---

## SECTION 6: DELIVERY INFRASTRUCTURE

### 6.1 Delivery to Chrome Extension

#### Extension Distribution
```
Chrome Web Store:
- Listing: https://chrome.google.com/webstore/detail/promptforge
- Updates: Automatic (within 24 hours)
- Permissions: Minimal (content script, storage)
- Privacy: No data collection

Installation:
1. User visits Chrome Web Store
2. Clicks "Add to Chrome"
3. Permissions dialog shown
4. Extension installed
5. First-run onboarding shown
```

#### Sync Logic
```
Local Storage:
- User preferences
- Execution history (last 100)
- Cached packs
- API keys (encrypted)

Cloud Sync:
- User authentication
- Subscription status
- Credits balance
- Execution history (all)

Sync Triggers:
- On extension load
- Every 5 minutes
- On user action
- On focus return

Conflict Resolution:
- Cloud data takes precedence
- Local data used if offline
- Merge on reconnection
```

#### Offline-First Behavior
```
Offline Capabilities:
- View cached packs
- View execution history
- View preferences
- View credits (cached)

Offline Limitations:
- Cannot execute packs (requires API)
- Cannot sync data
- Cannot update subscription

Reconnection:
- Automatic sync on reconnection
- Conflict resolution
- User notification
- Retry failed operations
```

---

### 6.2 Delivery to Mobile App

#### App Distribution
```
iOS:
- App Store: https://apps.apple.com/app/promptforge
- Updates: Automatic (with user approval)
- Permissions: Camera, photos, notifications

Android:
- Google Play: https://play.google.com/store/apps/details?id=com.promptforge
- Updates: Automatic
- Permissions: Camera, photos, notifications

Installation:
1. User searches for PromptForge
2. Clicks "Install"
3. Permissions dialog shown
4. App installed
5. First-run onboarding shown
```

#### Sync Logic
```
Local Storage:
- User preferences
- Execution history (last 50)
- Cached packs
- API keys (encrypted in keychain)

Cloud Sync:
- User authentication
- Subscription status
- Credits balance
- Execution history (all)
- Saved visualizations

Sync Triggers:
- On app launch
- Every 10 minutes
- On user action
- On network reconnection

Conflict Resolution:
- Cloud data takes precedence
- Local data used if offline
- Merge on reconnection
```

#### Offline-First Behavior
```
Offline Capabilities:
- View cached packs
- View execution history
- View preferences
- View credits (cached)
- Voice-to-text (local processing)

Offline Limitations:
- Cannot execute packs (requires API)
- Cannot sync data
- Cannot update subscription
- Cannot generate visualizations

Reconnection:
- Automatic sync on reconnection
- Conflict resolution
- User notification
- Retry failed operations
```

---

### 6.3 Delivery to Web App

#### Web App Distribution
```
Hosting:
- CDN: CloudFront
- Origin: S3 bucket
- HTTPS: TLS 1.3
- Domain: app.promptforge.com

Deployment:
1. Build React app
2. Optimize assets
3. Upload to S3
4. Invalidate CloudFront cache
5. Verify deployment

Performance:
- Load time: < 2 seconds
- Lighthouse score: 90+
- Core Web Vitals: All green
```

#### Sync Logic
```
Local Storage:
- User preferences
- Execution history (last 100)
- Cached packs
- API keys (encrypted)
- Session data

Cloud Sync:
- User authentication
- Subscription status
- Credits balance
- Execution history (all)
- Saved visualizations

Sync Triggers:
- On app load
- Every 5 minutes
- On user action
- On focus return

Conflict Resolution:
- Cloud data takes precedence
- Local data used if offline
- Merge on reconnection
```

---

### 6.4 Caching Strategy

#### Browser Caching
```
Static Assets:
- Cache-Control: public, max-age=31536000
- Content-Hash: Included in filename
- Invalidation: On deployment

Dynamic Content:
- Cache-Control: public, max-age=300
- Revalidation: After 5 minutes
- Invalidation: On content change

API Responses:
- Cache-Control: private, max-age=60
- Revalidation: After 1 minute
- Invalidation: On data change
```

#### Server-Side Caching
```
Redis Cache Layers:

Layer 1: Session Cache
- Key: session:{sessionId}
- TTL: 24 hours
- Size: ~1KB per session

Layer 2: User Cache
- Key: user:{userId}
- TTL: 1 hour
- Size: ~500 bytes per user
- Invalidation: On user update

Layer 3: Subscription Cache
- Key: subscription:{userId}
- TTL: 1 hour
- Size: ~500 bytes per subscription
- Invalidation: On subscription change

Layer 4: Pack Cache
- Key: pack:{packId}
- TTL: 7 days
- Size: ~10KB per pack
- Invalidation: On pack update

Layer 5: Credits Cache
- Key: credits:{userId}
- TTL: 1 hour
- Size: ~100 bytes per user
- Invalidation: On credit transaction
```

---

This completes the Transaction Flow, Marketing Infrastructure, Build/Deployment, and Delivery Infrastructure specifications. The final section will cover Operational Playbooks.

