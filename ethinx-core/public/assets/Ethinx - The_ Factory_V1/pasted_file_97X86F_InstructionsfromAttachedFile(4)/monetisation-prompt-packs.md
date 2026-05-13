# Monetisation Prompt Pack System
## Complete Guide to 8 Revenue Model Frameworks

---

## OVERVIEW

The Monetisation Prompt Pack System provides 8 specialized packs designed to help you implement different revenue models for your digital assets. Each pack includes complete prompts, automation strategies, scaling guidelines, and integrated visualisation hooks.

**System Features:**
- **8 Specialized Monetisation Packs** covering different revenue models
- **37 Detailed Prompts** with context variables and implementation guides
- **Integrated Visualisation Hooks** for pricing pages, funnels, and dashboards
- **Automation Strategies** for each revenue model
- **Scaling Roadmaps** from launch to $10K+ MRR
- **Quality Assurance Framework** with mandatory checks

---

## PACK CATEGORY 2: MONETISATION PACKS (8 PACKS)

### PACK 1: SUBSCRIPTION MONETISATION PACK
**Purpose:** Build recurring revenue through subscriptions  
**Pack Size:** 5 prompts  
**Ideal For:** SaaS, tools, apps, memberships  
**Revenue Model:** Monthly/annual recurring revenue (MRR/ARR)  
**Target Outcome:** Subscription system with tiered pricing and retention strategies

#### Prompt 1 — Subscription Model Design
**Context Variables:**
- `[ASSET_NAME]` — Name of the product/asset
- `[TARGET_USERS]` — Primary user segment
- `[PRICING_TIERS]` — Number of tiers (typically 2-4)
- `[MONTHLY_PRICE_RANGE]` — Price range for lowest tier

**Prompt Template:**
```
Design a comprehensive subscription model for [ASSET_NAME].

Include detailed specifications for:

1. PRICING TIER STRUCTURE
   - Tier 1: [Name, price, features, target user]
   - Tier 2: [Name, price, features, target user]
   - Tier 3: [Name, price, features, target user] (if applicable)
   - Annual discount strategy (typically 15-20%)

2. VALUE LADDER
   - Feature progression across tiers
   - Clear upgrade path
   - Feature differentiation (not just quantity)
   - Perceived value justification

3. FEATURE GATING
   - Which features are in each tier
   - Usage limits (API calls, storage, users, etc.)
   - Premium features that drive upgrades
   - Feature unlock strategy

4. CHURN REDUCTION STRATEGIES
   - Onboarding flow to reduce early churn
   - In-app engagement tactics
   - Win-back campaigns for churned users
   - Price sensitivity analysis

5. COMPETITIVE POSITIONING
   - Competitor pricing analysis
   - Your pricing justification
   - Unique value propositions
   - Market positioning statement

6. FINANCIAL PROJECTIONS
   - Expected conversion rate (% of free to paid)
   - Expected churn rate
   - Projected MRR at 100, 500, 1000 users
   - Break-even analysis

Output format:
- Pricing tier specification document
- Feature matrix (tier vs features)
- Value ladder diagram
- Churn reduction strategies
- Financial projections

Run debug + security checks before output.
```

**Quality Assurance Checks:**
- ✓ Debug Check: Verify pricing tiers are clearly differentiated
- ✓ Security Check: Ensure pricing is compliant with regulations
- ✓ Hallucination Check: Verify pricing is competitive and justified
- ✓ Consistency Check: Ensure features align with pricing

**Expected Output:**
- Pricing tier specification
- Feature matrix
- Value ladder diagram
- Churn reduction strategies
- Financial projections

---

#### Prompt 2 — Billing Integration
**Context Variables:**
- `[PAYMENT_PROCESSOR]` — Stripe or Paddle
- `[BILLING_FREQUENCY]` — Monthly, annual, or both
- `[CURRENCY]` — Primary currency

**Prompt Template:**
```
Provide comprehensive step-by-step instructions for implementing [PAYMENT_PROCESSOR] subscription billing.

Include detailed specifications for:

1. ACCOUNT SETUP
   - Create [PAYMENT_PROCESSOR] account
   - Configure company information
   - Set up payment methods
   - Configure tax settings

2. PRODUCT CONFIGURATION
   - Create products for each tier
   - Configure pricing (monthly, annual)
   - Set up billing cycles
   - Configure trial periods (if applicable)

3. WEBHOOK SETUP
   - Configure webhooks for payment events
   - Handle subscription created events
   - Handle subscription updated events
   - Handle subscription cancelled events
   - Handle payment failed events

4. FRONTEND IMPLEMENTATION
   - Pricing page implementation
   - Payment form integration
   - Subscription management interface
   - Billing portal setup

5. BACKEND IMPLEMENTATION
   - User subscription tracking
   - Feature access control based on tier
   - Billing history retrieval
   - Invoice generation

6. TESTING STRATEGY
   - Test successful subscription
   - Test failed payment
   - Test subscription upgrade/downgrade
   - Test cancellation
   - Test webhook handling

7. DEPLOYMENT
   - Staging environment testing
   - Production deployment
   - Monitoring setup
   - Error handling

Output format:
- Step-by-step setup guide
- Code examples (frontend and backend)
- Webhook handler code
- Testing checklist
- Deployment guide

Run debug + security checks before output.
```

**Expected Output:**
- Setup guide
- Code examples
- Webhook handler code
- Testing checklist
- Deployment guide

---

#### Prompt 3 — Onboarding + Retention Flow
**Context Variables:**
- `[PRODUCT_TYPE]` — Type of product (SaaS, app, membership, etc.)
- `[KEY_METRIC]` — Primary success metric for users

**Prompt Template:**
```
Create a comprehensive onboarding + retention flow for [PRODUCT_TYPE].

Include detailed specifications for:

1. ONBOARDING EMAIL SEQUENCE
   - Email 1: Welcome + setup instructions (sent immediately)
   - Email 2: First steps guide (24 hours after signup)
   - Email 3: Feature showcase (3 days after signup)
   - Email 4: Success stories/social proof (7 days after signup)
   - Email 5: Upgrade incentive (14 days after signup)

2. IN-APP ONBOARDING
   - Welcome modal/tour
   - Feature highlights
   - First action nudge
   - Progress tracking
   - Celebration of milestones

3. HABIT LOOP CREATION
   - Identify the core habit
   - Design trigger (notification, email, in-app)
   - Create reward (progress, achievement, unlock)
   - Encourage repetition

4. ENGAGEMENT TACTICS
   - Weekly digest/summary
   - Achievement badges/gamification
   - Social sharing features
   - Community features (if applicable)
   - Leaderboards/comparisons (if applicable)

5. RE-ENGAGEMENT CAMPAIGNS
   - Identify at-risk users (no activity for X days)
   - Re-engagement email sequence
   - Special offers/incentives
   - Feedback collection
   - Win-back campaigns

6. CHURN PREVENTION
   - Exit surveys (why are they leaving?)
   - Last-minute offers
   - Pause subscription option
   - Downgrade option (instead of cancellation)
   - Follow-up after cancellation

Output format:
- Email sequence templates
- In-app onboarding flow diagram
- Engagement tactics checklist
- Re-engagement campaign strategy
- Churn prevention playbook

Run debug + security checks before output.
```

**Expected Output:**
- Email sequence templates
- Onboarding flow diagram
- Engagement tactics
- Re-engagement strategy
- Churn prevention playbook

---

