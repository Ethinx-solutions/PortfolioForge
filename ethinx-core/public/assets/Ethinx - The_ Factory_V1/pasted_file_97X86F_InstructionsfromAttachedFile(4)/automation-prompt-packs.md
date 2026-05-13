# Automation Prompt Pack System
## Complete Guide to 8 Workflow Automation Frameworks

---

## OVERVIEW

The Automation Prompt Pack System provides 8 specialized packs designed to help you automate key business processes. Each pack includes complete prompts, implementation guides, error handling strategies, and integrated visualisation hooks.

**System Features:**
- **8 Specialized Automation Packs** covering different workflow types
- **36 Detailed Prompts** with context variables and implementation guides
- **Integrated Visualisation Hooks** for flowcharts, diagrams, and dashboards
- **Error Handling Strategies** for each automation type
- **Monitoring and Optimization** guidelines
- **Quality Assurance Framework** with mandatory checks

---

## PACK CATEGORY 3: AUTOMATION PACKS (8 PACKS)

### PACK 1: ZAPIER AUTOMATION PACK
**Purpose:** Build automated workflows  
**Pack Size:** 5 prompts  
**Ideal For:** Connecting apps and automating tasks  
**Automation Type:** Multi-app workflow automation  
**Target Outcome:** Fully automated workflows connecting multiple apps

#### Prompt 1 — Workflow Mapping
**Context Variables:**
- `[ASSET_NAME]` — Name of the asset/product
- `[CORE_PROCESS]` — Main process to automate
- `[APPS_TO_CONNECT]` — Apps to integrate (e.g., Stripe, Mailchimp, Google Sheets)

**Prompt Template:**
```
Map the comprehensive automation workflow for [ASSET_NAME].

Include detailed specifications for:

1. CURRENT PROCESS
   - Manual steps currently taken
   - Time spent on each step
   - Pain points and inefficiencies
   - Error-prone areas
   - Bottlenecks

2. DESIRED AUTOMATED PROCESS
   - Automated steps
   - Sequence of steps
   - Triggers and actions
   - Conditional logic
   - Time saved

3. APPS AND INTEGRATIONS
   - App 1: [Name, purpose, data flow]
   - App 2: [Name, purpose, data flow]
   - App 3: [Name, purpose, data flow]
   - [Additional apps as needed]

4. DATA FLOW
   - Data source (where does data come from?)
   - Data transformations (how is data modified?)
   - Data destinations (where does data go?)
   - Data format conversions (if needed)

5. WORKFLOW DIAGRAM
   - Visual representation of the workflow
   - Trigger points
   - Action points
   - Decision points
   - Data flow between apps

Output format:
- Current process analysis
- Desired automated process
- App integration diagram
- Data flow diagram
- Workflow specification

Run debug + security checks before output.
```

**Expected Output:**
- Process analysis
- Automated process design
- Integration diagram
- Data flow diagram
- Workflow specification

---

#### Prompt 2 — Trigger Design
**Context Variables:**
- `[TRIGGER_SOURCE]` — Where the trigger comes from (webhook, email, form, etc.)
- `[TRIGGER_CONDITION]` — What condition triggers the workflow

**Prompt Template:**
```
Define comprehensive Zapier triggers + filters.

Include detailed specifications for:

1. TRIGGER SETUP
   - Trigger app: [App name]
   - Trigger event: [Event name]
   - Trigger configuration: [Settings]
   - Test trigger: [How to test]

2. FILTERS
   - Filter 1: [Condition, logic]
   - Filter 2: [Condition, logic]
   - Filter 3: [Condition, logic]
   - Filter logic: [AND/OR combinations]

3. TRIGGER FREQUENCY
   - Real-time triggers
   - Scheduled triggers
   - Polling frequency (if applicable)
   - Batch processing (if applicable)

4. ERROR HANDLING
   - What if trigger fails?
   - Retry logic
   - Notification strategy
   - Fallback actions

5. TESTING
   - How to test the trigger
   - Test data
   - Expected results
   - Troubleshooting guide

Output format:
- Trigger specification
- Filter configuration
- Frequency settings
- Error handling strategy
- Testing guide

Run debug + security checks before output.
```

**Expected Output:**
- Trigger specification
- Filter configuration
- Frequency settings
- Error handling
- Testing guide

---

#### Prompt 3 — Multi-Step Automation
**Context Variables:**
- `[STEPS_COUNT]` — Number of steps (typically 3-10)
- `[CONDITIONAL_LOGIC]` — If/then logic needed

**Prompt Template:**
```
Create comprehensive multi-step workflows with branching logic.

Include detailed specifications for:

1. STEP SEQUENCE
   - Step 1: [Action, app, configuration]
   - Step 2: [Action, app, configuration]
   - Step 3: [Action, app, configuration]
   - [Additional steps as needed]

2. DATA MAPPING
   - Step 1 output → Step 2 input
   - Step 2 output → Step 3 input
   - [Continue for all steps]
   - Data transformations needed

3. BRANCHING LOGIC
   - If condition 1, then path A
   - If condition 2, then path B
   - If condition 3, then path C
   - Default path

4. DELAYS AND TIMING
   - Delay between steps (if needed)
   - Scheduled timing (if needed)
   - Batch processing (if needed)

5. MONITORING
   - How to monitor workflow execution
   - Success indicators
   - Failure indicators
   - Logging and tracking

Output format:
- Step-by-step workflow
- Data mapping specification
- Branching logic diagram
- Timing configuration
- Monitoring strategy

Run debug + security checks before output.
```

**Expected Output:**
- Workflow specification
- Data mapping
- Branching logic
- Timing configuration
- Monitoring strategy

---

#### Prompt 4 — Error Handling
**Context Variables:**
- `[FAILURE_SCENARIOS]` — Potential failure points
- `[NOTIFICATION_METHOD]` — How to notify on errors (email, Slack, etc.)

**Prompt Template:**
```
Define comprehensive error handling + fallback logic.

Include detailed specifications for:

1. ERROR SCENARIOS
   - Scenario 1: [Error type, cause, impact]
   - Scenario 2: [Error type, cause, impact]
   - Scenario 3: [Error type, cause, impact]
   - [Additional scenarios as needed]

2. ERROR DETECTION
   - How to detect each error
   - Error indicators
   - Monitoring approach
   - Alert triggers

3. FALLBACK LOGIC
   - Fallback 1: [For error 1, what to do]
   - Fallback 2: [For error 2, what to do]
   - Fallback 3: [For error 3, what to do]
   - Default fallback

4. RETRY STRATEGY
   - Retry count (how many times to retry)
   - Retry delay (how long to wait between retries)
   - Exponential backoff (if applicable)
   - When to give up

5. NOTIFICATION
   - Who to notify on error
   - How to notify (email, Slack, etc.)
   - What information to include
   - Escalation procedures

Output format:
- Error scenario analysis
- Error detection strategy
- Fallback logic specification
- Retry strategy
- Notification procedures

Run debug + security checks before output.
```

