# Asset-Type Prompt Pack System
## Complete Guide to 10 Product-Specific Frameworks

---

## OVERVIEW

The Asset-Type Prompt Pack System provides 10 specialized packs designed for specific product types and asset categories. Each pack includes complete prompts tailored to the unique requirements, architectures, and monetisation strategies of each asset type.

**System Features:**
- **10 Specialized Asset-Type Packs** covering major product categories
- **47 Detailed Prompts** with asset-type-specific context variables
- **Integrated Visualisation Hooks** for product-specific interfaces
- **Architecture and Implementation Guidance** for each asset type
- **Deployment and Scaling Strategies** specific to each asset
- **Quality Assurance Framework** with mandatory checks

---

## PACK CATEGORY 5: ASSET-TYPE PACKS (10 PACKS)

### PACK 1: SAAS BUILDER PACK
**Purpose:** Build a full SaaS product  
**Pack Size:** 6 prompts  
**Ideal For:** Entrepreneurs, developers, product managers  
**Technology Stack:** Next.js + Supabase + Stripe  
**Target Outcome:** Production-ready SaaS with recurring revenue

#### Prompt 1 — SaaS Architecture
**Context Variables:**
- `[SAAS_TYPE]` — Type of SaaS (productivity, analytics, automation, etc.)
- `[CORE_FEATURE]` — Main feature/value prop
- `[TARGET_USERS]` — Primary users

**Prompt Template:**
```
Design a SaaS architecture using Next.js + Supabase.

Include detailed specifications for:

1. ARCHITECTURE OVERVIEW
   - Frontend: Next.js with React
   - Backend: Supabase (PostgreSQL + Auth)
   - Payments: Stripe
   - Hosting: Vercel
   - Database: Supabase PostgreSQL

2. DATABASE SCHEMA
   - Users table
   - Subscriptions table
   - [Feature-specific tables]
   - Relationships and indexes

3. AUTHENTICATION
   - Supabase Auth (email/password, OAuth)
   - Session management
   - Role-based access control
   - Security best practices

4. API STRUCTURE
   - REST endpoints
   - Real-time subscriptions (if applicable)
   - Rate limiting
   - Error handling

5. SCALABILITY CONSIDERATIONS
   - Database optimization
   - Caching strategy
   - CDN usage
   - Load balancing

Output format:
- Architecture diagram
- Database schema
- API specification
- Authentication flow
- Scalability plan

Run debug + security checks before output.
```

**Expected Output:**
- Architecture diagram
- Database schema
- API specification
- Auth flow
- Scalability plan

---

#### Prompt 2 — Core Feature Build
**Context Variables:**
- `[CORE_FEATURE]` — Main feature to build
- `[COMPLEXITY]` — Simple, moderate, complex

**Prompt Template:**
```
Generate implementation steps for the core SaaS feature.

Include detailed specifications for:

1. FEATURE SPECIFICATION
   - Feature name and description
   - User workflow
   - Data requirements
   - UI/UX requirements

2. BACKEND IMPLEMENTATION
   - Database tables/fields
   - API endpoints
   - Business logic
   - Validation rules

3. FRONTEND IMPLEMENTATION
   - React components
   - State management
   - Form handling
   - Error handling

4. TESTING STRATEGY
   - Unit tests
   - Integration tests
   - E2E tests
   - Test coverage targets

5. DEPLOYMENT STEPS
   - Development setup
   - Testing checklist
   - Deployment process
   - Monitoring

Output format:
- Feature specification
- Backend implementation guide
- Frontend implementation guide
- Testing strategy
- Deployment checklist

Run debug + security checks before output.
```

**Expected Output:**
- Feature specification
- Backend guide
- Frontend guide
- Testing strategy
- Deployment checklist

---

#### Prompt 3 — Auth + Billing
**Context Variables:**
- `[PRICING_TIERS]` — Number and names of pricing tiers
- `[BILLING_CYCLE]` — Monthly, annual, both

**Prompt Template:**
```
Add Supabase auth + Stripe subscriptions.

Include detailed specifications for:

1. SUPABASE AUTH SETUP
   - Email/password authentication
   - OAuth providers (Google, GitHub, etc.)
   - Email verification
   - Password reset flow

2. USER ONBOARDING
   - Sign-up flow
   - Email confirmation
   - Profile setup
   - Tier selection

3. STRIPE INTEGRATION
   - Product setup in Stripe
   - Pricing tier configuration
   - Webhook setup
   - Payment processing

4. SUBSCRIPTION MANAGEMENT
   - Upgrade/downgrade flow
   - Billing portal
   - Invoice generation
   - Renewal reminders

5. SECURITY
   - PCI compliance
   - Data encryption
   - Secure API keys
   - Audit logging

Output format:
- Auth implementation guide
- Onboarding flow
- Stripe integration guide
- Subscription management system
- Security framework

Run debug + security checks before output.
```

**Expected Output:**
- Auth guide
- Onboarding flow
- Stripe integration
- Subscription management
- Security framework

---

#### Prompt 4 — Automation
**Context Variables:**
- `[AUTOMATION_FOCUS]` — Onboarding, reporting, alerts
- `[FREQUENCY]` — How often to run

**Prompt Template:**
```
Add automation: onboarding, reporting, alerts.

Include detailed specifications for:

1. ONBOARDING AUTOMATION
   - Welcome email
   - Feature tutorials
   - Setup wizard
   - Engagement tracking

2. REPORTING AUTOMATION
   - Daily/weekly/monthly reports
   - Email delivery
   - Metrics included
   - Actionable insights

3. ALERT SYSTEM
   - Alert types (usage, billing, errors)
   - Alert triggers
   - Notification channels
   - Alert preferences

4. RETENTION AUTOMATION
   - Churn prediction
   - Re-engagement campaigns
   - Win-back campaigns
   - Feedback requests

5. INTEGRATION
   - Email service integration
   - Slack notifications
   - Webhook support
   - Third-party integrations

Output format:
- Automation workflow specification
- Onboarding sequence
- Reporting system
- Alert configuration
- Retention strategy

Run debug + security checks before output.
```

**Expected Output:**
- Automation workflows
- Onboarding sequence
- Reporting system
- Alert configuration
- Retention strategy

---

#### Prompt 5 — Scaling
**Context Variables:**
- `[SCALE_LEVEL]` — Current users, target users
- `[BOTTLENECK]` — Database, API, frontend

**Prompt Template:**
```
Define scaling strategy: caching, DB optimisation, CDN.

Include detailed specifications for:

1. DATABASE OPTIMIZATION
   - Query optimization
   - Indexing strategy
   - Connection pooling
   - Read replicas

2. CACHING STRATEGY
   - Redis setup
   - Cache invalidation
   - Cache warming
   - TTL configuration

3. CDN SETUP
   - Static asset delivery
   - Image optimization
   - Geographic distribution
   - Cache headers

4. API OPTIMIZATION
   - Rate limiting
   - Request batching
   - Response compression
   - Pagination

5. MONITORING AND ALERTS
   - Performance monitoring
   - Error tracking
   - Usage analytics
   - Alert thresholds

Output format:
- Database optimization guide
- Caching strategy
- CDN configuration
- API optimization
- Monitoring setup

Run debug + security checks before output.
```