#### Prompt 4 — Upsell Triggers
**Context Variables:**
- `[USAGE_METRIC]` — Primary usage metric (API calls, storage, users, etc.)
- `[UPSELL_TRIGGER_THRESHOLD]` — When to show upsell (e.g., 80% quota used)

**Prompt Template:**
```
Define comprehensive upsell triggers based on usage, milestones, or feature unlocks.

Include detailed specifications for:

1. USAGE-BASED TRIGGERS
   - Trigger 1: [Usage metric] reaches [threshold]
   - Trigger 2: [Usage metric] reaches [threshold]
   - Trigger 3: [Usage metric] reaches [threshold]
   - Messaging for each trigger
   - Timing of upsell prompt

2. MILESTONE-BASED TRIGGERS
   - Milestone 1: [Achievement] (e.g., 100 API calls)
   - Milestone 2: [Achievement] (e.g., 10 projects created)
   - Milestone 3: [Achievement] (e.g., 50 team members)
   - Messaging for each milestone
   - Upgrade incentive

3. TIME-BASED TRIGGERS
   - Trigger 1: Day 7 of subscription
   - Trigger 2: Day 30 of subscription
   - Trigger 3: Day 90 of subscription
   - Messaging for each trigger
   - Offer/discount strategy

4. FEATURE-UNLOCK TRIGGERS
   - Feature 1: [Feature name] available in tier [X]
   - Feature 2: [Feature name] available in tier [X]
   - Feature 3: [Feature name] available in tier [X]
   - Messaging emphasizing feature value
   - Upgrade path

5. UPSELL MESSAGING
   - Headline for each trigger
   - Body copy emphasizing benefits
   - CTA button text
   - Discount/incentive (if applicable)
   - Social proof (if applicable)

6. IMPLEMENTATION
   - Where to show upsell (in-app modal, email, banner)
   - Frequency cap (how often to show)
   - A/B testing strategy
   - Tracking and measurement

Output format:
- Trigger definition document
- Upsell messaging templates
- Implementation guide
- A/B testing strategy

Run debug + security checks before output.
```

**Expected Output:**
- Trigger definitions
- Messaging templates
- Implementation guide
- A/B testing strategy

---

#### Prompt 5 — Visualisation Trigger
```
[VISUALISATION PROMPT]
Generate a UI mockup prompt for the pricing page.

Description:
- Product: [ASSET_NAME]
- Purpose: Convert free users to paid subscriptions
- Color palette: [BRAND_COLORS]
- Style: Professional, conversion-focused, trust-building

Create a detailed pricing page mockup showing:
- Hero section with value proposition
- Pricing tier cards (3-4 tiers)
- Feature comparison table
- CTA buttons for each tier
- FAQ section
- Social proof/testimonials
- Money-back guarantee or trust badges

Include annotations showing:
- Tier names and prices
- Feature lists
- CTA button text
- Recommended tier (highlighted)
- Special offers or discounts
```

**Expected Output:**
- Pricing page UI mockup image
- Conversion-optimized layout
- Feature comparison visualization

---

### PACK 2: PASSIVE INCOME PACK
**Purpose:** Maximise automation and recurring revenue  
**Pack Size:** 6 prompts  
**Ideal For:** Content creators, course creators, template creators  
**Revenue Model:** Passive income through automation and evergreen content  
**Target Outcome:** Fully automated revenue system with minimal ongoing effort

#### Prompt 1 — Passive Income Model
**Context Variables:**
- `[ASSET_NAME]` — Name of the asset
- `[ASSET_TYPE]` — Type (course, template, tool, content, etc.)
- `[PASSIVE_SCORE_TARGET]` — Target passive score (1-10)

**Prompt Template:**
```
Design a comprehensive passive income model for [ASSET_NAME].

Include detailed specifications for:

1. AUTOMATION STRATEGY
   - What can be automated (delivery, onboarding, support, etc.)
   - Tools and platforms for automation
   - Setup time vs ongoing effort
   - Maintenance requirements

2. EVERGREEN CONTENT STRATEGY
   - Content that doesn't expire (timeless value)
   - Content refresh cycle (if needed)
   - Seasonal content handling
   - SEO optimization for long-term traffic

3. RECURRING REVENUE STREAMS
   - Primary revenue stream (subscriptions, memberships, etc.)
   - Secondary revenue streams (affiliate, ads, etc.)
   - Tertiary revenue streams (sponsorships, etc.)
   - Revenue mix and diversification

4. PASSIVE SCORE ANALYSIS
   - Effort required (1-10 scale)
   - Automation level (1-10 scale)
   - Scalability (1-10 scale)
   - Overall passive score
   - Strategies to increase passive score

5. FINANCIAL PROJECTIONS
   - Initial setup cost
   - Monthly maintenance cost
   - Expected revenue at launch
   - Expected revenue at 6 months
   - Expected revenue at 12 months
   - Passive income potential ($/month with minimal effort)

6. IMPLEMENTATION ROADMAP
   - Phase 1: Setup (weeks 1-4)
   - Phase 2: Optimization (weeks 5-8)
   - Phase 3: Scaling (weeks 9-12)
   - Phase 4: Maintenance (ongoing)

Output format:
- Passive income model specification
- Automation strategy document
- Evergreen content strategy
- Revenue stream analysis
- Financial projections
- Implementation roadmap

Run debug + security checks before output.
```

**Expected Output:**
- Passive income model specification
- Automation strategy
- Evergreen content strategy
- Revenue analysis
- Financial projections
- Implementation roadmap

---

#### Prompt 2 — Evergreen Funnel
**Context Variables:**
- `[LEAD_MAGNET]` — Lead magnet offer
- `[MAIN_PRODUCT]` — Main product/offer
- `[UPSELL_PRODUCT]` — Upsell offer (if applicable)

**Prompt Template:**
```
Create a comprehensive evergreen funnel including lead magnet → nurture → conversion → upsell.

Include detailed specifications for:

1. LEAD MAGNET
   - Lead magnet offer (what's the free value?)
   - Format (PDF, video, checklist, template, etc.)
   - Delivery method (email, download, etc.)
   - Expected conversion rate (% of visitors to leads)

2. NURTURE SEQUENCE
   - Email 1: Welcome + lead magnet delivery (immediate)
   - Email 2: Value-add content (day 1)
   - Email 3: Story/social proof (day 3)
   - Email 4: Problem/solution (day 5)
   - Email 5: Product introduction (day 7)
   - Email 6: Objection handling (day 9)
   - Email 7: Urgency/scarcity (day 11)
   - Email 8: Final call-to-action (day 14)

3. CONVERSION MECHANISM
   - Sales page copy
   - Pricing strategy
   - Payment processor
   - Checkout flow
   - Expected conversion rate (% of leads to customers)

4. UPSELL SEQUENCE
   - Upsell offer (what's the next step?)
   - Timing of upsell (immediately after purchase, 7 days, etc.)
   - Upsell messaging
   - Expected upsell rate

5. AUTOMATION
   - Email automation platform (Mailchimp, ConvertKit, etc.)
   - Triggers and delays
   - Conditional logic (if/then)
   - Integration with payment processor
   - Delivery automation

6. METRICS & OPTIMIZATION
   - Open rate target
   - Click-through rate target
   - Conversion rate target
   - A/B testing strategy
   - Optimization roadmap

Output format:
- Funnel diagram
- Email sequence templates
- Sales page outline
- Automation setup guide
- Metrics and KPIs

Run debug + security checks before output.
```

**Expected Output:**
- Funnel diagram
- Email templates
- Sales page outline
- Automation guide
- KPI targets

---