**Expected Output:**
- Error scenarios
- Detection strategy
- Fallback logic
- Retry strategy
- Notification procedures

---

#### Prompt 5 — Visualisation Trigger
```
[VISUALISATION PROMPT]
Generate a flowchart mockup prompt.

Description:
- Workflow: [CORE_PROCESS]
- Purpose: Visualize the automated workflow
- Style: Clear, logical, easy to follow

Create a detailed flowchart showing:
- Trigger point (start)
- Each step in sequence
- Decision points (if/then branches)
- Actions and integrations
- End points (success/failure)
- Data flow between steps
- Error handling paths

Include annotations showing:
- Step names
- App names
- Data being passed
- Conditional logic
- Timing/delays
```

**Expected Output:**
- Workflow flowchart
- Step-by-step visualization
- Decision logic diagram

---

### PACK 2: MAKE.COM AUTOMATION PACK
**Purpose:** Visual automation for complex workflows  
**Pack Size:** 5 prompts  
**Ideal For:** Complex workflows with advanced logic  
**Automation Type:** Visual scenario-based automation  
**Target Outcome:** Complex automated scenarios with advanced logic

#### Prompt 1 — Scenario Design
**Context Variables:**
- `[SCENARIO_NAME]` — Name of the scenario
- `[COMPLEXITY_LEVEL]` — Simple, moderate, or complex

**Prompt Template:**
```
Design comprehensive Make.com scenarios with routers + data mapping.

Include detailed specifications for:

1. SCENARIO STRUCTURE
   - Trigger module: [App, event]
   - Action modules: [Apps, actions]
   - Router modules: [Routing logic]
   - Aggregator modules: [Data aggregation]

2. ROUTERS
   - Router 1: [Condition, routing logic]
   - Router 2: [Condition, routing logic]
   - Router 3: [Condition, routing logic]
   - Default route

3. DATA MAPPING
   - Module 1 → Module 2 mapping
   - Module 2 → Module 3 mapping
   - [Continue for all modules]
   - Data transformations

4. ADVANCED FEATURES
   - Filters (if needed)
   - Aggregators (if needed)
   - Iterators (if needed)
   - Custom functions (if needed)

5. TESTING
   - How to test the scenario
   - Test data
   - Expected results
   - Troubleshooting

Output format:
- Scenario specification
- Router logic diagram
- Data mapping specification
- Advanced features guide
- Testing guide

Run debug + security checks before output.
```

**Expected Output:**
- Scenario specification
- Router logic
- Data mapping
- Advanced features
- Testing guide

---

#### Prompt 2 — Scheduling
**Context Variables:**
- `[SCHEDULE_TYPE]` — Immediate, scheduled, or recurring
- `[FREQUENCY]` — How often to run (if recurring)

**Prompt Template:**
```
Define comprehensive scheduled tasks + triggers.

Include detailed specifications for:

1. TRIGGER TYPES
   - Immediate trigger: [Event-based]
   - Scheduled trigger: [Time-based]
   - Recurring trigger: [Frequency]
   - Webhook trigger: [URL-based]

2. SCHEDULING
   - Frequency: [Daily, weekly, monthly, etc.]
   - Time: [Specific time or interval]
   - Timezone: [User's timezone]
   - Duration: [How long to run]

3. TRIGGER CONDITIONS
   - Condition 1: [Logic]
   - Condition 2: [Logic]
   - Condition 3: [Logic]
   - Condition combinations: [AND/OR]

4. EXECUTION SETTINGS
   - Execution mode: [Sequential or parallel]
   - Timeout: [How long before timing out]
   - Retry on failure: [Yes/no]
   - Retry count: [Number of retries]

5. MONITORING
   - How to monitor scheduled execution
   - Success indicators
   - Failure indicators
   - Logging and tracking

Output format:
- Trigger specification
- Schedule configuration
- Condition logic
- Execution settings
- Monitoring strategy

Run debug + security checks before output.
```

**Expected Output:**
- Trigger specification
- Schedule configuration
- Condition logic
- Execution settings
- Monitoring strategy

---

#### Prompt 3 — API Integrations
**Context Variables:**
- `[API_ENDPOINTS]` — APIs to integrate
- `[AUTHENTICATION_TYPE]` — Auth method (API key, OAuth, etc.)

**Prompt Template:**
```
Create comprehensive API-based modules for advanced automation.

Include detailed specifications for:

1. API MODULES
   - API 1: [Endpoint, method, authentication]
   - API 2: [Endpoint, method, authentication]
   - API 3: [Endpoint, method, authentication]
   - [Additional APIs as needed]

2. AUTHENTICATION
   - Auth type: [API key, OAuth, Basic, etc.]
   - Credentials: [How to provide credentials]
   - Token management: [If using OAuth]
   - Security: [How credentials are stored]

3. REQUEST CONFIGURATION
   - HTTP method: [GET, POST, PUT, DELETE, etc.]
   - Headers: [Required headers]
   - Body: [Request body format]
   - Query parameters: [If needed]

4. RESPONSE HANDLING
   - Response format: [JSON, XML, etc.]
   - Data extraction: [How to extract needed data]
   - Error responses: [How to handle errors]
   - Pagination: [If applicable]

5. ERROR HANDLING
   - HTTP error codes: [How to handle]
   - Timeout handling: [How to handle]
   - Retry logic: [Retry strategy]
   - Fallback actions: [If API fails]

Output format:
- API module specifications
- Authentication guide
- Request/response configuration
- Error handling strategy
- Testing guide

Run debug + security checks before output.
```

**Expected Output:**
- API specifications
- Authentication guide
- Request/response config
- Error handling
- Testing guide

---

#### Prompt 4 — Monitoring
**Context Variables:**
- `[MONITORING_TOOL]` — Monitoring platform (Make.com native, external, etc.)
- `[ALERT_THRESHOLD]` — When to alert (error rate, timeout, etc.)

**Prompt Template:**
```
Define comprehensive monitoring + alerting.

Include detailed specifications for:

1. METRICS TO MONITOR
   - Metric 1: [Name, target value]
   - Metric 2: [Name, target value]
   - Metric 3: [Name, target value]
   - [Additional metrics as needed]

2. MONITORING SETUP
   - Monitoring tool: [Make.com native or external]
   - Data collection: [What to collect]
   - Frequency: [How often to check]
   - Retention: [How long to keep data]

3. ALERTING
   - Alert 1: [Condition, trigger]
   - Alert 2: [Condition, trigger]
   - Alert 3: [Condition, trigger]
   - Alert severity: [Critical, warning, info]

4. NOTIFICATION
   - Notification channel: [Email, Slack, etc.]
   - Who to notify: [Team members]
   - When to notify: [Immediately, daily digest, etc.]
   - Escalation: [If alert not acknowledged]

5. DASHBOARDS
   - Dashboard 1: [Metrics shown]
   - Dashboard 2: [Metrics shown]
   - Dashboard 3: [Metrics shown]
   - Real-time vs historical data

Output format:
- Metrics specification
- Monitoring setup guide
- Alert configuration
- Notification procedures
- Dashboard design

Run debug + security checks before output.
```