**Expected Output:**
- Database optimization
- Caching strategy
- CDN configuration
- API optimization
- Monitoring setup

---

#### Prompt 6 — Visualisation Trigger
```
[VISUALISATION PROMPT]
Generate a UI mockup prompt for the SaaS dashboard.

Description:
- Product: [SAAS_PRODUCT]
- Purpose: Manage [CORE_FEATURE]
- Style: Professional, data-focused, modern
- Color palette: [BRAND_COLORS]

Create a detailed SaaS dashboard mockup showing:
- Key metrics overview
- Main feature interface
- User management (if applicable)
- Settings panel
- Billing information
- Usage analytics
- Support resources
- Upgrade/downgrade options
```

**Expected Output:**
- SaaS dashboard UI mockup
- Feature interface
- Analytics display

---

### PACK 2: WEB APP BUILDER PACK
**Purpose:** Build a full-stack web app  
**Pack Size:** 5 prompts  
**Ideal For:** Developers, entrepreneurs, web developers  
**Technology Stack:** Next.js + Supabase  
**Target Outcome:** Production-ready web app

#### Prompt 1 — Architecture
**Context Variables:**
- `[APP_TYPE]` — Type of app (collaboration, marketplace, etc.)
- `[CORE_FEATURE]` — Main feature
- `[USERS]` — Single user, multi-user, teams

**Prompt Template:**
```
Design a web app architecture using Next.js + Supabase.

Include detailed specifications for:

1. ARCHITECTURE OVERVIEW
   - Frontend: Next.js with React
   - Backend: Supabase (PostgreSQL)
   - Hosting: Vercel
   - Database: Supabase PostgreSQL
   - Real-time: Supabase Realtime (if applicable)

2. PROJECT STRUCTURE
   - Directory structure
   - Component organization
   - API route structure
   - Utility functions

3. STATE MANAGEMENT
   - Client-side state
   - Server-side state
   - Real-time updates
   - Caching strategy

4. AUTHENTICATION
   - User authentication
   - Session management
   - Authorization
   - Role-based access

5. DEPLOYMENT
   - Environment setup
   - CI/CD pipeline
   - Monitoring
   - Error tracking

Output format:
- Architecture diagram
- Project structure
- State management plan
- Auth strategy
- Deployment plan

Run debug + security checks before output.
```

**Expected Output:**
- Architecture diagram
- Project structure
- State management
- Auth strategy
- Deployment plan

---

#### Prompt 2 — Database
**Context Variables:**
- `[DATA_MODEL]` — What data to store
- `[RELATIONSHIPS]` — How data relates

**Prompt Template:**
```
Generate DB schema.

Include detailed specifications for:

1. TABLES
   - Table 1: [Name, columns, types]
   - Table 2: [Name, columns, types]
   - Table 3: [Name, columns, types]
   - [Additional tables]

2. RELATIONSHIPS
   - Relationship 1: [Type, tables involved]
   - Relationship 2: [Type, tables involved]
   - Relationship 3: [Type, tables involved]
   - Foreign keys

3. INDEXES
   - Index 1: [Columns, type]
   - Index 2: [Columns, type]
   - Index 3: [Columns, type]
   - Query optimization

4. CONSTRAINTS
   - Unique constraints
   - Check constraints
   - Default values
   - NOT NULL constraints

5. MIGRATIONS
   - Initial schema
   - Migration strategy
   - Rollback procedures
   - Version control

Output format:
- Database schema diagram
- Table definitions
- Relationship diagram
- Index strategy
- Migration plan

Run debug + security checks before output.
```

**Expected Output:**
- Database schema
- Table definitions
- Relationships
- Index strategy
- Migration plan

---

#### Prompt 3 — Core Feature
**Context Variables:**
- `[CORE_FEATURE]` — Main feature to build
- `[COMPLEXITY]` — Simple, moderate, complex

**Prompt Template:**
```
Generate build steps for the core feature.

Include detailed specifications for:

1. FEATURE SPECIFICATION
   - Feature name and description
   - User workflow
   - Data requirements
   - UI/UX requirements

2. BACKEND IMPLEMENTATION
   - API endpoints
   - Database queries
   - Business logic
   - Error handling

3. FRONTEND IMPLEMENTATION
   - React components
   - Form handling
   - State management
   - Loading states

4. TESTING
   - Unit tests
   - Integration tests
   - E2E tests
   - Test data

5. DEPLOYMENT
   - Development setup
   - Testing checklist
   - Deployment steps
   - Monitoring

Output format:
- Feature specification
- Backend implementation
- Frontend implementation
- Testing strategy
- Deployment checklist

Run debug + security checks before output.
```

**Expected Output:**
- Feature specification
- Backend implementation
- Frontend implementation
- Testing strategy
- Deployment checklist

---

#### Prompt 4 — Deployment
**Context Variables:**
- `[HOSTING]` — Vercel, other
- `[DATABASE]` — Supabase, other

**Prompt Template:**
```
Deploy to Vercel + Supabase.

Include detailed specifications for:

1. VERCEL SETUP
   - Project creation
   - Environment variables
   - Build configuration
   - Deployment settings

2. SUPABASE SETUP
   - Project creation
   - Database setup
   - Auth configuration
   - API keys

3. ENVIRONMENT VARIABLES
   - Development variables
   - Production variables
   - Secret management
   - Security best practices

4. CI/CD PIPELINE
   - GitHub integration
   - Automated testing
   - Automated deployment
   - Rollback procedures

5. MONITORING
   - Error tracking
   - Performance monitoring
   - Uptime monitoring
   - Alert configuration

Output format:
- Deployment guide
- Environment setup
- CI/CD configuration
- Monitoring setup
- Troubleshooting guide

Run debug + security checks before output.
```

**Expected Output:**
- Deployment guide
- Environment setup
- CI/CD configuration
- Monitoring setup
- Troubleshooting guide

---

#### Prompt 5 — Visualisation Trigger
```
[VISUALISATION PROMPT]
Generate a UI mockup prompt for the web app.

Description:
- Product: [WEB_APP_PRODUCT]
- Purpose: [APP_PURPOSE]
- Style: [DESIGN_STYLE]
- Color palette: [BRAND_COLORS]

Create a detailed web app UI mockup showing:
- Main interface
- Navigation
- Feature screens
- Forms and inputs
- Loading states
- Error states
- Mobile responsiveness
```

**Expected Output:**
- Web app UI mockup
- Feature interfaces
- Navigation design

---

### PACK 3: MOBILE APP BUILDER PACK
**Purpose:** Build iOS/Android apps  
**Pack Size:** 5 prompts  
**Ideal For:** Mobile developers, entrepreneurs  
**Technology Stack:** React Native + Expo  
**Target Outcome:** Production-ready mobile app

#### Prompt 1 — Architecture
**Context Variables:**
- `[APP_TYPE]` — Type of app (productivity, social, etc.)
- `[PLATFORMS]` — iOS, Android, both
- `[BACKEND]` — Supabase, Firebase, etc.

