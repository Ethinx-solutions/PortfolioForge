## Complete Guide to 8 Specialized MVP Building Frameworks

---

## OVERVIEW

The MVP Builder Prompt Pack System provides 8 specialized, production-ready prompt packs designed to guide founders, developers, and makers through rapid MVP development across different product categories and technology approaches.

**System Features:**
- **8 Specialized Packs** covering different product types and development approaches
- **Integrated Visualisation Hooks** for UI/UX design at key stages
- **Quality Assurance Framework** with debug, security, hallucination, and consistency checks
- **Context Variables** for customization and adaptation
- **Execution Workflows** showing how to use each pack end-to-end
- **Success Metrics** for measuring MVP progress and readiness

---

## PACK CATEGORY 1: MVP BUILDER PACKS (8 PACKS)

### PACK 1: 7-DAY MVP BUILDER PACK
**Purpose:** Build a working MVP in 7 days  
**Pack Size:** 7 prompts  
**Ideal For:** SaaS, tools, apps, extensions, niche utilities  
**Tech Stack Bias:** Full-stack (Next.js, Supabase, Stripe)  
**Target Outcome:** Functional MVP with core features, payment integration, and launch readiness

#### Prompt 1 — Market & Feature Validation
**Context Variables:**
- `[USER_IDEA]` — The core product idea
- `[TARGET_MARKET]` — Primary user segment
- `[COMPETITOR_COUNT]` — Number of competitors to analyze (default: 5)

**Prompt Template:**
```
Run a comprehensive market analysis for the idea: [USER_IDEA]

Identify:
1. Top 5 user pain points this idea solves
2. Top 5 direct competitors and their strengths/weaknesses
3. The #1 underserved gap in the market
4. A must-have vs nice-to-have feature list (prioritized by user impact)
5. Estimated TAM (Total Addressable Market) and initial target segment

For each pain point, provide:
- Pain point description
- Current solutions and their limitations
- How [USER_IDEA] solves it uniquely
- Estimated user willingness to pay

Output format:
- Executive summary (1 paragraph)
- Detailed analysis (5 sections)
- Feature prioritization matrix (must-have, nice-to-have, future)
- Competitive positioning statement

Run debug + security checks before output.
```

**Quality Assurance Checks:**
- ✓ Debug Check: Verify all 5 competitors are real and current
- ✓ Security Check: Ensure no confidential information is exposed
- ✓ Hallucination Check: Verify TAM estimates are grounded in real market data
- ✓ Consistency Check: Ensure feature list aligns with market analysis

**Visualisation Trigger:**
```
[VISUALISATION PROMPT]
Generate a UI concept image prompt for the MVP's core screen.

Description:
- Product: [USER_IDEA]
- Primary action: [CORE_FEATURE]
- Color palette: Modern, professional (blues and whites with accent color)
- Style: Clean, minimalist SaaS interface
- Key elements: Header navigation, hero CTA, feature showcase, pricing section
- Mood: Trustworthy, efficient, user-friendly
- Resolution: 1920x1080 (desktop view)

Include:
- Navigation bar with logo, menu items, and CTA button
- Hero section with headline, subheading, and primary CTA
- Feature cards (3-4 key features with icons)
- Pricing section showing subscription tiers
- Footer with links and social media

Style: Modern SaaS design with clean typography, ample whitespace, and intuitive layout.
```

**Expected Output:**
- Market analysis report (2-3 pages)
- Competitive positioning matrix
- Feature prioritization list
- UI concept image

---

#### Prompt 2 — MVP Architecture
**Context Variables:**
- `[TECH_STACK_BIAS]` — Technology preference (full-stack, no-code, AI-native, mobile, etc.)
- `[CORE_FEATURE]` — Primary feature to build
- `[SCALE_EXPECTATION]` — Expected user count at launch (100, 1000, 10000)

**Prompt Template:**
```
Design a minimal, scalable architecture for the MVP using [TECH_STACK_BIAS].

Include detailed specifications for:

1. FRONTEND
   - Framework: [Recommended framework based on tech stack]
   - UI Library: [Component library]
   - State Management: [State management solution]
   - Deployment: [Hosting platform]

2. BACKEND
   - Runtime: [Node.js, Python, etc.]
   - API Framework: [Express, FastAPI, etc.]
   - Authentication: [Auth solution]
   - Rate Limiting: [Rate limiting strategy]

3. DATABASE
   - Primary DB: [PostgreSQL, MongoDB, etc.]
   - Schema: [Basic schema for core feature]
   - Backup Strategy: [Backup approach]

4. AUTHENTICATION
   - Method: [OAuth, JWT, Supabase Auth, etc.]
   - Session Management: [Session strategy]
   - Security: [Security measures]

5. INTEGRATIONS
   - Payment: [Stripe, Paddle, etc.]
   - Email: [SendGrid, Mailgun, etc.]
   - Analytics: [Posthog, Mixpanel, etc.]
   - Storage: [S3, Cloudinary, etc.]

6. AUTOMATION LAYER
   - Task Queue: [Bull, Celery, etc.]
   - Scheduled Jobs: [Cron jobs, scheduled tasks]
   - Webhooks: [Webhook strategy]

7. DEPLOYMENT PATH
   - Development: [Local setup]
   - Staging: [Staging environment]
   - Production: [Production deployment]
   - CI/CD: [GitHub Actions, etc.]

8. COST ESTIMATION