#### Prompt 3 — Automation Layer
**Context Variables:**
- `[AUTOMATION_PLATFORM]` — Zapier, Make.com, etc.
- `[PROCESSES_TO_AUTOMATE]` — Delivery, onboarding, support, etc.

**Prompt Template:**
```
Define comprehensive automation for delivery, onboarding, content refresh, and reporting.

Include detailed specifications for:

1. DELIVERY AUTOMATION
   - Trigger: Customer purchases product
   - Actions: Send product files, send welcome email, add to customer list
   - Timing: Immediate delivery
   - Error handling: What if delivery fails?

2. ONBOARDING AUTOMATION
   - Trigger: Customer receives product
   - Actions: Send onboarding email, send tutorial, send support info
   - Timing: Staggered (day 1, day 3, day 7)
   - Conditional logic: Different onboarding based on product tier

3. CONTENT REFRESH AUTOMATION
   - Identify content requiring refresh
   - Trigger: Scheduled (e.g., monthly)
   - Actions: Update content, republish, notify subscribers
   - Timing: Off-peak hours
   - Monitoring: Track which content is refreshed

4. REPORTING AUTOMATION
   - Trigger: Scheduled (e.g., daily, weekly, monthly)
   - Actions: Collect data, generate report, send to email
   - Metrics: Revenue, customers, traffic, engagement, etc.
   - Format: Email report, dashboard, spreadsheet

5. CUSTOMER SUPPORT AUTOMATION
   - Trigger: Customer inquiry received
   - Actions: Send auto-response, categorize, route to support
   - Conditional logic: Different responses based on inquiry type
   - Escalation: When to escalate to human

6. IMPLEMENTATION STEPS
   - Step 1: Set up automation platform
   - Step 2: Connect integrations (payment, email, etc.)
   - Step 3: Create workflows
   - Step 4: Test workflows
   - Step 5: Monitor and optimize

Output format:
- Automation workflow diagrams
- Step-by-step setup guide
- Workflow configurations
- Error handling strategies
- Monitoring and optimization guide

Run debug + security checks before output.
```

**Expected Output:**
- Workflow diagrams
- Setup guide
- Configurations
- Error handling
- Monitoring guide

---

#### Prompt 4 — SEO Engine
**Context Variables:**
- `[CONTENT_TYPE]` — Type of content (blog, video, course, etc.)
- `[TARGET_KEYWORDS]` — Primary keywords to target

**Prompt Template:**
```
Build a comprehensive SEO strategy for long-term passive traffic.

Include detailed specifications for:

1. KEYWORD RESEARCH
   - Target keywords (long-tail, high-intent)
   - Search volume and difficulty analysis
   - Keyword grouping by topic
   - Content gap analysis

2. CONTENT STRATEGY
   - Content pillars (main topics)
   - Content clusters (supporting topics)
   - Content calendar (publishing schedule)
   - Content format (blog, video, podcast, etc.)

3. ON-PAGE SEO
   - Title tag optimization
   - Meta description optimization
   - Header tag structure
   - Internal linking strategy
   - Image optimization

4. TECHNICAL SEO
   - Site speed optimization
   - Mobile responsiveness
   - XML sitemap
   - Robots.txt optimization
   - Structured data/schema markup

5. LINK BUILDING STRATEGY
   - Internal linking
   - External linking opportunities
   - Guest posting strategy
   - Backlink acquisition
   - Authority building

6. TRAFFIC PROJECTIONS
   - Expected traffic at 3 months
   - Expected traffic at 6 months
   - Expected traffic at 12 months
   - Revenue potential from traffic

Output format:
- Keyword research document
- Content strategy and calendar
- SEO checklist
- Technical SEO guide
- Link building strategy
- Traffic projections

Run debug + security checks before output.
```

**Expected Output:**
- Keyword research
- Content strategy
- SEO checklist
- Technical guide
- Link strategy
- Traffic projections

---

#### Prompt 5 — Affiliate Layer
**Context Variables:**
- `[AFFILIATE_PRODUCTS]` — Products to promote as affiliate
- `[AFFILIATE_NETWORKS]` — Networks to join (Amazon Associates, ShareASale, etc.)

**Prompt Template:**
```
Add comprehensive affiliate monetisation to increase passive revenue.

Include detailed specifications for:

1. AFFILIATE STRATEGY
   - Affiliate networks to join
   - Products to promote
   - Commission rates
   - Revenue potential

2. CONTENT INTEGRATION
   - Where to place affiliate links
   - How to naturally integrate affiliate products
   - Disclosure requirements
   - Trust and credibility

3. TRACKING & ANALYTICS
   - Affiliate link tracking
   - Conversion tracking
   - Revenue tracking
   - Performance analysis

4. OPTIMIZATION
   - A/B testing affiliate products
   - Placement optimization
   - Copy optimization
   - Seasonal adjustments

5. COMPLIANCE
   - FTC disclosure requirements
   - Platform-specific rules
   - Tax implications
   - Ethical considerations

Output format:
- Affiliate strategy document
- Content integration guide
- Tracking setup guide
- Optimization strategies
- Compliance checklist

Run debug + security checks before output.
```

**Expected Output:**
- Affiliate strategy
- Integration guide
- Tracking setup
- Optimization strategies
- Compliance checklist

---

#### Prompt 6 — Visualisation Trigger
```
[VISUALISATION PROMPT]
Generate a visual prompt for the funnel layout.

Description:
- Funnel: Lead magnet → Nurture → Conversion → Upsell
- Purpose: Show customer journey and conversion points
- Style: Flowchart/funnel diagram
- Color palette: [BRAND_COLORS]

Create a detailed funnel visualization showing:
- Lead magnet stage (top of funnel)
- Nurture sequence stage
- Conversion stage
- Upsell stage
- Conversion rates at each stage
- Revenue at each stage
- Drop-off points

Include annotations showing:
- Stage names
- Number of people at each stage
- Conversion percentages
- Revenue generated
- Key actions/triggers
```

**Expected Output:**
- Funnel diagram visualization
- Stage-by-stage breakdown
- Conversion metrics

---

### PACK 3: AFFILIATE ENGINE PACK
**Purpose:** Build an affiliate-driven asset  
**Pack Size:** 5 prompts  
**Ideal For:** Content creators, reviewers, comparison sites  
**Revenue Model:** Commission-based affiliate revenue  
**Target Outcome:** High-traffic affiliate site with optimized conversions

#### Prompt 1 — Affiliate Strategy
**Context Variables:**
- `[NICHE]` — Your niche/industry
- `[AFFILIATE_NETWORKS]` — Networks to join (Amazon, ShareASale, CJ, etc.)
- `[TARGET_COMMISSION_RATE]` — Desired commission rate (%)

**Prompt Template:**
```
Define comprehensive affiliate networks, product categories, and commission optimisation.

Include detailed specifications for:

1. AFFILIATE NETWORKS
   - Network 1: [Name, commission rate, products available]
   - Network 2: [Name, commission rate, products available]
   - Network 3: [Name, commission rate, products available]
   - Comparison and selection rationale

2. PRODUCT CATEGORIES
   - Category 1: [Name, products, commission rates]
   - Category 2: [Name, products, commission rates]
   - Category 3: [Name, products, commission rates]
   - Revenue potential per category

3. COMMISSION OPTIMISATION
   - Highest-commission products to prioritize
   - Product mix for revenue optimization
   - Seasonal product adjustments
   - Exclusive affiliate deals

4. PARTNER RELATIONSHIPS
   - Direct partnerships with brands
   - Affiliate manager contacts
   - Negotiation strategy for higher commissions
   - Long-term partnership opportunities

5. REVENUE PROJECTIONS
   - Expected revenue per 1000 visitors
   - Expected revenue per 10000 visitors
   - Expected revenue per 100000 visitors
   - Revenue by product category

Output format:
- Affiliate network analysis
- Product category breakdown
- Commission optimization strategy
- Partner relationship plan
- Revenue projections

Run debug + security checks before output.
```