**Prompt Template:**
```
Design a React Native/Expo architecture.

Include detailed specifications for:

1. ARCHITECTURE OVERVIEW
   - Frontend: React Native with Expo
   - Backend: [Supabase/Firebase]
   - Mobile platforms: iOS and Android
   - Package management: Expo

2. PROJECT STRUCTURE
   - Directory structure
   - Component organization
   - Screen structure
   - Navigation setup

3. STATE MANAGEMENT
   - Redux/Context API
   - Async storage
   - Real-time updates
   - Offline support

4. NATIVE MODULES
   - Camera
   - Geolocation
   - Notifications
   - File system

5. BUILD AND DEPLOYMENT
   - Development setup
   - Build process
   - App Store submission
   - Google Play submission

Output format:
- Architecture diagram
- Project structure
- State management plan
- Native module strategy
- Build and deployment plan

Run debug + security checks before output.
```

**Expected Output:**
- Architecture diagram
- Project structure
- State management
- Native modules
- Build/deployment plan

---

#### Prompt 2 — Screens
**Context Variables:**
- `[SCREEN_COUNT]` — Number of screens
- `[NAVIGATION_TYPE]` — Tab, stack, drawer

**Prompt Template:**
```
Define screens + navigation.

Include detailed specifications for:

1. SCREEN LIST
   - Screen 1: [Name, purpose, data]
   - Screen 2: [Name, purpose, data]
   - Screen 3: [Name, purpose, data]
   - [Additional screens]

2. NAVIGATION STRUCTURE
   - Navigation type (tab, stack, drawer)
   - Navigation flow
   - Deep linking
   - Back button handling

3. SCREEN COMPONENTS
   - Header components
   - List components
   - Form components
   - Modal components

4. INTERACTIONS
   - Gestures
   - Animations
   - Transitions
   - Loading states

5. RESPONSIVE DESIGN
   - Screen size handling
   - Orientation handling
   - Safe area handling
   - Accessibility

Output format:
- Screen list with descriptions
- Navigation diagram
- Component specifications
- Interaction guide
- Responsive design strategy

Run debug + security checks before output.
```

**Expected Output:**
- Screen list
- Navigation diagram
- Component specs
- Interaction guide
- Responsive design

---

#### Prompt 3 — Backend
**Context Variables:**
- `[BACKEND_TYPE]` — Supabase, Firebase, custom
- `[FEATURES]` — Auth, database, storage, etc.

**Prompt Template:**
```
Define backend using Supabase/Firebase.

Include detailed specifications for:

1. AUTHENTICATION
   - Auth method (email, OAuth, biometric)
   - Session management
   - Token refresh
   - Logout handling

2. DATABASE
   - Data model
   - Collections/tables
   - Relationships
   - Queries

3. FILE STORAGE
   - File types to store
   - Storage structure
   - Upload/download
   - Permissions

4. REAL-TIME FEATURES
   - Real-time updates
   - Subscriptions
   - Offline support
   - Sync strategy

5. API INTEGRATION
   - API endpoints
   - Error handling
   - Rate limiting
   - Retry logic

Output format:
- Backend architecture
- Authentication flow
- Database schema
- Storage strategy
- API specification

Run debug + security checks before output.
```

**Expected Output:**
- Backend architecture
- Auth flow
- Database schema
- Storage strategy
- API specification

---

#### Prompt 4 — Monetisation
**Context Variables:**
- `[MONETISATION_MODEL]` — Subscriptions, in-app purchases
- `[PRICE_POINT]` — Pricing strategy

**Prompt Template:**
```
Add subscriptions or in-app purchases.

Include detailed specifications for:

1. IN-APP PURCHASES
   - Product types
   - Pricing tiers
   - Entitlements
   - Restore purchases

2. SUBSCRIPTION SETUP
   - Subscription tiers
   - Billing cycle
   - Trial period
   - Cancellation flow

3. PAYMENT PROCESSING
   - Apple StoreKit
   - Google Play Billing
   - Receipt validation
   - Server-side verification

4. PAYWALL DESIGN
   - Paywall screens
   - Offer presentation
   - CTA placement
   - A/B testing

5. ANALYTICS
   - Conversion tracking
   - Churn tracking
   - Revenue tracking
   - Cohort analysis

Output format:
- Monetisation strategy
- In-app purchase setup
- Subscription configuration
- Payment processing guide
- Analytics setup

Run debug + security checks before output.
```

**Expected Output:**
- Monetisation strategy
- In-app purchase setup
- Subscription config
- Payment processing
- Analytics setup

---

#### Prompt 5 — Visualisation Trigger
```
[VISUALISATION PROMPT]
Generate a mobile UI mockup prompt.

Description:
- Product: [MOBILE_APP_PRODUCT]
- Purpose: [APP_PURPOSE]
- Style: [DESIGN_STYLE]
- Color palette: [BRAND_COLORS]

Create detailed mobile UI mockups showing:
- Onboarding screens
- Main screens
- Feature screens
- Settings screen
- Bottom navigation
- Modal dialogs
- Loading states
- Error states
```

**Expected Output:**
- Mobile UI mockups
- Screen designs
- Navigation design

---

### PACK 4: CHROME EXTENSION PACK
**Purpose:** Build a monetizable extension  
**Pack Size:** 4 prompts  
**Ideal For:** Developers, browser automation enthusiasts  
**Technology Stack:** Manifest v3, React  
**Target Outcome:** Production-ready Chrome extension

#### Prompt 1 — Architecture
**Context Variables:**
- `[EXTENSION_TYPE]` — Productivity, content, utility
- `[CORE_FEATURE]` — Main feature
- `[PERMISSIONS]` — Required permissions

**Prompt Template:**
```
Design a Manifest v3 extension.

Include detailed specifications for:

1. MANIFEST CONFIGURATION
   - Manifest version 3
   - Permissions required
   - Content scripts
   - Background service worker
   - Icons and branding

2. ARCHITECTURE
   - Popup component
   - Content script
   - Background worker
   - Storage strategy
   - Communication flow

3. STORAGE
   - Chrome storage API
   - Local storage
   - Sync storage
   - Data persistence

4. PERMISSIONS
   - Required permissions
   - Optional permissions
   - Host permissions
   - Permission justification

5. DEPLOYMENT
   - Chrome Web Store setup
   - Submission process
   - Review guidelines
   - Update strategy

Output format:
- Manifest specification
- Architecture diagram
- Storage strategy
- Permissions list
- Deployment guide

Run debug + security checks before output.
```

**Expected Output:**
- Manifest specification
- Architecture diagram
- Storage strategy
- Permissions list
- Deployment guide

---

#### Prompt 2 — Core Feature
**Context Variables:**
- `[FEATURE_TYPE]` — What the extension does
- `[COMPLEXITY]` — Simple, moderate, complex