**Expected Output:**
- Metrics specification
- Monitoring setup
- Alert configuration
- Notification procedures
- Dashboard design

---

#### Prompt 5 — Visualisation Trigger
```
[VISUALISATION PROMPT]
Generate a scenario diagram prompt.

Description:
- Scenario: [SCENARIO_NAME]
- Purpose: Visualize the Make.com scenario
- Style: Clear, modular, showing routers and data flow

Create a detailed scenario diagram showing:
- Trigger module (start)
- Action modules
- Router modules with conditions
- Data flow between modules
- Aggregator modules (if applicable)
- End points (success/failure)
- Error handling paths

Include annotations showing:
- Module names
- Data being passed
- Conditional logic
- Router paths
- Data transformations
```

**Expected Output:**
- Scenario diagram
- Module visualization
- Router logic diagram

---

### PACK 3: AI AGENT PACK
**Purpose:** Build autonomous AI agents  
**Pack Size:** 6 prompts  
**Ideal For:** Autonomous task execution, customer service, content generation  
**Automation Type:** AI-powered autonomous agents  
**Target Outcome:** Autonomous AI agent with tools, memory, and decision-making

#### Prompt 1 — Agent Role Definition
**Context Variables:**
- `[AGENT_NAME]` — Name of the agent
- `[PRIMARY_GOAL]` — What the agent should accomplish
- `[CONSTRAINTS]` — Limitations or rules for the agent

**Prompt Template:**
```
Define the agent's role, goals, and constraints.

Include detailed specifications for:

1. AGENT ROLE
   - Role name: [What is the agent called?]
   - Role description: [What does the agent do?]
   - Primary responsibility: [Main job]
   - Secondary responsibilities: [Supporting jobs]

2. GOALS
   - Goal 1: [What should the agent achieve?]
   - Goal 2: [What should the agent achieve?]
   - Goal 3: [What should the agent achieve?]
   - Goal metrics: [How to measure success]

3. CONSTRAINTS
   - Constraint 1: [Limitation or rule]
   - Constraint 2: [Limitation or rule]
   - Constraint 3: [Limitation or rule]
   - Safety constraints: [What the agent should NOT do]

4. DECISION-MAKING
   - How does the agent make decisions?
   - What factors does it consider?
   - How does it prioritize?
   - How does it handle conflicts?

5. LEARNING
   - Does the agent learn from interactions?
   - How does it improve over time?
   - What feedback does it use?
   - How often does it update?

Output format:
- Agent role specification
- Goals and metrics
- Constraints and rules
- Decision-making logic
- Learning strategy

Run debug + security checks before output.
```

**Expected Output:**
- Agent role specification
- Goals and metrics
- Constraints and rules
- Decision-making logic
- Learning strategy

---

#### Prompt 2 — Memory + Tools
**Context Variables:**
- `[MEMORY_TYPE]` — Short-term, long-term, or hybrid
- `[TOOLS_AVAILABLE]` — Tools the agent can use

**Prompt Template:**
```
Design comprehensive memory, retrieval, and tool usage.

Include detailed specifications for:

1. MEMORY SYSTEM
   - Short-term memory: [Conversation history, current context]
   - Long-term memory: [Learned patterns, user preferences]
   - Memory storage: [How/where memory is stored]
   - Memory retrieval: [How to access memory]
   - Memory decay: [How old memories are handled]

2. TOOLS
   - Tool 1: [Name, purpose, parameters]
   - Tool 2: [Name, purpose, parameters]
   - Tool 3: [Name, purpose, parameters]
   - [Additional tools as needed]

3. TOOL SELECTION
   - How does the agent choose which tool to use?
   - Tool prioritization: [How to rank tools]
   - Tool combination: [Can tools be combined?]
   - Tool fallback: [What if a tool fails?]

4. RETRIEVAL STRATEGY
   - Vector database: [For semantic search]
   - Keyword search: [For exact matches]
   - Hybrid search: [Combining methods]
   - Ranking and filtering: [How to rank results]

5. KNOWLEDGE BASE
   - What knowledge does the agent have?
   - How is knowledge organized?
   - How is knowledge updated?
   - How is knowledge accessed?

Output format:
- Memory system specification
- Tool definitions
- Tool selection logic
- Retrieval strategy
- Knowledge base design

Run debug + security checks before output.
```

**Expected Output:**
- Memory specification
- Tool definitions
- Tool selection logic
- Retrieval strategy
- Knowledge base design

---

#### Prompt 3 — Workflow Logic
**Context Variables:**
- `[WORKFLOW_TYPE]` — Sequential, branching, or reactive
- `[DECISION_POINTS]` — Key decision points

**Prompt Template:**
```
Create comprehensive agent workflows with decision trees.

Include detailed specifications for:

1. WORKFLOW STAGES
   - Stage 1: [Name, purpose, actions]
   - Stage 2: [Name, purpose, actions]
   - Stage 3: [Name, purpose, actions]
   - [Additional stages as needed]

2. DECISION TREES
   - Decision 1: [Condition, branches]
   - Decision 2: [Condition, branches]
   - Decision 3: [Condition, branches]
   - [Additional decisions as needed]

3. STATE MANAGEMENT
   - State 1: [Name, transitions]
   - State 2: [Name, transitions]
   - State 3: [Name, transitions]
   - State machine diagram

4. ACTION SEQUENCES
   - Sequence 1: [Steps to accomplish goal 1]
   - Sequence 2: [Steps to accomplish goal 2]
   - Sequence 3: [Steps to accomplish goal 3]
   - Action prioritization

5. FEEDBACK LOOPS
   - How does the agent get feedback?
   - How does it adjust based on feedback?
   - How does it improve over time?
   - How does it handle failure?

Output format:
- Workflow specification
- Decision tree diagrams
- State machine diagram
- Action sequences
- Feedback loop design

Run debug + security checks before output.
```

**Expected Output:**
- Workflow specification
- Decision trees
- State machine
- Action sequences
- Feedback loops

---

#### Prompt 4 — Error Handling
**Context Variables:**
- `[ERROR_SCENARIOS]` — Potential error scenarios
- `[SAFETY_LEVEL]` — Safety constraints (conservative, moderate, aggressive)