**Expected Output:**
- Network analysis
- Product categories
- Commission strategy
- Partner plan
- Revenue projections

---

#### Prompt 2 — Content Engine
**Context Variables:**
- `[CONTENT_FORMAT]` — Format (reviews, comparisons, guides, etc.)
- `[PUBLISHING_FREQUENCY]` — How often to publish

**Prompt Template:**
```
Create a comprehensive content system optimised for affiliate conversions.

Include detailed specifications for:

1. CONTENT TYPES
   - Type 1: Product reviews (detailed, pros/cons, affiliate link)
   - Type 2: Comparison articles (multiple products, comparison table)
   - Type 3: Buying guides (how to choose, recommendations)
   - Type 4: Best-of lists (top products, rankings)
   - Type 5: How-to guides (problem-solving, product recommendations)

2. CONTENT STRUCTURE
   - Headline optimization for clicks
   - Introduction (hook + problem)
   - Product/comparison section
   - Pros and cons
   - Affiliate recommendations
   - Call-to-action
   - FAQ section

3. AFFILIATE LINK PLACEMENT
   - Natural integration in content
   - Multiple link placements (beginning, middle, end)
   - Link anchor text optimization
   - Button vs text links
   - Disclosure placement

4. CONVERSION OPTIMIZATION
   - Compelling product descriptions
   - Social proof (reviews, ratings)
   - Urgency/scarcity elements
   - Money-back guarantees
   - Bonus offers

5. CONTENT CALENDAR
   - Publishing schedule
   - Content mix (reviews, comparisons, guides)
   - Seasonal content planning
   - Evergreen content strategy

Output format:
- Content type specifications
- Content structure template
- Affiliate link placement guide
- Conversion optimization checklist
- Content calendar

Run debug + security checks before output.
```

**Expected Output:**
- Content specifications
- Structure template
- Link placement guide
- Optimization checklist
- Content calendar

---

#### Prompt 3 — Tracking + Analytics
**Context Variables:**
- `[ANALYTICS_PLATFORM]` — Google Analytics, Mixpanel, etc.
- `[AFFILIATE_TRACKING_TOOL]` — Affiliate link tracking tool

**Prompt Template:**
```
Set up comprehensive affiliate link tracking, analytics, and reporting.

Include detailed specifications for:

1. AFFILIATE LINK TRACKING
   - Affiliate link management (Bitly, Pretty Links, etc.)
   - UTM parameter setup
   - Link shortening and branding
   - Link performance tracking

2. ANALYTICS SETUP
   - Google Analytics configuration
   - Affiliate network dashboard
   - Custom dashboards for tracking
   - Real-time monitoring

3. KEY METRICS
   - Clicks (traffic to affiliate link)
   - Click-through rate (CTR)
   - Conversions (purchases through link)
   - Conversion rate
   - Revenue
   - Average order value
   - Commission earned

4. REPORTING
   - Daily reporting
   - Weekly reporting
   - Monthly reporting
   - Performance by product
   - Performance by content type
   - Performance by traffic source

5. OPTIMIZATION BASED ON DATA
   - Identify top-performing products
   - Identify underperforming products
   - Optimize content for top performers
   - Remove or replace underperformers
   - A/B testing strategy

Output format:
- Tracking setup guide
- Analytics configuration
- Dashboard setup
- Reporting templates
- Optimization strategy

Run debug + security checks before output.
```

**Expected Output:**
- Tracking setup guide
- Analytics configuration
- Dashboard setup
- Reporting templates
- Optimization strategy

---

#### Prompt 4 — Funnel Design
**Context Variables:**
- `[TRAFFIC_SOURCE]` — Primary traffic source (SEO, social, email, etc.)
- `[TARGET_CONVERSION_RATE]` — Target conversion rate (%)

**Prompt Template:**
```
Design a comprehensive affiliate funnel with CTAs, comparison tables, and trust signals.

Include detailed specifications for:

1. FUNNEL STAGES
   - Stage 1: Awareness (blog post, social media)
   - Stage 2: Consideration (product review, comparison)
   - Stage 3: Decision (buying guide, recommendation)
   - Stage 4: Action (affiliate link click)
   - Stage 5: Conversion (purchase)

2. CALL-TO-ACTION (CTA) STRATEGY
   - CTA placement (top, middle, bottom)
   - CTA copy (action-oriented, benefit-focused)
   - CTA button design (color, size, text)
   - Multiple CTAs for different preferences
   - Urgency/scarcity in CTA

3. COMPARISON TABLES
   - Product comparison matrix
   - Feature-by-feature breakdown
   - Price comparison
   - Pros and cons
   - Recommendation column

4. TRUST SIGNALS
   - Author credentials
   - Social proof (reviews, ratings)
   - Money-back guarantees
   - Expert endorsements
   - Case studies/testimonials
   - Security badges

5. CONVERSION OPTIMIZATION
   - Page speed optimization
   - Mobile optimization
   - Clear navigation
   - Minimal distractions
   - Strong value proposition

Output format:
- Funnel diagram
- CTA strategy document
- Comparison table templates
- Trust signal checklist
- Conversion optimization guide

Run debug + security checks before output.
```

**Expected Output:**
- Funnel diagram
- CTA strategy
- Comparison templates
- Trust signal checklist
- Optimization guide

---

#### Prompt 5 — Visualisation Trigger
```
[VISUALISATION PROMPT]
Generate a UI mockup prompt for an affiliate comparison page.

Description:
- Purpose: Compare products and drive affiliate conversions
- Style: Professional, comparison-focused, trust-building
- Color palette: [BRAND_COLORS]

Create a detailed comparison page mockup showing:
- Product comparison table (3-5 products)
- Feature comparison matrix
- Pricing comparison
- Pros and cons for each product
- Recommendation section
- CTA buttons for each product
- Trust signals/badges
- FAQ section
```

**Expected Output:**
- Comparison page UI mockup
- Product comparison visualization
- CTA placement

---

### PACK 4: FREEMIUM → UPSELL PACK
**Purpose:** Convert free users to paid customers  
**Pack Size:** 5 prompts  
**Ideal For:** Apps, SaaS, tools with free tiers  
**Revenue Model:** Freemium with upsell to premium  
**Target Outcome:** Optimized conversion funnel from free to paid

#### Prompt 1 — Free Tier Design
**Context Variables:**
- `[PRODUCT_NAME]` — Name of the product
- `[CORE_VALUE]` — Core value proposition
- `[CONVERSION_TARGET]` — Target free-to-paid conversion rate (%)

**Prompt Template:**
```
Define the free tier: limits, value, and upgrade incentives.

Include detailed specifications for:

1. FREE TIER VALUE
   - What value does the free tier provide?
   - Core features included
   - Limitations (usage limits, feature limits)
   - Target user: Who is the free tier for?

2. USAGE LIMITS
   - API calls/month (if applicable)
   - Storage (if applicable)
   - Users/team members (if applicable)
   - Projects/workspaces (if applicable)
   - Export limits (if applicable)

3. FEATURE LIMITS
   - Which features are free
   - Which features are premium-only
   - Partial features (limited version in free tier)
   - Feature progression

4. UPGRADE INCENTIVES
   - What problem does premium solve?
   - What value does premium provide?
   - Why would users upgrade?
   - Emotional triggers for upgrade

5. FREEMIUM STRATEGY
   - Aha moment (when does user see value?)
   - Friction point (where do they hit limits?)
   - Upgrade moment (when to suggest upgrade?)
   - Upgrade messaging

Output format:
- Free tier specification
- Feature breakdown (free vs premium)
- Usage limit definition
- Upgrade incentive analysis
- Freemium strategy document

Run debug + security checks before output.
```