**Prompt Template:**
```
Generate implementation steps.

Include detailed specifications for:

1. FEATURE SPECIFICATION
   - Feature name and description
   - User workflow
   - Data requirements
   - UI requirements

2. CONTENT SCRIPT
   - DOM manipulation
   - Event listeners
   - Message passing
   - Error handling

3. POPUP UI
   - React components
   - State management
   - User interactions
   - Settings

4. BACKGROUND WORKER
   - Event listeners
   - Data processing
   - API calls
   - Storage management

5. TESTING
   - Manual testing
   - Automated testing
   - Chrome DevTools
   - Edge cases

Output format:
- Feature specification
- Content script implementation
- Popup UI implementation
- Background worker implementation
- Testing strategy

Run debug + security checks before output.
```

**Expected Output:**
- Feature specification
- Content script impl
- Popup UI impl
- Background worker impl
- Testing strategy

---

#### Prompt 3 — Monetisation
**Context Variables:**
- `[MONETISATION_MODEL]` — Paywall, subscription
- `[PRICE_POINT]` — Pricing strategy

**Prompt Template:**
```
Add paywall or subscription.

Include detailed specifications for:

1. PAYWALL DESIGN
   - Paywall UI
   - Feature gating
   - CTA placement
   - Messaging

2. PAYMENT PROCESSING
   - Payment provider (Stripe, Gumroad)
   - License key system
   - Activation flow
   - License validation

3. SUBSCRIPTION MANAGEMENT
   - Subscription tiers
   - Billing cycle
   - Renewal reminders
   - Cancellation flow

4. LICENSE VERIFICATION
   - License key validation
   - Expiration checking
   - Offline support
   - License revocation

5. ANALYTICS
   - Conversion tracking
   - Feature usage
   - Churn tracking
   - Revenue tracking

Output format:
- Monetisation strategy
- Paywall design
- Payment processing guide
- License system
- Analytics setup

Run debug + security checks before output.
```

**Expected Output:**
- Monetisation strategy
- Paywall design
- Payment processing
- License system
- Analytics setup

---

#### Prompt 4 — Visualisation Trigger
```
[VISUALISATION PROMPT]
Generate a popup UI mockup prompt.

Description:
- Product: [EXTENSION_PRODUCT]
- Purpose: [EXTENSION_PURPOSE]
- Style: [DESIGN_STYLE]
- Color palette: [BRAND_COLORS]

Create a detailed popup UI mockup showing:
- Main interface
- Feature controls
- Settings button
- Status indicators
- Action buttons
- Premium upgrade CTA
- Help/support link
```

**Expected Output:**
- Popup UI mockup
- Feature interface
- Settings design

---

### PACK 5: NOTION TEMPLATE PACK
**Purpose:** Build sellable Notion templates  
**Pack Size:** 4 prompts  
**Ideal For:** Notion enthusiasts, template creators  
**Platform:** Notion + Gumroad  
**Target Outcome:** Profitable Notion template business

#### Prompt 1 — Template Structure
**Context Variables:**
- `[TEMPLATE_TYPE]` — Productivity, project management, etc.
- `[USE_CASE]` — What problem does it solve
- `[COMPLEXITY]` — Simple, moderate, complex

**Prompt Template:**
```
Define the Notion template structure.

Include detailed specifications for:

1. TEMPLATE PURPOSE
   - Problem solved
   - Target user
   - Key features
   - Unique value proposition

2. DATABASE STRUCTURE
   - Database 1: [Name, properties, views]
   - Database 2: [Name, properties, views]
   - Database 3: [Name, properties, views]
   - Relationships

3. VIEWS
   - View 1: [Type, purpose, filters]
   - View 2: [Type, purpose, filters]
   - View 3: [Type, purpose, filters]
   - Sorting and grouping

4. AUTOMATION
   - Formulas
   - Rollups
   - Relations
   - Buttons (if applicable)

5. DOCUMENTATION
   - Setup instructions
   - How to use guide
   - Customization guide
   - FAQ

Output format:
- Template specification
- Database structure
- View specifications
- Automation guide
- Documentation

Run debug + security checks before output.
```

**Expected Output:**
- Template specification
- Database structure
- View specs
- Automation guide
- Documentation

---

#### Prompt 2 — Automation
**Context Variables:**
- `[AUTOMATION_TYPE]` — Zapier, API, formulas
- `[INTEGRATIONS]` — What to integrate with

**Prompt Template:**
```
Add Notion API + Zapier automation.

Include detailed specifications for:

1. NOTION API SETUP
   - API integration
   - Database queries
   - Page creation
   - Property updates

2. ZAPIER INTEGRATION
   - Trigger setup
   - Action setup
   - Multi-step workflows
   - Error handling

3. AUTOMATION WORKFLOWS
   - Workflow 1: [Trigger, actions, outcome]
   - Workflow 2: [Trigger, actions, outcome]
   - Workflow 3: [Trigger, actions, outcome]
   - Scheduling

4. DATA SYNC
   - Two-way sync
   - Conflict resolution
   - Data validation
   - Backup strategy

5. DOCUMENTATION
   - Setup instructions
   - Troubleshooting guide
   - Advanced customization
   - Support resources

Output format:
- Notion API guide
- Zapier setup guide
- Automation workflows
- Data sync strategy
- Documentation

Run debug + security checks before output.
```

**Expected Output:**
- Notion API guide
- Zapier setup
- Automation workflows
- Data sync strategy
- Documentation

---

#### Prompt 3 — Monetisation
**Context Variables:**
- `[PRICE_POINT]` — Pricing strategy
- `[SALES_CHANNELS]` — Gumroad, Etsy, etc.

**Prompt Template:**
```
Define pricing + Gumroad delivery.

Include detailed specifications for:

1. PRICING STRATEGY
   - Base price
   - Tiered pricing (if applicable)
   - Bundle pricing
   - Discount strategy

2. GUMROAD SETUP
   - Product creation
   - File upload
   - License key setup
   - Delivery automation

3. DELIVERY SYSTEM
   - Instant delivery
   - Email delivery
   - License key generation
   - Support setup

4. MARKETING
   - Product description
   - Preview images
   - Video preview
   - Social media promotion

5. FINANCIAL PROJECTIONS
   - Expected sales
   - Revenue targets
   - Profit margins
   - Scaling strategy

Output format:
- Pricing strategy
- Gumroad setup guide
- Delivery system
- Marketing strategy
- Financial projections

Run debug + security checks before output.
```

**Expected Output:**
- Pricing strategy
- Gumroad setup
- Delivery system
- Marketing strategy
- Financial projections

---

#### Prompt 4 — Visualisation Trigger
```
[VISUALISATION PROMPT]
Generate a Notion layout mockup prompt.

Description:
- Product: [NOTION_TEMPLATE]
- Purpose: [TEMPLATE_PURPOSE]
- Style: [DESIGN_STYLE]
- Color palette: [BRAND_COLORS]

Create a detailed Notion layout mockup showing:
- Database views
- Property configurations
- Dashboard overview
- Sample data
- Navigation structure
- Color scheme
- Typography
```

**Expected Output:**
- Notion layout mockup
- Database visualization
- Template preview

---

### PACK 6: COURSE BUILDER PACK
**Purpose:** Build a digital course  
**Pack Size:** 5 prompts  
**Ideal For:** Course creators, educators, experts  
**Platform:** Teachable, Kajabi, or custom  
**Target Outcome:** Profitable digital course