**Prompt Template:**
```
Define comprehensive fallback logic + safety constraints.

Include detailed specifications for:

1. ERROR SCENARIOS
   - Scenario 1: [Error type, cause, impact]
   - Scenario 2: [Error type, cause, impact]
   - Scenario 3: [Error type, cause, impact]
   - [Additional scenarios as needed]

2. FALLBACK LOGIC
   - Fallback 1: [For error 1, what to do]
   - Fallback 2: [For error 2, what to do]
   - Fallback 3: [For error 3, what to do]
   - Default fallback

3. SAFETY CONSTRAINTS
   - Constraint 1: [What the agent should NOT do]
   - Constraint 2: [What the agent should NOT do]
   - Constraint 3: [What the agent should NOT do]
   - Enforcement mechanism

4. HUMAN INTERVENTION
   - When to escalate to human
   - How to escalate
   - What information to provide
   - Follow-up after escalation

5. MONITORING
   - What to monitor
   - How to detect problems
   - Alert triggers
   - Logging and tracking

Output format:
- Error scenario analysis
- Fallback logic specification
- Safety constraint definition
- Escalation procedures
- Monitoring strategy

Run debug + security checks before output.
```

**Expected Output:**
- Error scenarios
- Fallback logic
- Safety constraints
- Escalation procedures
- Monitoring strategy

---

#### Prompt 5 — Monetisation
**Context Variables:**
- `[MONETISATION_MODEL]` — Subscription, credits, or usage-based
- `[PRICING_TIER]` — Pricing tier or cost per use

**Prompt Template:**
```
Add comprehensive monetisation to the agent (subscription, credits).

Include detailed specifications for:

1. MONETISATION MODEL
   - Model type: [Subscription, credits, usage-based]
   - Pricing: [Price per tier or per use]
   - Billing frequency: [Monthly, annual, pay-as-you-go]
   - Free tier: [If applicable]

2. FEATURE GATING
   - Free features: [What's free]
   - Premium features: [What's paid]
   - Usage limits: [Limits per tier]
   - Feature progression: [How to upgrade]

3. SUBSCRIPTION TIERS
   - Tier 1: [Name, price, features]
   - Tier 2: [Name, price, features]
   - Tier 3: [Name, price, features]
   - Annual discount: [If applicable]

4. USAGE-BASED PRICING
   - Metric: [What to charge for]
   - Price per unit: [Cost]
   - Volume discounts: [If applicable]
   - Overage handling: [What happens if limit exceeded]

5. PAYMENT INTEGRATION
   - Payment processor: [Stripe, Paddle, etc.]
   - Billing system: [How billing works]
   - Invoice generation: [How invoices are created]
   - Refund policy: [Refund terms]

Output format:
- Monetisation strategy document
- Feature gating specification
- Pricing tier breakdown
- Usage-based pricing guide
- Payment integration guide

Run debug + security checks before output.
```

**Expected Output:**
- Monetisation strategy
- Feature gating
- Pricing tiers
- Usage pricing
- Payment integration

---

#### Prompt 6 — Visualisation Trigger
```
[VISUALISATION PROMPT]
Generate a UI mockup prompt for the agent interface.

Description:
- Agent: [AGENT_NAME]
- Purpose: User interaction with the AI agent
- Style: Intuitive, conversational, professional
- Color palette: [BRAND_COLORS]

Create a detailed agent interface mockup showing:
- Chat/conversation area
- User input field
- Agent responses
- Tool usage indicators
- Memory/context display
- Settings panel
- Help/documentation
- Pricing/upgrade section
```

**Expected Output:**
- Agent interface UI mockup
- Conversation layout
- Tool integration display

---

### PACK 4: AUTO-EMAIL SEQUENCE PACK
**Purpose:** Build onboarding, upsell, re-engagement sequences  
**Pack Size:** 4 prompts  
**Ideal For:** Email marketing, customer retention  
**Automation Type:** Email sequence automation  
**Target Outcome:** Automated email sequences with high engagement

#### Prompt 1 — Sequence Mapping
**Context Variables:**
- `[SEQUENCE_TYPE]` — Onboarding, upsell, or re-engagement
- `[SEQUENCE_LENGTH]` — Number of emails (typically 3-8)

**Prompt Template:**
```
Map comprehensive onboarding, upsell, and re-engagement sequences.

Include detailed specifications for:

1. ONBOARDING SEQUENCE
   - Email 1: Welcome + setup (immediate)
   - Email 2: First steps (24 hours)
   - Email 3: Feature showcase (3 days)
   - Email 4: Social proof (7 days)
   - Email 5: Upgrade incentive (14 days)

2. UPSELL SEQUENCE
   - Email 1: Problem awareness (day 3)
   - Email 2: Solution introduction (day 5)
   - Email 3: Social proof (day 7)
   - Email 4: Objection handling (day 9)
   - Email 5: Urgency/scarcity (day 11)
   - Email 6: Final CTA (day 14)

3. RE-ENGAGEMENT SEQUENCE
   - Email 1: "We miss you" (day 1 of inactivity)
   - Email 2: Special offer (day 3)
   - Email 3: Social proof (day 5)
   - Email 4: Final attempt (day 7)

4. TRIGGERS
   - What triggers each sequence?
   - How to identify sequence membership?
   - Conditional logic for sequence selection
   - Exit conditions

5. METRICS
   - Open rate target
   - Click-through rate target
   - Conversion rate target
   - Unsubscribe rate tolerance

Output format:
- Sequence mapping document
- Email schedule
- Trigger specification
- Metrics and targets

Run debug + security checks before output.
```

**Expected Output:**
- Sequence mapping
- Email schedule
- Trigger specification
- Metrics and targets

---

#### Prompt 2 — Email Content
**Context Variables:**
- `[SEQUENCE_TYPE]` — Onboarding, upsell, or re-engagement
- `[TONE]` — Tone (friendly, professional, urgent, etc.)

**Prompt Template:**
```
Generate comprehensive email copy for each sequence.

Include detailed specifications for:

1. EMAIL STRUCTURE
   - Subject line (attention-grabbing)
   - Preview text (email preview)
   - From name (sender)
   - From email (sender email)
   - Reply-to (where replies go)

2. EMAIL BODY
   - Opening (hook)
   - Body (main message)
   - CTA (call-to-action)
   - PS (postscript)
   - Footer (unsubscribe, contact info)

3. PERSONALIZATION
   - Personalization tokens: [Name, company, etc.]
   - Segmentation: [Different content for different segments]
   - Dynamic content: [Content based on user data]

4. COPY FRAMEWORK
   - Headline (benefit-focused)
   - Subheadline (social proof or urgency)
   - Body copy (problem → solution → result)
   - CTA copy (action-oriented)

5. DESIGN
   - Email template
   - Color scheme
   - Images/graphics
   - Mobile optimization
   - Accessibility

Output format:
- Email copy templates
- Subject line variations
- Personalization strategy
- Design specifications

Run debug + security checks before output.
```