**Expected Output:**
- Free tier specification
- Feature breakdown
- Usage limits
- Upgrade incentives
- Freemium strategy

---

#### Prompt 2 — Premium Tier Design
**Context Variables:**
- `[PREMIUM_PRICE]` — Premium tier price
- `[PREMIUM_TARGET_USER]` — Who is premium for?

**Prompt Template:**
```
Define premium features, pricing, and value proposition.

Include detailed specifications for:

1. PREMIUM FEATURES
   - Feature 1: [Name, benefit, why it matters]
   - Feature 2: [Name, benefit, why it matters]
   - Feature 3: [Name, benefit, why it matters]
   - Feature 4: [Name, benefit, why it matters]
   - Feature 5: [Name, benefit, why it matters]

2. PREMIUM VALUE PROPOSITION
   - Primary benefit
   - Secondary benefits
   - Target user (who needs this?)
   - Use case (when would they use this?)
   - ROI (how does premium pay for itself?)

3. PRICING STRATEGY
   - Monthly price
   - Annual price (with discount)
   - Price justification
   - Competitive positioning
   - Psychological pricing tactics

4. PREMIUM POSITIONING
   - Who is premium for?
   - When do they need premium?
   - What problem does premium solve?
   - Why is premium worth the price?

5. UPGRADE PATH
   - How do users upgrade?
   - What's the upgrade experience?
   - Onboarding for premium users
   - Premium-exclusive features showcase

Output format:
- Premium feature specification
- Value proposition statement
- Pricing justification
- Premium positioning document
- Upgrade path guide

Run debug + security checks before output.
```

**Expected Output:**
- Premium features
- Value proposition
- Pricing justification
- Positioning document
- Upgrade path guide

---

#### Prompt 3 — Upgrade Triggers
**Context Variables:**
- `[USAGE_METRIC]` — Primary usage metric
- `[TRIGGER_THRESHOLD]` — When to trigger upgrade

**Prompt Template:**
```
Create comprehensive upgrade triggers based on usage, time, or feature access.

Include detailed specifications for:

1. USAGE-BASED TRIGGERS
   - Trigger 1: [Usage metric] reaches [threshold]
   - Trigger 2: [Usage metric] reaches [threshold]
   - Trigger 3: [Usage metric] reaches [threshold]
   - Messaging for each trigger
   - Timing of trigger

2. TIME-BASED TRIGGERS
   - Trigger 1: Day 7 of free trial
   - Trigger 2: Day 14 of free trial
   - Trigger 3: Day 30 of free trial
   - Messaging for each trigger
   - Offer/incentive

3. FEATURE-ACCESS TRIGGERS
   - Feature 1: [Feature name] available in premium
   - Feature 2: [Feature name] available in premium
   - Feature 3: [Feature name] available in premium
   - Messaging emphasizing feature value
   - Upgrade path

4. ENGAGEMENT-BASED TRIGGERS
   - Trigger 1: User completes onboarding
   - Trigger 2: User creates first project/item
   - Trigger 3: User invites team member
   - Messaging for each trigger
   - Upgrade incentive

5. UPGRADE MESSAGING
   - Headline for each trigger
   - Body copy
   - CTA button text
   - Discount/incentive (if applicable)
   - Social proof

Output format:
- Trigger definition document
- Messaging templates
- Implementation guide
- A/B testing strategy

Run debug + security checks before output.
```

**Expected Output:**
- Trigger definitions
- Messaging templates
- Implementation guide
- A/B testing strategy

---

#### Prompt 4 — Email + In-App Upsell
**Context Variables:**
- `[UPSELL_ANGLE]` — Primary upsell angle (time-saving, ROI, exclusivity, etc.)

**Prompt Template:**
```
Generate comprehensive upsell messaging for email + in-app.

Include detailed specifications for:

1. EMAIL UPSELL SEQUENCE
   - Email 1: Problem awareness (day 3)
   - Email 2: Solution introduction (day 5)
   - Email 3: Social proof (day 7)
   - Email 4: Objection handling (day 9)
   - Email 5: Urgency/scarcity (day 11)
   - Email 6: Final call-to-action (day 14)

2. IN-APP UPSELL MESSAGING
   - In-app modal when limit is reached
   - Messaging emphasizing benefit
   - CTA button text
   - Discount/incentive (if applicable)
   - Close button (don't force)

3. UPSELL COPY FRAMEWORK
   - Headline (benefit-focused)
   - Subheadline (social proof or urgency)
   - Body copy (problem → solution → result)
   - CTA copy (action-oriented)
   - Objection handling

4. PERSONALIZATION
   - Segment 1: [Segment name] - messaging
   - Segment 2: [Segment name] - messaging
   - Segment 3: [Segment name] - messaging
   - Dynamic content based on usage

5. TIMING & FREQUENCY
   - When to send email upsells
   - How often to show in-app upsells
   - Frequency cap (don't overwhelm)
   - Timing optimization

Output format:
- Email sequence templates
- In-app messaging templates
- Copy framework
- Personalization strategy
- Timing guide

Run debug + security checks before output.
```

**Expected Output:**
- Email templates
- In-app messaging
- Copy framework
- Personalization strategy
- Timing guide

---

#### Prompt 5 — Visualisation Trigger
```
[VISUALISATION PROMPT]
Generate a UI mockup prompt for the upgrade modal.

Description:
- Purpose: Convert free users to premium
- Trigger: User hits usage limit or feature access
- Style: Compelling, benefit-focused, urgency-driven
- Color palette: [BRAND_COLORS]

Create a detailed upgrade modal mockup showing:
- Headline emphasizing benefit
- Subheading with social proof or urgency
- Feature list (what they'll get)
- Pricing
- CTA button (prominent, action-oriented)
- Close button (don't force)
- Money-back guarantee or risk-free trial
- FAQ or objection handling
```

**Expected Output:**
- Upgrade modal UI mockup
- Conversion-optimized layout
- CTA prominence

---

### PACK 5: ONE-TIME PRODUCT PACK
**Purpose:** Sell digital products  
**Pack Size:** 4 prompts  
**Ideal For:** Courses, templates, ebooks, tools  
**Revenue Model:** One-time purchase revenue  
**Target Outcome:** Optimized product sales funnel

#### Prompt 1 — Product Definition
**Context Variables:**
- `[PRODUCT_NAME]` — Name of the product
- `[PRODUCT_TYPE]` — Type (course, template, ebook, etc.)
- `[TARGET_AUDIENCE]` — Who is this for?

**Prompt Template:**
```
Define the digital product, deliverables, and value.

Include detailed specifications for:

1. PRODUCT STRUCTURE
   - Product format (PDF, video, code, etc.)
   - Number of components
   - Total scope/size
   - Delivery method

2. DELIVERABLES
   - What's included (list all components)
   - File formats
   - Documentation/instructions
   - Support included

3. VALUE PROPOSITION
   - Problem solved
   - Unique value
   - Target audience
   - Competitive advantages
   - Transformation/result

4. PRODUCT POSITIONING
   - Who is this for?
   - When would they use this?
   - What problem does it solve?
   - Why is it worth the price?

5. QUALITY ASSURANCE
   - Content accuracy
   - Production quality
   - Usability
   - Support quality

Output format:
- Product specification document
- Deliverables checklist
- Value proposition statement
- Positioning document

Run debug + security checks before output.
```