#### Prompt 1 — Curriculum
**Context Variables:**
- `[COURSE_TOPIC]` — What the course teaches
- `[STUDENT_LEVEL]` — Beginner, intermediate, advanced
- `[DURATION]` — Course length

**Prompt Template:**
```
Define the course curriculum.

Include detailed specifications for:

1. COURSE OVERVIEW
   - Course title
   - Course description
   - Learning outcomes
   - Target audience
   - Prerequisites

2. MODULE STRUCTURE
   - Module 1: [Name, topics, lessons]
   - Module 2: [Name, topics, lessons]
   - Module 3: [Name, topics, lessons]
   - [Additional modules]

3. LESSON BREAKDOWN
   - Lesson 1: [Topic, duration, format]
   - Lesson 2: [Topic, duration, format]
   - Lesson 3: [Topic, duration, format]
   - [Additional lessons]

4. ASSESSMENTS
   - Quiz 1: [Topic, questions, passing score]
   - Quiz 2: [Topic, questions, passing score]
   - Final project: [Description, requirements]
   - Grading criteria

5. RESOURCES
   - Downloadable resources
   - Templates
   - Checklists
   - Bonus materials

Output format:
- Curriculum outline
- Module breakdown
- Lesson specifications
- Assessment strategy
- Resource list

Run debug + security checks before output.
```

**Expected Output:**
- Curriculum outline
- Module breakdown
- Lesson specs
- Assessment strategy
- Resource list

---

#### Prompt 2 — Content Production
**Context Variables:**
- `[CONTENT_FORMAT]` — Video, text, mixed
- `[PRODUCTION_QUALITY]` — Basic, professional, premium

**Prompt Template:**
```
Generate scripts, outlines, and lesson structure.

Include detailed specifications for:

1. VIDEO SCRIPTS
   - Lesson 1 script: [Talking points, duration]
   - Lesson 2 script: [Talking points, duration]
   - Lesson 3 script: [Talking points, duration]
   - [Additional scripts]

2. LESSON OUTLINES
   - Outline 1: [Key points, examples]
   - Outline 2: [Key points, examples]
   - Outline 3: [Key points, examples]
   - [Additional outlines]

3. PRESENTATION MATERIALS
   - Slides
   - Graphics
   - Animations
   - Branding

4. PRODUCTION WORKFLOW
   - Recording setup
   - Editing process
   - Quality assurance
   - Delivery format

5. ACCESSIBILITY
   - Captions/subtitles
   - Transcripts
   - Audio descriptions
   - Accessibility features

Output format:
- Video scripts
- Lesson outlines
- Presentation materials
- Production workflow
- Accessibility guide

Run debug + security checks before output.
```

**Expected Output:**
- Video scripts
- Lesson outlines
- Presentation materials
- Production workflow
- Accessibility guide

---

#### Prompt 3 — Monetisation
**Context Variables:**
- `[PRICE_POINT]` — Pricing strategy
- `[SALES_MODEL]` — One-time, subscription, payment plan

**Prompt Template:**
```
Define pricing, bundles, upsells.

Include detailed specifications for:

1. PRICING STRATEGY
   - Base price
   - Payment plan options
   - Discount strategy
   - Launch pricing

2. BUNDLE STRATEGY
   - Bundle 1: [Courses included, price]
   - Bundle 2: [Courses included, price]
   - Bundle 3: [Courses included, price]
   - Bundle discounts

3. UPSELL OPPORTUNITIES
   - Upsell 1: [Product, price, trigger]
   - Upsell 2: [Product, price, trigger]
   - Upsell 3: [Product, price, trigger]
   - Upsell sequence

4. PAYMENT PROCESSING
   - Payment provider
   - Payment plans
   - Refund policy
   - Invoice generation

5. FINANCIAL PROJECTIONS
   - Expected sales
   - Revenue targets
   - Profit margins
   - Scaling strategy

Output format:
- Pricing strategy
- Bundle strategy
- Upsell strategy
- Payment processing
- Financial projections

Run debug + security checks before output.
```

**Expected Output:**
- Pricing strategy
- Bundle strategy
- Upsell strategy
- Payment processing
- Financial projections

---

#### Prompt 4 — Funnel
**Context Variables:**
- `[TRAFFIC_SOURCE]` — Email, social, ads, organic
- `[CONVERSION_GOAL]` — Course enrollment

**Prompt Template:**
```
Create a course funnel.

Include detailed specifications for:

1. AWARENESS STAGE
   - Lead magnet
   - Content marketing
   - Social media
   - Paid ads

2. INTEREST STAGE
   - Landing page
   - Email sequence
   - Video preview
   - Testimonials

3. DECISION STAGE
   - Sales page
   - Sales video
   - FAQ
   - Objection handling

4. CONVERSION STAGE
   - Checkout page
   - Payment processing
   - Confirmation email
   - Onboarding

5. RETENTION STAGE
   - Welcome sequence
   - Engagement emails
   - Community
   - Upsells

Output format:
- Funnel diagram
- Stage specifications
- Email sequences
- Landing page outline
- Conversion optimization

Run debug + security checks before output.
```

**Expected Output:**
- Funnel diagram
- Stage specs
- Email sequences
- Landing page
- Conversion optimization

---

#### Prompt 5 — Visualisation Trigger
```
[VISUALISATION PROMPT]
Generate a course thumbnail mockup prompt.

Description:
- Course: [COURSE_TITLE]
- Topic: [COURSE_TOPIC]
- Style: [DESIGN_STYLE]
- Color palette: [BRAND_COLORS]

Create a detailed course thumbnail mockup showing:
- Course title
- Key benefit
- Instructor name/image
- Course rating
- Student count
- Price
- Call-to-action
- Professional design
```

**Expected Output:**
- Course thumbnail
- Sales page preview
- Marketing materials

---

### PACK 7: FUNNEL BUILDER PACK
**Purpose:** Build landing pages and funnels  
**Pack Size:** 4 prompts  
**Ideal For:** Marketers, entrepreneurs, course creators  
**Platform:** ConvertKit, Leadpages, or custom  
**Target Outcome:** High-converting sales funnel

#### Prompt 1 — Funnel Mapping
**Context Variables:**
- `[PRODUCT]` — What are you selling
- `[TARGET_AUDIENCE]` — Who are you selling to
- `[CONVERSION_GOAL]` — Email signup, purchase, etc.

**Prompt Template:**
```
Map the funnel: lead magnet → nurture → conversion.

Include detailed specifications for:

1. LEAD MAGNET
   - Lead magnet type
   - Value proposition
   - Delivery method
   - Expected conversion rate

2. NURTURE SEQUENCE
   - Email 1: [Purpose, content, CTA]
   - Email 2: [Purpose, content, CTA]
   - Email 3: [Purpose, content, CTA]
   - [Additional emails]

3. CONVERSION OFFER
   - Offer description
   - Price point
   - Urgency/scarcity
   - Guarantee

4. FUNNEL PAGES
   - Landing page
   - Thank you page
   - Sales page
   - Checkout page

5. METRICS
   - Conversion rate targets
   - Email open rates
   - Click-through rates
   - Revenue targets

Output format:
- Funnel diagram
- Lead magnet specification
- Email sequence outline
- Offer specification
- Metrics and targets

Run debug + security checks before output.
```