**Expected Output:**
- Email copy templates
- Subject lines
- Personalization strategy
- Design specifications

---

#### Prompt 3 — Automation Setup
**Context Variables:**
- `[EMAIL_PLATFORM]` — Mailchimp, ConvertKit, Klaviyo, etc.
- `[SEQUENCE_TYPE]` — Onboarding, upsell, or re-engagement

**Prompt Template:**
```
Define comprehensive triggers + delays in [EMAIL_PLATFORM].

Include detailed specifications for:

1. AUTOMATION SETUP
   - Email platform: [Platform name]
   - Automation type: [Trigger-based, scheduled]
   - Trigger: [What starts the sequence]
   - Entry conditions: [Who enters the sequence]

2. DELAYS
   - Delay between email 1 and 2: [Hours/days]
   - Delay between email 2 and 3: [Hours/days]
   - [Continue for all emails]
   - Optimal timing: [Best time to send]

3. CONDITIONAL LOGIC
   - Condition 1: [If user opens email, then...]
   - Condition 2: [If user clicks link, then...]
   - Condition 3: [If user converts, then...]
   - Exit conditions: [When to stop sequence]

4. SEGMENTATION
   - Segment 1: [Criteria, sequence variation]
   - Segment 2: [Criteria, sequence variation]
   - Segment 3: [Criteria, sequence variation]
   - Dynamic segmentation: [Real-time segmentation]

5. INTEGRATION
   - Integration with CRM: [How data flows]
   - Integration with payment: [Purchase tracking]
   - Integration with analytics: [Event tracking]
   - Integration with other tools: [Other integrations]

Output format:
- Automation setup guide
- Trigger and delay configuration
- Conditional logic specification
- Segmentation strategy
- Integration guide

Run debug + security checks before output.
```

**Expected Output:**
- Setup guide
- Trigger/delay config
- Conditional logic
- Segmentation strategy
- Integration guide

---

#### Prompt 4 — Visualisation Trigger
```
[VISUALISATION PROMPT]
Generate a flowchart mockup prompt.

Description:
- Sequence: [SEQUENCE_TYPE]
- Purpose: Visualize the email sequence flow
- Style: Clear, logical, showing triggers and conditions

Create a detailed flowchart showing:
- Trigger point (start)
- Each email in sequence
- Delays between emails
- Conditional branches (open/click/convert)
- Exit points
- Re-entry logic
- Segmentation paths

Include annotations showing:
- Email numbers
- Delays/timing
- Conditions
- Segment names
- Success/failure paths
```

**Expected Output:**
- Email sequence flowchart
- Trigger and condition visualization
- Timing diagram

---

### PACK 5: AUTO-CONTENT REFRESH PACK
**Purpose:** Keep content evergreen  
**Pack Size:** 4 prompts  
**Ideal For:** Blogs, documentation, courses  
**Automation Type:** Content lifecycle automation  
**Target Outcome:** Automated content refresh system

#### Prompt 1 — Content Mapping
**Context Variables:**
- `[CONTENT_TYPE]` — Blog posts, videos, courses, etc.
- `[REFRESH_FREQUENCY]` — How often to refresh (monthly, quarterly, etc.)

**Prompt Template:**
```
Identify comprehensive content requiring periodic refresh.

Include detailed specifications for:

1. CONTENT INVENTORY
   - Content 1: [Title, type, last updated, refresh priority]
   - Content 2: [Title, type, last updated, refresh priority]
   - Content 3: [Title, type, last updated, refresh priority]
   - [Additional content as needed]

2. REFRESH CRITERIA
   - What makes content "stale"?
   - How often should each type be refreshed?
   - What changes warrant a refresh?
   - What doesn't need refreshing?

3. REFRESH PRIORITY
   - High priority: [Content that gets most traffic]
   - Medium priority: [Content that gets moderate traffic]
   - Low priority: [Content that gets little traffic]
   - Evergreen content: [Content that doesn't need refresh]

4. REFRESH TYPES
   - Type 1: [Minor updates - update stats, links]
   - Type 2: [Moderate updates - add new sections]
   - Type 3: [Major updates - rewrite significant portions]
   - Type 4: [Complete refresh - rewrite entire content]

5. TRACKING
   - How to track when content was last refreshed
   - How to track refresh history
   - How to identify content needing refresh
   - Metrics for refresh success

Output format:
- Content inventory with refresh schedule
- Refresh criteria specification
- Priority matrix
- Refresh type definitions
- Tracking system design

Run debug + security checks before output.
```

**Expected Output:**
- Content inventory
- Refresh criteria
- Priority matrix
- Refresh types
- Tracking system

---

#### Prompt 2 — AI Rewrite Logic
**Context Variables:**
- `[AI_MODEL]` — AI model to use (GPT-4, Claude, etc.)
- `[REFRESH_TYPE]` — Type of refresh (minor, moderate, major)

**Prompt Template:**
```
Define comprehensive rewrite logic using AI.

Include detailed specifications for:

1. REWRITE STRATEGY
   - For minor updates: [What to update, how to update]
   - For moderate updates: [What to add, how to add]
   - For major updates: [What to rewrite, how to rewrite]
   - For complete refresh: [Full rewrite approach]

2. AI PROMPTS
   - Prompt 1: [For minor updates]
   - Prompt 2: [For moderate updates]
   - Prompt 3: [For major updates]
   - Prompt 4: [For complete refresh]

3. CONTENT PRESERVATION
   - What to keep from original content
   - What to update
   - What to remove
   - How to maintain voice/style

4. QUALITY ASSURANCE
   - How to verify AI output quality
   - Human review process
   - Fact-checking
   - Link verification

5. PUBLISHING
   - How to publish refreshed content
   - How to maintain SEO (redirects, canonical tags)
   - How to notify subscribers
   - How to track performance

Output format:
- Rewrite strategy document
- AI prompt templates
- Content preservation guidelines
- QA process
- Publishing workflow

Run debug + security checks before output.
```

**Expected Output:**
- Rewrite strategy
- AI prompts
- Preservation guidelines
- QA process
- Publishing workflow

---

#### Prompt 3 — Scheduling
**Context Variables:**
- `[REFRESH_FREQUENCY]` — How often to refresh
- `[BATCH_SIZE]` — How many pieces to refresh at once