**Expected Output:**
- Product specification
- Deliverables checklist
- Value proposition
- Positioning document

---

#### Prompt 2 — Pricing Strategy
**Context Variables:**
- `[PRODUCT_VALUE]` — Estimated value to customer
- `[COMPETITOR_PRICES]` — Competitor pricing (if known)

**Prompt Template:**
```
Create a comprehensive pricing strategy including bundles, tiers, and launch pricing.

Include detailed specifications for:

1. PRICING STRATEGY
   - Base price (justified by value)
   - Competitive positioning
   - Psychological pricing tactics
   - Price anchoring

2. PRICING TIERS
   - Tier 1: [Name, price, what's included]
   - Tier 2: [Name, price, what's included]
   - Tier 3: [Name, price, what's included] (if applicable)
   - Bundle pricing (if applicable)

3. LAUNCH PRICING
   - Launch price (lower to build momentum)
   - Launch discount (% off regular price)
   - Launch duration (how long)
   - Regular price (after launch)

4. PAYMENT OPTIONS
   - One-time payment
   - Payment plan (if applicable)
   - Installments (if applicable)
   - Currency options

5. FINANCIAL PROJECTIONS
   - Expected sales at launch
   - Expected sales at 3 months
   - Expected sales at 6 months
   - Revenue projections

Output format:
- Pricing strategy document
- Tier breakdown
- Launch pricing plan
- Financial projections

Run debug + security checks before output.
```

**Expected Output:**
- Pricing strategy
- Tier breakdown
- Launch plan
- Financial projections

---

#### Prompt 3 — Launch Funnel
**Context Variables:**
- `[LAUNCH_DATE]` — Target launch date
- `[LAUNCH_AUDIENCE]` — Who to launch to first

**Prompt Template:**
```
Design a comprehensive launch funnel with email sequences and social content.

Include detailed specifications for:

1. PRE-LAUNCH PHASE (Weeks 1-2)
   - Build email list
   - Create landing page
   - Prepare email sequences
   - Plan social content

2. LAUNCH EMAIL SEQUENCE
   - Email 1: Announcement (day 1)
   - Email 2: Value showcase (day 2)
   - Email 3: Social proof (day 3)
   - Email 4: Objection handling (day 4)
   - Email 5: Urgency/scarcity (day 5)
   - Email 6: Final call-to-action (day 6)

3. SOCIAL CONTENT STRATEGY
   - Social post 1: Announcement
   - Social post 2: Benefit highlight
   - Social post 3: Social proof
   - Social post 4: Urgency/scarcity
   - Social post 5: Final call-to-action

4. LANDING PAGE
   - Headline (benefit-focused)
   - Subheading
   - Problem statement
   - Solution explanation
   - Product showcase
   - Pricing
   - CTA button
   - Social proof
   - FAQ

5. POST-LAUNCH PHASE
   - Day 1-7: Monitor sales and feedback
   - Week 2-4: Optimize based on feedback
   - Month 2+: Scaling and optimization

Output format:
- Launch timeline
- Email sequence templates
- Social content templates
- Landing page outline
- Post-launch strategy

Run debug + security checks before output.
```

**Expected Output:**
- Launch timeline
- Email templates
- Social templates
- Landing page outline
- Post-launch strategy

---

#### Prompt 4 — Visualisation Trigger
```
[VISUALISATION PROMPT]
Generate a product cover mockup prompt.

Description:
- Product: [PRODUCT_NAME]
- Type: [PRODUCT_TYPE]
- Purpose: Attract buyers and communicate value
- Color palette: [BRAND_COLORS]
- Style: Professional, eye-catching, marketplace-optimized

Create a detailed product cover mockup showing:
- Product title
- Tagline or key benefit
- Visuals (icons, illustrations, or photos)
- Author/creator name
- Price (optional)
- Badges or ratings (if applicable)
- Value proposition
```

**Expected Output:**
- Product cover UI mockup
- Marketplace-ready design
- Value communication

---

### PACK 6: AD-REVENUE PACK
**Purpose:** Build traffic and monetise with ads  
**Pack Size:** 5 prompts  
**Ideal For:** Blogs, content sites, apps  
**Revenue Model:** Ad-based revenue  
**Target Outcome:** High-traffic site with optimized ad revenue

#### Prompt 1 — Traffic Strategy
**Context Variables:**
- `[CONTENT_NICHE]` — Your niche/industry
- `[TRAFFIC_GOAL]` — Monthly traffic goal (visitors/month)

**Prompt Template:**
```
Define comprehensive SEO + social strategy for high-volume traffic.

Include detailed specifications for:

1. SEO STRATEGY
   - Keyword research (long-tail, high-intent)
   - Content pillars
   - Content clusters
   - Publishing schedule
   - Link building strategy

2. SOCIAL STRATEGY
   - Primary platform (Facebook, Twitter, LinkedIn, etc.)
   - Secondary platforms
   - Content repurposing
   - Engagement strategy
   - Community building

3. TRAFFIC SOURCES
   - Organic search (target %)
   - Social media (target %)
   - Direct traffic (target %)
   - Referral traffic (target %)
   - Paid traffic (if applicable)

4. TRAFFIC GROWTH ROADMAP
   - Month 1: [Traffic target]
   - Month 3: [Traffic target]
   - Month 6: [Traffic target]
   - Month 12: [Traffic target]

5. TRAFFIC OPTIMIZATION
   - Conversion rate optimization
   - User engagement optimization
   - Page speed optimization
   - Mobile optimization

Output format:
- Traffic strategy document
- SEO strategy
- Social strategy
- Traffic growth roadmap
- Optimization guide

Run debug + security checks before output.
```

**Expected Output:**
- Traffic strategy
- SEO strategy
- Social strategy
- Growth roadmap
- Optimization guide

---

#### Prompt 2 — Content Engine
**Context Variables:**
- `[CONTENT_FORMAT]` — Format (blog, video, podcast, etc.)
- `[PUBLISHING_FREQUENCY]` — How often to publish

**Prompt Template:**
```
Create a comprehensive content system optimised for ad RPM.

Include detailed specifications for:

1. CONTENT TYPES
   - Type 1: [Name, format, frequency]
   - Type 2: [Name, format, frequency]
   - Type 3: [Name, format, frequency]
   - Type 4: [Name, format, frequency]

2. CONTENT STRUCTURE
   - Title optimization (for clicks)
   - Introduction (hook)
   - Body content
   - Ad placement opportunities
   - Conclusion/CTA

3. AD-FRIENDLY CONTENT
   - Content that attracts high-CPM ads
   - Topics with high advertiser demand
   - Seasonal content opportunities
   - Evergreen content strategy

4. CONTENT CALENDAR
   - Publishing schedule
   - Content mix
   - Seasonal planning
   - Evergreen content strategy

5. CONTENT OPTIMIZATION
   - SEO optimization
   - Readability optimization
   - Engagement optimization
   - Ad placement optimization

Output format:
- Content type specifications
- Content structure template
- Ad-friendly content guide
- Content calendar
- Optimization checklist

Run debug + security checks before output.
```

**Expected Output:**
- Content specifications
- Structure template
- Ad-friendly guide
- Content calendar
- Optimization checklist

---