**Expected Output:**
- Funnel diagram
- Lead magnet spec
- Email sequence
- Offer spec
- Metrics

---

#### Prompt 2 — Copywriting
**Context Variables:**
- `[PAIN_POINT]` — What problem do you solve
- `[SOLUTION]` — How do you solve it
- `[BENEFIT]` — What's the benefit

**Prompt Template:**
```
Generate landing page + email copy.

Include detailed specifications for:

1. LANDING PAGE COPY
   - Headline
   - Subheadline
   - Hero section
   - Benefits section
   - Social proof
   - CTA section

2. EMAIL COPY
   - Email 1: [Subject, body, CTA]
   - Email 2: [Subject, body, CTA]
   - Email 3: [Subject, body, CTA]
   - [Additional emails]

3. SALES PAGE COPY
   - Headline
   - Problem statement
   - Solution explanation
   - Benefits list
   - Objection handling
   - CTA

4. COPYWRITING PRINCIPLES
   - Emotional triggers
   - Social proof
   - Urgency/scarcity
   - Clear benefits
   - Strong CTAs

5. TESTING STRATEGY
   - A/B testing plan
   - Metrics to track
   - Optimization targets
   - Iteration plan

Output format:
- Landing page copy
- Email sequences
- Sales page copy
- Copywriting guide
- Testing strategy

Run debug + security checks before output.
```

**Expected Output:**
- Landing page copy
- Email sequences
- Sales page copy
- Copywriting guide
- Testing strategy

---

#### Prompt 3 — Automation
**Context Variables:**
- `[EMAIL_PLATFORM]` — ConvertKit, Mailchimp, etc.
- `[AUTOMATION_LEVEL]` — Basic, advanced

**Prompt Template:**
```
Add automation for email + tagging.

Include detailed specifications for:

1. EMAIL AUTOMATION
   - Trigger 1: [Condition, action]
   - Trigger 2: [Condition, action]
   - Trigger 3: [Condition, action]
   - Sequences and delays

2. TAGGING SYSTEM
   - Tag 1: [Name, purpose]
   - Tag 2: [Name, purpose]
   - Tag 3: [Name, purpose]
   - Tag automation rules

3. SEGMENTATION
   - Segment 1: [Criteria, purpose]
   - Segment 2: [Criteria, purpose]
   - Segment 3: [Criteria, purpose]
   - Segment-specific messaging

4. WORKFLOWS
   - Workflow 1: [Steps, conditions]
   - Workflow 2: [Steps, conditions]
   - Workflow 3: [Steps, conditions]
   - Error handling

5. INTEGRATION
   - CRM integration
   - Analytics integration
   - Payment processor integration
   - Webhook setup

Output format:
- Email automation setup
- Tagging strategy
- Segmentation strategy
- Workflow specifications
- Integration guide

Run debug + security checks before output.
```

**Expected Output:**
- Email automation
- Tagging strategy
- Segmentation
- Workflows
- Integration guide

---

#### Prompt 4 — Visualisation Trigger
```
[VISUALISATION PROMPT]
Generate a landing page mockup prompt.

Description:
- Product: [PRODUCT]
- Purpose: [FUNNEL_PURPOSE]
- Style: [DESIGN_STYLE]
- Color palette: [BRAND_COLORS]

Create a detailed landing page mockup showing:
- Hero section
- Benefit section
- Social proof
- Pricing (if applicable)
- FAQ section
- CTA button
- Footer
- Mobile responsiveness
```

**Expected Output:**
- Landing page mockup
- Sales page design
- Funnel visualization

---

### PACK 8: CONTENT SYSTEM PACK
**Purpose:** Build a content engine  
**Pack Size:** 5 prompts  
**Ideal For:** Content creators, marketers, bloggers  
**Platform:** Blog, YouTube, social media  
**Target Outcome:** Scalable content system

#### Prompt 1 — Content Strategy
**Context Variables:**
- `[CONTENT_NICHE]` — Topic area
- `[PLATFORMS]` — Where to publish
- `[FREQUENCY]` — How often to publish

**Prompt Template:**
```
Define SEO + social content strategy.

Include detailed specifications for:

1. CONTENT PILLARS
   - Pillar 1: [Topic, subtopics]
   - Pillar 2: [Topic, subtopics]
   - Pillar 3: [Topic, subtopics]
   - Content clusters

2. SEO STRATEGY
   - Target keywords
   - Keyword research
   - Content structure
   - Link building strategy

3. SOCIAL MEDIA STRATEGY
   - Platform 1: [Content type, frequency]
   - Platform 2: [Content type, frequency]
   - Platform 3: [Content type, frequency]
   - Engagement strategy

4. CONTENT CALENDAR
   - Month 1: [Content plan]
   - Month 2: [Content plan]
   - Month 3: [Content plan]
   - Seasonal content

5. METRICS
   - Traffic targets
   - Engagement targets
   - Conversion targets
   - Growth targets

Output format:
- Content strategy document
- Content pillars
- SEO strategy
- Social media strategy
- Content calendar

Run debug + security checks before output.
```

**Expected Output:**
- Content strategy
- Content pillars
- SEO strategy
- Social strategy
- Content calendar

---

#### Prompt 2 — Automation
**Context Variables:**
- `[AUTOMATION_TOOLS]` — Buffer, Zapier, etc.
- `[CONTENT_TYPES]` — Blog, video, social

**Prompt Template:**
```
Add automation for scheduling + repurposing.

Include detailed specifications for:

1. SCHEDULING AUTOMATION
   - Scheduling tool setup
   - Optimal posting times
   - Batch scheduling
   - Timezone handling

2. CONTENT REPURPOSING
   - Blog to social
   - Video to blog
   - Blog to email
   - Repurposing templates

3. DISTRIBUTION
   - Multi-platform distribution
   - Cross-posting
   - Syndication
   - Newsletter automation

4. MONITORING
   - Performance tracking
   - Engagement monitoring
   - Comment monitoring
   - Analytics tracking

5. OPTIMIZATION
   - A/B testing
   - Performance analysis
   - Content optimization
   - Audience insights

Output format:
- Scheduling automation setup
- Repurposing strategy
- Distribution plan
- Monitoring setup
- Optimization strategy

Run debug + security checks before output.
```

**Expected Output:**
- Scheduling automation
- Repurposing strategy
- Distribution plan
- Monitoring setup
- Optimization strategy

---

#### Prompt 3 — Templates
**Context Variables:**
- `[CONTENT_TYPE]` — Blog post, video, social
- `[TEMPLATE_COUNT]` — Number of templates