**Prompt Template:**
```
Create comprehensive scheduled tasks for refresh cycles.

Include detailed specifications for:

1. REFRESH SCHEDULE
   - Frequency: [Daily, weekly, monthly, quarterly]
   - Batch size: [How many pieces per cycle]
   - Timing: [Best time to run]
   - Duration: [How long refresh takes]

2. AUTOMATION WORKFLOW
   - Step 1: Identify content needing refresh
   - Step 2: Pull content from source
   - Step 3: Generate AI rewrite
   - Step 4: Human review
   - Step 5: Publish refreshed content
   - Step 6: Update metadata

3. MONITORING
   - How to monitor refresh process
   - Success indicators
   - Failure indicators
   - Performance metrics

4. OPTIMIZATION
   - How to optimize refresh process
   - How to improve quality
   - How to reduce time
   - How to reduce cost

5. REPORTING
   - What to report
   - How often to report
   - Who to report to
   - Metrics to track

Output format:
- Refresh schedule specification
- Automation workflow
- Monitoring strategy
- Optimization guide
- Reporting plan

Run debug + security checks before output.
```

**Expected Output:**
- Refresh schedule
- Automation workflow
- Monitoring strategy
- Optimization guide
- Reporting plan

---

#### Prompt 4 — Visualisation Trigger
```
[VISUALISATION PROMPT]
Generate a content lifecycle diagram prompt.

Description:
- Purpose: Visualize the content refresh lifecycle
- Style: Circular/cyclical, showing stages and timing

Create a detailed content lifecycle diagram showing:
- Content creation stage
- Publishing stage
- Active/evergreen stage
- Refresh identification stage
- Refresh execution stage
- Re-publishing stage
- Performance tracking stage
- Cycle back to refresh identification

Include annotations showing:
- Stage names
- Duration of each stage
- Triggers for moving to next stage
- Metrics tracked
- Decision points
```

**Expected Output:**
- Content lifecycle diagram
- Stage visualization
- Timing information

---

### PACK 6: AUTO-REPORTING PACK
**Purpose:** Automated analytics + KPI dashboards  
**Pack Size:** 4 prompts  
**Ideal For:** Dashboards, analytics, business intelligence  
**Automation Type:** Reporting and analytics automation  
**Target Outcome:** Automated reporting system with KPI dashboards

#### Prompt 1 — KPI Definition
**Context Variables:**
- `[BUSINESS_TYPE]` — Type of business (SaaS, e-commerce, content, etc.)
- `[REPORTING_FREQUENCY]` — How often to report (daily, weekly, monthly)

**Prompt Template:**
```
Define comprehensive KPIs + data sources.

Include detailed specifications for:

1. KEY PERFORMANCE INDICATORS
   - KPI 1: [Name, formula, target, frequency]
   - KPI 2: [Name, formula, target, frequency]
   - KPI 3: [Name, formula, target, frequency]
   - [Additional KPIs as needed]

2. DATA SOURCES
   - Source 1: [Name, type, frequency]
   - Source 2: [Name, type, frequency]
   - Source 3: [Name, type, frequency]
   - [Additional sources as needed]

3. CALCULATIONS
   - Calculation 1: [Formula, inputs, outputs]
   - Calculation 2: [Formula, inputs, outputs]
   - Calculation 3: [Formula, inputs, outputs]
   - [Additional calculations as needed]

4. TARGETS AND THRESHOLDS
   - KPI 1 target: [Target value]
   - KPI 1 warning threshold: [When to alert]
   - KPI 1 critical threshold: [When to escalate]
   - [Repeat for all KPIs]

5. REPORTING FREQUENCY
   - Daily reports: [Which KPIs]
   - Weekly reports: [Which KPIs]
   - Monthly reports: [Which KPIs]
   - Ad-hoc reports: [How to request]

Output format:
- KPI definitions
- Data source specifications
- Calculation formulas
- Target and threshold definitions
- Reporting frequency plan

Run debug + security checks before output.
```

**Expected Output:**
- KPI definitions
- Data sources
- Calculations
- Targets/thresholds
- Reporting frequency

---

#### Prompt 2 — Data Ingestion
**Context Variables:**
- `[DATA_SOURCES]` — Sources to ingest (APIs, databases, etc.)
- `[INGESTION_FREQUENCY]` — How often to ingest (real-time, hourly, daily)

**Prompt Template:**
```
Create comprehensive ingestion workflows.

Include detailed specifications for:

1. DATA INGESTION PROCESS
   - Source 1: [How to ingest, frequency, format]
   - Source 2: [How to ingest, frequency, format]
   - Source 3: [How to ingest, frequency, format]
   - [Additional sources as needed]

2. DATA TRANSFORMATION
   - Transformation 1: [Input format → output format]
   - Transformation 2: [Input format → output format]
   - Transformation 3: [Input format → output format]
   - [Additional transformations as needed]

3. DATA STORAGE
   - Storage location: [Database, data warehouse, etc.]
   - Storage format: [How data is stored]
   - Retention policy: [How long to keep data]
   - Backup strategy: [How to backup data]

4. ERROR HANDLING
   - What if ingestion fails?
   - Retry logic
   - Fallback strategy
   - Notification strategy

5. MONITORING
   - How to monitor ingestion
   - Success indicators
   - Failure indicators
   - Performance metrics

Output format:
- Data ingestion workflow
- Transformation specifications
- Storage configuration
- Error handling strategy
- Monitoring plan

Run debug + security checks before output.
```

**Expected Output:**
- Ingestion workflow
- Transformations
- Storage config
- Error handling
- Monitoring plan

---

#### Prompt 3 — Reporting Logic
**Context Variables:**
- `[REPORTING_FORMAT]` — Email, dashboard, PDF, etc.
- `[AUDIENCE]` — Who receives reports

**Prompt Template:**
```
Generate comprehensive reporting + alerting logic.

Include detailed specifications for:

1. REPORT GENERATION
   - Report 1: [Name, frequency, format, content]
   - Report 2: [Name, frequency, format, content]
   - Report 3: [Name, frequency, format, content]
   - [Additional reports as needed]

2. ALERTING LOGIC
   - Alert 1: [Condition, trigger, action]
   - Alert 2: [Condition, trigger, action]
   - Alert 3: [Condition, trigger, action]
   - [Additional alerts as needed]

3. DISTRIBUTION
   - Report 1 recipients: [Who gets it]
   - Report 1 delivery method: [Email, dashboard, etc.]
   - Report 1 timing: [When to send]
   - [Repeat for all reports]

4. CUSTOMIZATION
   - Can users customize reports?
   - What can be customized?
   - How to save custom reports?
   - How to share custom reports?

5. ARCHIVING
   - How long to keep reports?
   - Where to archive reports?
   - How to access archived reports?
   - How to delete old reports?

Output format:
- Report specifications
- Alerting logic
- Distribution plan
- Customization options
- Archiving strategy

Run debug + security checks before output.
```

**Expected Output:**
- Report specifications
- Alerting logic
- Distribution plan
- Customization options
- Archiving strategy

---