#### Prompt 3 — Ad Network Setup
**Context Variables:**
- `[AD_NETWORKS]` — Networks to join (Google AdSense, Mediavine, AdThrive, etc.)
- `[TRAFFIC_VOLUME]` — Current monthly traffic

**Prompt Template:**
```
Provide comprehensive steps for AdSense/Mediavine/AdThrive integration.

Include detailed specifications for:

1. AD NETWORK SELECTION
   - Network 1: [Name, requirements, benefits]
   - Network 2: [Name, requirements, benefits]
   - Network 3: [Name, requirements, benefits]
   - Comparison and selection

2. SETUP PROCESS
   - Application process
   - Approval requirements
   - Account setup
   - Site verification

3. AD PLACEMENT
   - Header ad
   - In-content ads
   - Sidebar ads
   - Footer ads
   - Mobile ads
   - Optimal ad density

4. AD OPTIMIZATION
   - Ad size optimization
   - Ad placement optimization
   - Ad density optimization
   - A/B testing

5. COMPLIANCE
   - Ad network policies
   - User experience requirements
   - Disclosure requirements
   - Invalid traffic prevention

Output format:
- Ad network comparison
- Setup guide
- Ad placement guide
- Optimization strategies
- Compliance checklist

Run debug + security checks before output.
```

**Expected Output:**
- Network comparison
- Setup guide
- Placement guide
- Optimization strategies
- Compliance checklist

---

#### Prompt 4 — RPM Optimisation
**Context Variables:**
- `[CURRENT_RPM]` — Current CPM/RPM (if known)
- `[TARGET_RPM]` — Target RPM

**Prompt Template:**
```
Define comprehensive optimisation strategies for increasing ad revenue.

Include detailed specifications for:

1. RPM OPTIMIZATION
   - Current RPM analysis
   - Benchmarking against industry
   - Optimization opportunities
   - Target RPM

2. TRAFFIC QUALITY
   - Audience targeting
   - Geographic targeting
   - Seasonal optimization
   - Audience engagement

3. AD PLACEMENT OPTIMIZATION
   - Above-the-fold placement
   - In-content placement
   - Sidebar placement
   - Mobile placement
   - Ad density optimization

4. CONTENT OPTIMIZATION
   - High-RPM content topics
   - Seasonal content
   - Evergreen content
   - Content mix optimization

5. TECHNICAL OPTIMIZATION
   - Page speed optimization
   - Mobile optimization
   - User experience optimization
   - Ad loading optimization

Output format:
- RPM optimization strategy
- Traffic quality guide
- Placement optimization guide
- Content optimization strategy
- Technical optimization checklist

Run debug + security checks before output.
```

**Expected Output:**
- RPM strategy
- Traffic quality guide
- Placement guide
- Content strategy
- Technical checklist

---

#### Prompt 5 — Visualisation Trigger
```
[VISUALISATION PROMPT]
Generate a UI mockup prompt for an ad-optimised article layout.

Description:
- Purpose: Maximize ad revenue while maintaining readability
- Style: Professional, ad-optimized, user-friendly
- Color palette: [BRAND_COLORS]

Create a detailed article layout mockup showing:
- Header with navigation
- Article title and metadata
- Featured image
- Article introduction
- In-content ad placement
- Article body with multiple sections
- Sidebar with ads
- Footer with related content
- Mobile-responsive design
```

**Expected Output:**
- Article layout UI mockup
- Ad placement visualization
- Mobile-responsive design

---

### PACK 7: HIGH-TICKET PACK
**Purpose:** Sell premium offers ($500+)  
**Pack Size:** 4 prompts  
**Ideal For:** Coaching, consulting, premium services  
**Revenue Model:** High-ticket sales  
**Target Outcome:** Optimized high-ticket sales funnel

#### Prompt 1 — Offer Design
**Context Variables:**
- `[OFFER_NAME]` — Name of the offer
- `[PRICE_POINT]` — Price point ($500+)
- `[TARGET_CLIENT]` — Who is this for?

**Prompt Template:**
```
Define the high-ticket offer, value stack, and transformation.

Include detailed specifications for:

1. OFFER STRUCTURE
   - Offer name
   - Duration (weeks/months)
   - Deliverables
   - Format (1-on-1, group, hybrid)
   - Results/transformation

2. VALUE STACK
   - Core offer
   - Bonus 1: [Name, value]
   - Bonus 2: [Name, value]
   - Bonus 3: [Name, value]
   - Total value
   - Discounted price

3. TRANSFORMATION
   - Before state (client's current situation)
   - After state (desired result)
   - Specific, measurable transformation
   - Timeline to transformation
   - Proof/case studies

4. TARGET CLIENT
   - Who is this for?
   - What's their pain point?
   - What's their desired outcome?
   - What's their budget?
   - What's their timeline?

5. POSITIONING
   - Why you?
   - What makes you different?
   - Social proof/credentials
   - Track record

Output format:
- Offer specification document
- Value stack breakdown
- Transformation statement
- Target client profile
- Positioning statement

Run debug + security checks before output.
```

**Expected Output:**
- Offer specification
- Value stack
- Transformation statement
- Client profile
- Positioning statement

---

#### Prompt 2 — Funnel Design
**Context Variables:**
- `[FUNNEL_TYPE]` — VSL, webinar, application, etc.
- `[CONVERSION_GOAL]` — Target conversion rate (%)

**Prompt Template:**
```
Create a comprehensive high-ticket funnel with VSL, application, and call booking.

Include detailed specifications for:

1. FUNNEL STAGES
   - Stage 1: Awareness (lead magnet, VSL)
   - Stage 2: Interest (webinar, video)
   - Stage 3: Consideration (application)
   - Stage 4: Decision (discovery call)
   - Stage 5: Action (close)

2. VIDEO SALES LETTER (VSL)
   - Hook (attention-grabber)
   - Problem (pain point)
   - Agitation (why it matters)
   - Solution (your offer)
   - Social proof (testimonials)
   - Call-to-action (application link)

3. APPLICATION PROCESS
   - Application form (qualifying questions)
   - Screening criteria
   - Qualification logic
   - Approval/rejection messaging
   - Next steps

4. DISCOVERY CALL
   - Call booking system
   - Pre-call questionnaire
   - Call agenda
   - Call structure
   - Close strategy

5. CLOSE STRATEGY
   - Offer presentation
   - Objection handling
   - Payment options
   - Urgency/scarcity
   - Follow-up strategy

Output format:
- Funnel diagram
- VSL script outline
- Application form template
- Discovery call guide
- Close strategy document

Run debug + security checks before output.
```

**Expected Output:**
- Funnel diagram
- VSL script
- Application form
- Discovery call guide
- Close strategy

---

#### Prompt 3 — Authority Engine
**Context Variables:**
- `[NICHE]` — Your niche/industry
- `[AUTHORITY_ANGLE]` — Your unique authority angle

**Prompt Template:**
```
Generate comprehensive authority-building content + social proof.

Include detailed specifications for:

1. AUTHORITY CONTENT
   - Content 1: [Topic, format, platform]
   - Content 2: [Topic, format, platform]
   - Content 3: [Topic, format, platform]
   - Content 4: [Topic, format, platform]
   - Content 5: [Topic, format, platform]

2. SOCIAL PROOF
   - Testimonials (video, written)
   - Case studies
   - Results/outcomes
   - Client logos
   - Media mentions
   - Speaking engagements
   - Awards/recognition

3. CREDENTIALS
   - Education/certifications
   - Experience
   - Track record
   - Unique methodology
   - Results achieved

4. CONTENT STRATEGY
   - Blog posts
   - Videos
   - Podcasts
   - Social media
   - Email newsletter
   - Speaking engagements

5. SOCIAL PROOF COLLECTION
   - How to get testimonials
   - How to create case studies
   - How to document results
   - How to leverage social proof

Output format:
- Authority content plan
- Social proof strategy
- Credentials documentation
- Content calendar
- Social proof collection guide

Run debug + security checks before output.
```