**Prompt Template:**
```
Generate content templates.

Include detailed specifications for:

1. BLOG POST TEMPLATE
   - Headline formula
   - Introduction structure
   - Body structure
   - Conclusion structure
   - CTA structure

2. VIDEO SCRIPT TEMPLATE
   - Hook
   - Introduction
   - Main content
   - Call-to-action
   - Outro

3. SOCIAL MEDIA TEMPLATES
   - Template 1: [Format, structure]
   - Template 2: [Format, structure]
   - Template 3: [Format, structure]
   - Variations

4. EMAIL TEMPLATE
   - Subject line formula
   - Opening
   - Body
   - CTA
   - Signature

5. CONTENT CREATION CHECKLIST
   - Pre-creation checklist
   - Creation checklist
   - Post-creation checklist
   - Publishing checklist

Output format:
- Blog post template
- Video script template
- Social media templates
- Email template
- Content creation checklist

Run debug + security checks before output.
```

**Expected Output:**
- Blog post template
- Video script template
- Social templates
- Email template
- Checklist

---

#### Prompt 4 — Analytics
**Context Variables:**
- `[ANALYTICS_PLATFORM]` — Google Analytics, etc.
- `[METRICS]` — What to track

**Prompt Template:**
```
Define analytics + reporting.

Include detailed specifications for:

1. ANALYTICS SETUP
   - Google Analytics setup
   - Conversion tracking
   - Event tracking
   - Custom dashboards

2. KEY METRICS
   - Traffic metrics
   - Engagement metrics
   - Conversion metrics
   - Revenue metrics

3. REPORTING
   - Daily reports
   - Weekly reports
   - Monthly reports
   - Quarterly reports

4. INSIGHTS
   - Top performing content
   - Audience insights
   - Trend analysis
   - Opportunities

5. OPTIMIZATION
   - Content optimization
   - Distribution optimization
   - Audience targeting
   - Growth strategy

Output format:
- Analytics setup guide
- Key metrics definition
- Reporting schedule
- Insights framework
- Optimization strategy

Run debug + security checks before output.
```

**Expected Output:**
- Analytics setup
- Key metrics
- Reporting schedule
- Insights framework
- Optimization strategy

---

#### Prompt 5 — Visualisation Trigger
```
[VISUALISATION PROMPT]
Generate a content calendar mockup prompt.

Description:
- Product: [CONTENT_SYSTEM]
- Purpose: [CALENDAR_PURPOSE]
- Style: [DESIGN_STYLE]
- Color palette: [BRAND_COLORS]

Create a detailed content calendar mockup showing:
- Monthly view
- Content types (blog, video, social)
- Publishing dates
- Content titles
- Status indicators
- Performance metrics
- Team assignments
```

**Expected Output:**
- Content calendar mockup
- Planning visualization
- Analytics display

---

### PACK 9: AI TOOL BUILDER PACK
**Purpose:** Build AI-powered apps  
**Pack Size:** 5 prompts  
**Ideal For:** AI developers, entrepreneurs  
**Technology Stack:** LangChain, OpenAI, Next.js  
**Target Outcome:** Production-ready AI tool

#### Prompt 1 — AI Use Case
**Context Variables:**
- `[AI_USE_CASE]` — What the AI does
- `[PROBLEM]` — What problem it solves
- `[TARGET_USER]` — Who uses it

**Prompt Template:**
```
Define the AI use case.

Include detailed specifications for:

1. USE CASE DEFINITION
   - Use case name
   - Problem solved
   - Target user
   - Value proposition
   - Unique advantage

2. AI CAPABILITIES
   - Capability 1: [What the AI can do]
   - Capability 2: [What the AI can do]
   - Capability 3: [What the AI can do]
   - Limitations and edge cases

3. INPUT/OUTPUT
   - Input format (text, image, etc.)
   - Input constraints
   - Output format
   - Output quality metrics

4. DIFFERENTIATION
   - Competitive advantages
   - Unique features
   - Performance advantages
   - Cost advantages

5. SUCCESS METRICS
   - Accuracy metric
   - Speed metric
   - User satisfaction metric
   - Business metric

Output format:
- Use case specification
- AI capabilities
- Input/output specification
- Differentiation analysis
- Success metrics

Run debug + security checks before output.
```

**Expected Output:**
- Use case spec
- AI capabilities
- Input/output spec
- Differentiation
- Success metrics

---

#### Prompt 2 — Architecture
**Context Variables:**
- `[AI_MODEL]` — GPT-4, Claude, custom
- `[INFRASTRUCTURE]` — Cloud provider

**Prompt Template:**
```
Design AI architecture.

Include detailed specifications for:

1. AI MODEL SELECTION
   - Model choice
   - Model parameters
   - Fine-tuning strategy
   - Performance characteristics

2. ARCHITECTURE DESIGN
   - Frontend: Next.js
   - Backend: API routes
   - AI service: LangChain
   - Database: Supabase

3. VECTOR DATABASE
   - Vector DB choice
   - Embeddings model
   - Data storage
   - Retrieval strategy

4. INFRASTRUCTURE
   - Cloud provider
   - Deployment strategy
   - Scaling approach
   - Cost optimization

5. SECURITY
   - Data encryption
   - Privacy protection
   - Rate limiting
   - Audit logging

Output format:
- Architecture diagram
- Model specification
- Vector DB specification
- Infrastructure plan
- Security framework

Run debug + security checks before output.
```

**Expected Output:**
- Architecture diagram
- Model spec
- Vector DB spec
- Infrastructure plan
- Security framework

---

#### Prompt 3 — Prompt Engineering
**Context Variables:**
- `[USE_CASE]` — What the AI does
- `[TONE]` — Tone of responses

**Prompt Template:**
```
Generate system + user prompts.

Include detailed specifications for:

1. SYSTEM PROMPT
   - Role definition
   - Capabilities
   - Limitations
   - Tone and style
   - Output format

2. USER PROMPTS
   - Prompt 1: [Template, variables]
   - Prompt 2: [Template, variables]
   - Prompt 3: [Template, variables]
   - Prompt variations

3. PROMPT OPTIMIZATION
   - Few-shot examples
   - Chain-of-thought prompting
   - Prompt variations
   - Performance optimization

4. GUARDRAILS
   - Input validation
   - Output validation
   - Harmful content filtering
   - Fact-checking

5. TESTING
   - Test cases
   - Edge cases
   - Performance testing
   - Quality assurance

Output format:
- System prompt
- User prompt templates
- Prompt optimization guide
- Guardrails specification
- Testing strategy

Run debug + security checks before output.
```

**Expected Output:**
- System prompt
- User prompts
- Optimization guide
- Guardrails
- Testing strategy

---

#### Prompt 4 — Monetisation
**Context Variables:**
- `[REVENUE_MODEL]` — Subscription, credits, usage-based
- `[PRICE_POINT]` — Pricing strategy

**Prompt Template:**
```
Define monetisation: subscription, credits.

Include detailed specifications for:

1. SUBSCRIPTION MODEL
   - Tier 1: [Price, features]
   - Tier 2: [Price, features]
   - Tier 3: [Price, features]
   - Annual discount

2. CREDITS SYSTEM
   - Cost per credit
   - Credit allocation per tier
   - Overage pricing
   - Rollover policy

3. USAGE-BASED PRICING
   - Metric: [What to charge for]
   - Price per unit
   - Volume discounts
   - Overage handling

4. ENTERPRISE OFFERING
   - Custom pricing
   - Dedicated support
   - Custom integrations
   - Sales strategy

5. FINANCIAL PROJECTIONS
   - Expected conversion rates
   - Expected churn
   - Projected MRR
   - Revenue mix

Output format:
- Monetisation strategy
- Pricing tiers
- Credits system
- Usage pricing
- Financial projections

Run debug + security checks before output.
```