#### Prompt 4 — Visualisation Trigger
```
[VISUALISATION PROMPT]
Generate a dashboard mockup prompt.

Description:
- Purpose: Display KPIs and metrics
- Style: Professional, data-focused, easy to understand
- Color palette: [BRAND_COLORS]

Create a detailed dashboard mockup showing:
- Key metrics/KPIs (prominently displayed)
- Charts and graphs (trends, comparisons)
- Tables (detailed data)
- Alerts/warnings (if thresholds exceeded)
- Filters (to customize view)
- Date range selector
- Export options
- Drill-down capabilities

Include annotations showing:
- Metric names
- Current values
- Targets
- Trends (up/down)
- Alert status
```

**Expected Output:**
- Dashboard UI mockup
- Metric visualization
- Chart layouts

---

### PACK 7: AUTO-LEAD QUALIFICATION PACK
**Purpose:** Score and route leads automatically  
**Pack Size:** 4 prompts  
**Ideal For:** Sales, lead generation, CRM  
**Automation Type:** Lead scoring and routing automation  
**Target Outcome:** Automated lead qualification system

#### Prompt 1 — Scoring Model
**Context Variables:**
- `[LEAD_SOURCE]` — Where leads come from (website, ads, etc.)
- `[IDEAL_CUSTOMER_PROFILE]` — Characteristics of ideal customer

**Prompt Template:**
```
Define comprehensive lead scoring logic.

Include detailed specifications for:

1. SCORING CRITERIA
   - Criterion 1: [Name, weight, scoring logic]
   - Criterion 2: [Name, weight, scoring logic]
   - Criterion 3: [Name, weight, scoring logic]
   - [Additional criteria as needed]

2. SCORING FACTORS
   - Demographic factors: [Age, company size, industry, etc.]
   - Behavioral factors: [Website visits, email opens, etc.]
   - Engagement factors: [Content downloads, form fills, etc.]
   - Purchase intent factors: [Product page visits, pricing page, etc.]

3. SCORING SCALE
   - Score range: [0-100]
   - Hot lead threshold: [Score ≥ X]
   - Warm lead threshold: [Score ≥ Y]
   - Cold lead threshold: [Score < Y]

4. LEAD LIFECYCLE
   - New lead: [Initial score]
   - Engaged lead: [Score increases with engagement]
   - Sales-ready lead: [Score meets threshold]
   - Disqualified lead: [Score drops below threshold]

5. SCORING UPDATE
   - How often to update scores
   - What triggers a score update
   - How to handle score decay
   - How to handle score spikes

Output format:
- Scoring model specification
- Scoring criteria and weights
- Scoring scale definition
- Lead lifecycle stages
- Score update rules

Run debug + security checks before output.
```

**Expected Output:**
- Scoring model
- Criteria and weights
- Scoring scale
- Lead lifecycle
- Update rules

---

#### Prompt 2 — Segmentation
**Context Variables:**
- `[SEGMENTS]` — Number of segments (typically 3-5)
- `[SEGMENTATION_CRITERIA]` — How to segment (score, industry, etc.)

**Prompt Template:**
```
Create comprehensive segmentation rules.

Include detailed specifications for:

1. SEGMENT DEFINITIONS
   - Segment 1: [Name, criteria, size estimate]
   - Segment 2: [Name, criteria, size estimate]
   - Segment 3: [Name, criteria, size estimate]
   - [Additional segments as needed]

2. SEGMENTATION RULES
   - Rule 1: [If X, then segment A]
   - Rule 2: [If Y, then segment B]
   - Rule 3: [If Z, then segment C]
   - [Additional rules as needed]

3. SEGMENT CHARACTERISTICS
   - Segment 1: [Characteristics, needs, messaging]
   - Segment 2: [Characteristics, needs, messaging]
   - Segment 3: [Characteristics, needs, messaging]
   - [Additional segments as needed]

4. SEGMENT ACTIONS
   - Segment 1 actions: [What to do with these leads]
   - Segment 2 actions: [What to do with these leads]
   - Segment 3 actions: [What to do with these leads]
   - [Additional segments as needed]

5. SEGMENT TRACKING
   - How to track segment membership
   - How to track segment performance
   - How to optimize segments
   - How to update segment definitions

Output format:
- Segment definitions
- Segmentation rules
- Segment characteristics
- Segment actions
- Tracking strategy

Run debug + security checks before output.
```

**Expected Output:**
- Segment definitions
- Segmentation rules
- Characteristics
- Actions
- Tracking strategy

---

#### Prompt 3 — Routing Logic
**Context Variables:**
- `[SALES_TEAM]` — Sales team structure (individuals, teams, etc.)
- `[ROUTING_CRITERIA]` — How to route (score, segment, etc.)

**Prompt Template:**
```
Define comprehensive routing workflows.

Include detailed specifications for:

1. ROUTING RULES
   - Rule 1: [If score ≥ X, route to sales team A]
   - Rule 2: [If segment = B, route to sales team B]
   - Rule 3: [If industry = C, route to sales team C]
   - [Additional rules as needed]

2. SALES TEAM ASSIGNMENT
   - Team 1: [Name, capacity, specialization]
   - Team 2: [Name, capacity, specialization]
   - Team 3: [Name, capacity, specialization]
   - [Additional teams as needed]

3. LOAD BALANCING
   - How to distribute leads evenly
   - How to handle capacity limits
   - How to prioritize high-value leads
   - How to handle overflow

4. ROUTING LOGIC
   - Primary routing: [Main routing criteria]
   - Secondary routing: [Fallback routing]
   - Exception handling: [Special cases]
   - Manual override: [How to override routing]

5. TRACKING
   - How to track routing
   - How to track routing performance
   - How to optimize routing
   - How to update routing rules

Output format:
- Routing rules specification
- Sales team definitions
- Load balancing strategy
- Routing logic diagram
- Tracking plan

Run debug + security checks before output.
```

**Expected Output:**
- Routing rules
- Team definitions
- Load balancing
- Logic diagram
- Tracking plan

---

#### Prompt 4 — Visualisation Trigger
```
[VISUALISATION PROMPT]
Generate a lead flow diagram prompt.

Description:
- Purpose: Visualize the lead scoring and routing flow
- Style: Clear, logical, showing decision points

Create a detailed lead flow diagram showing:
- Lead entry point
- Scoring process
- Score-based segmentation
- Segment-based routing
- Sales team assignment
- Follow-up actions
- Success/failure paths

Include annotations showing:
- Scoring criteria
- Score thresholds
- Segment names
- Routing rules
- Team assignments
- Action triggers
```

**Expected Output:**
- Lead flow diagram
- Scoring visualization
- Routing diagram

---

### PACK 8: AUTO-CUSTOMER SUPPORT PACK
**Purpose:** AI + automation for support  
**Pack Size:** 4 prompts  
**Ideal For:** Customer service, support automation  
**Automation Type:** Support workflow automation  
**Target Outcome:** Automated customer support system with AI