**Expected Output:**
- Authority content plan
- Social proof strategy
- Credentials doc
- Content calendar
- Collection guide

---

#### Prompt 4 — Visualisation Trigger
```
[VISUALISATION PROMPT]
Generate a UI mockup prompt for the high-ticket landing page.

Description:
- Purpose: Attract qualified leads for high-ticket offer
- Style: Premium, professional, trust-building, authority-focused
- Color palette: [BRAND_COLORS]

Create a detailed landing page mockup showing:
- Hero section with headline and subheading
- Problem statement
- Solution/offer introduction
- Value stack breakdown
- Social proof/testimonials
- Client results/case studies
- Credentials/authority
- Application CTA button
- FAQ section
- Footer with contact info
```

**Expected Output:**
- Landing page UI mockup
- Premium design
- Authority communication

---

### PACK 8: MARKETPLACE MONETISATION PACK
**Purpose:** Optimise for Etsy/Gumroad/Shopify  
**Pack Size:** 4 prompts  
**Ideal For:** Digital products, templates, designs  
**Revenue Model:** Marketplace sales  
**Target Outcome:** Optimized marketplace listings with high conversion

#### Prompt 1 — Listing Optimisation
**Context Variables:**
- `[MARKETPLACE]` — Marketplace (Etsy, Gumroad, Shopify)
- `[PRODUCT_NAME]` — Name of the product
- `[TARGET_KEYWORDS]` — Target keywords

**Prompt Template:**
```
Create comprehensive SEO-optimised listing copy.

Include detailed specifications for:

1. PRODUCT TITLE
   - Title format (keyword + benefit)
   - Keyword inclusion
   - Character limit
   - Optimization tips

2. PRODUCT DESCRIPTION
   - Hook/opening
   - Problem statement
   - Solution explanation
   - Benefits and features
   - What's included
   - Who it's for
   - How to use
   - Call-to-action

3. TAGS AND CATEGORIES
   - Relevant tags (5-10)
   - Primary category
   - Secondary category
   - Keyword research

4. PRODUCT IMAGES
   - Cover image (most important)
   - Preview images (3-5)
   - Image optimization
   - Alt text

5. PRICING AND POSITIONING
   - Price point
   - Discount strategy
   - Bundle opportunities
   - Upsell strategy

Output format:
- Product title (optimized)
- Product description (SEO-optimized)
- Tags and categories
- Image optimization guide
- Pricing strategy

Run debug + security checks before output.
```

**Expected Output:**
- Product title
- Description
- Tags/categories
- Image guide
- Pricing strategy

---

#### Prompt 2 — Pricing + Bundles
**Context Variables:**
- `[BASE_PRICE]` — Base product price
- `[BUNDLE_STRATEGY]` — Bundle strategy (if applicable)

**Prompt Template:**
```
Define comprehensive pricing, bundles, and upsells.

Include detailed specifications for:

1. PRICING STRATEGY
   - Base price
   - Price justification
   - Competitive positioning
   - Psychological pricing

2. BUNDLE PRICING
   - Bundle 1: [Name, products, price]
   - Bundle 2: [Name, products, price]
   - Bundle 3: [Name, products, price]
   - Bundle discount strategy

3. TIERED PRICING
   - Tier 1: [Name, price, what's included]
   - Tier 2: [Name, price, what's included]
   - Tier 3: [Name, price, what's included]
   - Tier differentiation

4. UPSELL STRATEGY
   - Upsell 1: [Product, price]
   - Upsell 2: [Product, price]
   - Upsell 3: [Product, price]
   - Upsell messaging

5. DISCOUNT STRATEGY
   - Launch discount
   - Seasonal discounts
   - Bundle discounts
   - Volume discounts

Output format:
- Pricing strategy document
- Bundle breakdown
- Tier specification
- Upsell strategy
- Discount calendar

Run debug + security checks before output.
```

**Expected Output:**
- Pricing strategy
- Bundle breakdown
- Tier specification
- Upsell strategy
- Discount calendar

---

#### Prompt 3 — Automation
**Context Variables:**
- `[AUTOMATION_PLATFORM]` — Zapier, Make, etc.
- `[MARKETPLACE]` — Marketplace platform

**Prompt Template:**
```
Create comprehensive workflows for auto-delivery + email onboarding.

Include detailed specifications for:

1. AUTO-DELIVERY WORKFLOW
   - Trigger: Purchase completed
   - Actions: Send product files, send confirmation email
   - Timing: Immediate delivery
   - Error handling

2. EMAIL ONBOARDING WORKFLOW
   - Welcome email
   - Product usage tips
   - Follow-up emails
   - Upsell emails
   - Support information

3. CUSTOMER SUPPORT WORKFLOW
   - Support request handling
   - Response templates
   - Escalation procedures
   - Feedback collection

4. ANALYTICS WORKFLOW
   - Sales tracking
   - Customer tracking
   - Revenue reporting
   - Performance metrics

5. STEP-BY-STEP SETUP
   - Set up automation platform
   - Connect to marketplace
   - Create workflows
   - Test workflows
   - Monitor and optimize

Output format:
- Workflow diagrams
- Setup instructions
- Email sequence templates
- Testing checklist

Run debug + security checks before output.
```

**Expected Output:**
- Workflow diagrams
- Setup instructions
- Email templates
- Testing checklist

---

#### Prompt 4 — Visualisation Trigger
```
[VISUALISATION PROMPT]
Generate a product cover mockup prompt.

Description:
- Product: [PRODUCT_NAME]
- Marketplace: [MARKETPLACE]
- Purpose: Attract buyers and communicate value
- Color palette: [BRAND_COLORS]
- Style: Professional, eye-catching, marketplace-optimized

Create a detailed product cover mockup showing:
- Product title
- Tagline or key benefit
- Visuals (icons, illustrations, or photos)
- Creator/author name
- Price (optional)
- Badges or ratings (if applicable)
- Value proposition
```

**Expected Output:**
- Product cover mockup
- Marketplace-ready design
- Value communication

---

## MONETISATION PACKS SUMMARY

| Pack | Revenue Model | Best For | Setup Time | Revenue Potential |
|------|---------------|----------|-----------|-------------------|
| **Subscription** | Recurring MRR | SaaS, tools | 2-4 weeks | $5K-100K+ MRR |
| **Passive Income** | Automated revenue | Content, products | 4-8 weeks | $1K-50K+ MRR |
| **Affiliate** | Commission-based | Content sites | 2-4 weeks | $500-20K+ MRR |
| **Freemium → Upsell** | Free to paid conversion | Apps, SaaS | 2-4 weeks | $2K-50K+ MRR |
| **One-Time Product** | One-time sales | Courses, templates | 1-2 weeks | $1K-10K+ per launch |
| **Ad Revenue** | CPM-based | Blogs, content | 4-8 weeks | $500-10K+ MRR |
| **High-Ticket** | Premium sales | Coaching, consulting | 2-4 weeks | $5K-50K+ per sale |
| **Marketplace** | Marketplace sales | Digital products | 1-2 weeks | $500-5K+ MRR |

---

**The Monetisation Prompt Pack System provides complete frameworks for implementing any revenue model. Choose your pack, execute the prompts, and build a sustainable revenue stream.**