**Expected Output:**
- Monetisation strategy
- Pricing tiers
- Credits system
- Usage pricing
- Financial projections

---

#### Prompt 5 — Visualisation Trigger
```
[VISUALISATION PROMPT]
Generate a UI mockup prompt for the AI tool.

Description:
- Product: [AI_PRODUCT]
- Purpose: [AI_PURPOSE]
- Style: [DESIGN_STYLE]
- Color palette: [BRAND_COLORS]

Create a detailed AI tool UI mockup showing:
- Input area
- Processing indicator
- Output display
- Usage statistics
- Credit balance
- History
- Sharing options
- Upgrade to premium CTA
```

**Expected Output:**
- AI tool UI mockup
- Input/output visualization
- Usage tracking display

---

### PACK 10: MARKETPLACE PRODUCT PACK
**Purpose:** Build products for Etsy/Gumroad  
**Pack Size:** 4 prompts  
**Ideal For:** Digital product creators  
**Platform:** Etsy, Gumroad, Shopify  
**Target Outcome:** Profitable marketplace product

#### Prompt 1 — Product Definition
**Context Variables:**
- `[PRODUCT_TYPE]` — Digital product type
- `[TARGET_MARKET]` — Who would buy it
- `[PROBLEM_SOLVED]` — What problem it solves

**Prompt Template:**
```
Define the digital product.

Include detailed specifications for:

1. PRODUCT SPECIFICATION
   - Product name
   - Product description
   - Problem solved
   - Target audience
   - Unique value proposition

2. PRODUCT CONTENTS
   - File 1: [Type, description]
   - File 2: [Type, description]
   - File 3: [Type, description]
   - [Additional files]

3. PRODUCT FORMATS
   - Format 1: [Type, details]
   - Format 2: [Type, details]
   - Format 3: [Type, details]
   - Compatibility

4. CUSTOMIZATION OPTIONS
   - Option 1: [Name, choices]
   - Option 2: [Name, choices]
   - Option 3: [Name, choices]
   - Pricing impact

5. DELIVERY METHOD
   - Instant delivery
   - Email delivery
   - Download link
   - License key

Output format:
- Product specification
- Contents list
- Format specifications
- Customization options
- Delivery method

Run debug + security checks before output.
```

**Expected Output:**
- Product spec
- Contents list
- Format specs
- Customization options
- Delivery method

---

#### Prompt 2 — Listing Optimisation
**Context Variables:**
- `[MARKETPLACE]` — Etsy, Gumroad, etc.
- `[KEYWORDS]` — Target keywords
- `[COMPETITION]` — Competitive landscape

**Prompt Template:**
```
Generate SEO-optimised listing copy.

Include detailed specifications for:

1. TITLE OPTIMIZATION
   - Title formula
   - Keyword placement
   - Character count
   - Variations

2. DESCRIPTION
   - Hook
   - Problem statement
   - Solution explanation
   - Benefits list
   - Use cases
   - FAQ

3. TAGS/CATEGORIES
   - Tag 1: [Keyword]
   - Tag 2: [Keyword]
   - Tag 3: [Keyword]
   - [Additional tags]
   - Category selection

4. IMAGES/PREVIEW
   - Cover image
   - Preview images
   - Mockups
   - Lifestyle images

5. PRICING STRATEGY
   - Base price
   - Discount strategy
   - Bundle pricing
   - Seasonal pricing

Output format:
- Title optimization
- Description copy
- Tags and categories
- Image strategy
- Pricing strategy

Run debug + security checks before output.
```

**Expected Output:**
- Title optimization
- Description copy
- Tags/categories
- Image strategy
- Pricing strategy

---

#### Prompt 3 — Automation
**Context Variables:**
- `[DELIVERY_METHOD]` — Instant, email, etc.
- `[AUTOMATION_LEVEL]` — Basic, advanced

**Prompt Template:**
```
Add auto-delivery + onboarding.

Include detailed specifications for:

1. AUTO-DELIVERY SETUP
   - Delivery trigger
   - File delivery
   - License key generation
   - Email delivery

2. ONBOARDING SEQUENCE
   - Email 1: [Purpose, content]
   - Email 2: [Purpose, content]
   - Email 3: [Purpose, content]
   - [Additional emails]

3. CUSTOMER SUPPORT
   - FAQ automation
   - Support email template
   - Refund policy
   - Support channels

4. FOLLOW-UP AUTOMATION
   - Review request
   - Upsell email
   - Feedback request
   - Win-back campaign

5. ANALYTICS
   - Sales tracking
   - Conversion tracking
   - Customer feedback
   - Performance metrics

Output format:
- Auto-delivery setup
- Onboarding sequence
- Support automation
- Follow-up strategy
- Analytics setup

Run debug + security checks before output.
```

**Expected Output:**
- Auto-delivery setup
- Onboarding sequence
- Support automation
- Follow-up strategy
- Analytics setup

---

#### Prompt 4 — Visualisation Trigger
```
[VISUALISATION PROMPT]
Generate a product cover mockup prompt.

Description:
- Product: [MARKETPLACE_PRODUCT]
- Purpose: [PRODUCT_PURPOSE]
- Style: [DESIGN_STYLE]
- Color palette: [BRAND_COLORS]

Create a detailed product cover mockup showing:
- Product title
- Key benefit
- Visual representation
- Price
- Rating/reviews
- Creator name
- Call-to-action
- Professional design
```

**Expected Output:**
- Product cover mockup
- Listing preview
- Marketing materials

---

## ASSET-TYPE PACKS SUMMARY

| Pack | Asset Type | Best For | Setup Time | Revenue Potential |
|------|-----------|----------|-----------|-------------------|
| **SaaS Builder** | SaaS products | Entrepreneurs | 4-8 weeks | $5K-100K+ MRR |
| **Web App Builder** | Web applications | Developers | 3-6 weeks | $3K-50K+ MRR |
| **Mobile App Builder** | Mobile apps | Mobile devs | 6-12 weeks | $3K-80K+ MRR |
| **Chrome Extension** | Browser extensions | Developers | 2-4 weeks | $2K-15K+ MRR |
| **Notion Template** | Notion templates | Template creators | 1-2 weeks | $500-5K+ MRR |
| **Course Builder** | Digital courses | Course creators | 4-8 weeks | $5K-100K+ MRR |
| **Funnel Builder** | Sales funnels | Marketers | 2-4 weeks | $2K-50K+ MRR |
| **Content System** | Content engines | Content creators | 2-4 weeks | $2K-50K+ MRR |
| **AI Tool Builder** | AI-powered apps | AI developers | 3-6 weeks | $5K-75K+ MRR |
| **Marketplace Product** | Digital products | Product creators | 1-2 weeks | $500-10K+ MRR |

---

**The Asset-Type Prompt Pack System provides product-specific frameworks for building any digital asset. Choose your asset type, execute the prompts, and build a successful product.**