#### Prompt 1 — Support Workflow
**Context Variables:**
- `[SUPPORT_CHANNELS]` — Support channels (email, chat, etc.)
- `[SUPPORT_VOLUME]` — Expected support volume

**Prompt Template:**
```
Design comprehensive support workflows with chatbot + ticket routing.

Include detailed specifications for:

1. SUPPORT CHANNELS
   - Channel 1: [Email, chat, phone, etc.]
   - Channel 2: [Email, chat, phone, etc.]
   - Channel 3: [Email, chat, phone, etc.]
   - [Additional channels as needed]

2. CHATBOT WORKFLOW
   - Chatbot greeting: [Initial message]
   - Intent detection: [How to identify customer intent]
   - FAQ responses: [Automated responses for common questions]
   - Escalation: [When to escalate to human]

3. TICKET CREATION
   - Trigger: [What creates a ticket]
   - Ticket fields: [Information to capture]
   - Priority assignment: [How to prioritize]
   - Assignment: [Who to assign to]

4. ROUTING LOGIC
   - Route 1: [Condition, destination]
   - Route 2: [Condition, destination]
   - Route 3: [Condition, destination]
   - [Additional routes as needed]

5. ESCALATION
   - When to escalate to human
   - Who to escalate to
   - How to escalate
   - Escalation priority

Output format:
- Support workflow specification
- Chatbot workflow
- Ticket creation process
- Routing logic
- Escalation procedures

Run debug + security checks before output.
```

**Expected Output:**
- Support workflow
- Chatbot workflow
- Ticket process
- Routing logic
- Escalation procedures

---

#### Prompt 2 — Response Templates
**Context Variables:**
- `[COMMON_ISSUES]` — Common support issues
- `[TONE]` — Support tone (friendly, professional, etc.)

**Prompt Template:**
```
Generate comprehensive canned responses + escalation logic.

Include detailed specifications for:

1. RESPONSE TEMPLATES
   - Template 1: [Issue, response, tone]
   - Template 2: [Issue, response, tone]
   - Template 3: [Issue, response, tone]
   - [Additional templates as needed]

2. PERSONALIZATION
   - How to personalize responses
   - What information to include
   - How to maintain consistency
   - How to avoid sounding robotic

3. ESCALATION RESPONSES
   - Response 1: [When to escalate, what to say]
   - Response 2: [When to escalate, what to say]
   - Response 3: [When to escalate, what to say]
   - [Additional responses as needed]

4. FOLLOW-UP
   - Follow-up timing: [When to follow up]
   - Follow-up message: [What to say]
   - Follow-up frequency: [How often to follow up]
   - Follow-up escalation: [When to escalate follow-up]

5. FEEDBACK
   - How to collect feedback
   - How to use feedback to improve
   - How to track satisfaction
   - How to identify problem areas

Output format:
- Response templates
- Personalization strategy
- Escalation responses
- Follow-up strategy
- Feedback collection plan

Run debug + security checks before output.
```

**Expected Output:**
- Response templates
- Personalization strategy
- Escalation responses
- Follow-up strategy
- Feedback plan

---

#### Prompt 3 — Automation Layer
**Context Variables:**
- `[AUTOMATION_PLATFORM]` — Zapier, Make, etc.
- `[SUPPORT_TOOLS]` — Support tools (Zendesk, Intercom, etc.)

**Prompt Template:**
```
Create comprehensive automation for routing, tagging, and follow-up.

Include detailed specifications for:

1. TICKET ROUTING AUTOMATION
   - Trigger: [What creates a ticket]
   - Actions: [Route to right team, assign priority]
   - Conditional logic: [Route based on issue type]
   - Error handling: [What if routing fails]

2. TAGGING AUTOMATION
   - Tag 1: [When to apply, what it means]
   - Tag 2: [When to apply, what it means]
   - Tag 3: [When to apply, what it means]
   - [Additional tags as needed]

3. FOLLOW-UP AUTOMATION
   - Follow-up trigger: [What triggers follow-up]
   - Follow-up timing: [When to send follow-up]
   - Follow-up message: [What to send]
   - Follow-up frequency: [How often to follow up]

4. ESCALATION AUTOMATION
   - Escalation trigger: [What triggers escalation]
   - Escalation action: [What to do]
   - Escalation notification: [Who to notify]
   - Escalation timing: [When to escalate]

5. REPORTING AUTOMATION
   - Metrics to track: [What to measure]
   - Report frequency: [How often to report]
   - Report recipients: [Who gets reports]
   - Report format: [Email, dashboard, etc.]

Output format:
- Routing automation specification
- Tagging automation
- Follow-up automation
- Escalation automation
- Reporting automation

Run debug + security checks before output.
```

**Expected Output:**
- Routing automation
- Tagging automation
- Follow-up automation
- Escalation automation
- Reporting automation

---

#### Prompt 4 — Visualisation Trigger
```
[VISUALISATION PROMPT]
Generate a support dashboard mockup prompt.

Description:
- Purpose: Monitor support operations and performance
- Style: Professional, real-time, actionable
- Color palette: [BRAND_COLORS]

Create a detailed support dashboard mockup showing:
- Open tickets (count, priority)
- Ticket queue (by team, by priority)
- Response time metrics
- Resolution time metrics
- Customer satisfaction scores
- Common issues/topics
- Team performance
- Alerts/warnings

Include annotations showing:
- Metric names
- Current values
- Targets
- Trends
- Alert status
```

**Expected Output:**
- Support dashboard mockup
- Metric visualization
- Performance tracking

---

## AUTOMATION PACKS SUMMARY

| Pack | Automation Type | Best For | Setup Time | Time Saved |
|------|-----------------|----------|-----------|-----------|
| **Zapier** | Multi-app workflows | Connecting apps | 1-2 weeks | 5-20 hrs/week |
| **Make.com** | Complex workflows | Advanced logic | 2-4 weeks | 10-30 hrs/week |
| **AI Agent** | Autonomous agents | Task execution | 2-4 weeks | 20-50 hrs/week |
| **Email Sequences** | Email automation | Onboarding, upsell | 1-2 weeks | 5-15 hrs/week |
| **Content Refresh** | Content automation | Keeping content fresh | 2-4 weeks | 10-20 hrs/week |
| **Reporting** | Analytics automation | KPI tracking | 1-2 weeks | 5-10 hrs/week |
| **Lead Qualification** | Lead automation | Lead scoring | 1-2 weeks | 10-20 hrs/week |
| **Support** | Support automation | Customer service | 2-4 weeks | 15-30 hrs/week |

---

**The Automation Prompt Pack System provides complete frameworks for automating any business process. Choose your pack, execute the prompts, and save significant time and effort.**

