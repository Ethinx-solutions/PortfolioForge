## Dynamic Pack Sequence Assembly Specification

---

## SECTION 1: PURPOSE & CORE CONCEPTS

### 1.1 Purpose

The **Pack Composer Engine** is a sophisticated recommendation and sequencing system that dynamically assembles optimal pack sequences from the 60-pack PromptForge ecosystem based on:

- **User Goals** (build, monetise, automate, grow, optimise)
- **Asset Type** (SaaS, web app, mobile app, extension, course, marketplace, template, funnel, content system, AI tool)
- **Niche** (fitness, finance, productivity, e-commerce, creator economy, parenting, education, AI tools, local business, health & wellness)
- **Current Stage** (idea, MVP, post-launch, scaling)
- **Growth Strategy** (organic, viral, paid, partnerships, hybrid)
- **User Skill Level** (beginner, intermediate, advanced)
- **Time Horizon** (weeks available)
- **Budget Constraints** (low, medium, high)

**Output:** An optimized sequence of packs with:
- Recommended execution order
- Estimated timeline and cost
- Success probability
- Alternative paths
- Risk assessment

---

### 1.2 Core Data Structures

#### Pack Metadata
```typescript
interface PackMetadata {
  // Identity
  id: string;
  name: string;
  description: string;
  category: 'MVP' | 'Monetisation' | 'Automation' | 'Niche' | 'AssetType' | 'Growth';
  
  // Content
  promptsCount: number;
  estimatedTime: number;  // minutes
  estimatedCredits: number;
  
  // Compatibility
  assetTypes: string[];  // SaaS, web app, mobile app, etc.
  niches: string[];      // fitness, finance, etc.
  goals: string[];       // build, monetise, automate, grow, optimise
  growthChannels: string[];  // organic, viral, paid, partnerships
  skillLevels: string[];  // beginner, intermediate, advanced
  
  // Sequencing
  phaseTags: string[];   // Discovery, Build, Monetise, Automate, Grow, Optimise
  dependencies: string[];  // Pack IDs that should come before this
  conflicts: string[];   // Pack IDs that conflict with this
  
  // Quality metrics
  successRate: number;   // 0-100%
  userRating: number;    // 0-5
  completionRate: number;  // 0-100%
  
  // Metadata
  createdAt: timestamp;
  updatedAt: timestamp;
  version: number;
}

// Example
const packMetadata: PackMetadata = {
  id: 'pack_mvp_saas_1',
  name: '7-Day MVP Builder Pack',
  description: 'Build a complete SaaS MVP in 7 days',
  category: 'MVP',
  promptsCount: 7,
  estimatedTime: 480,  // 8 hours
  estimatedCredits: 450,
  assetTypes: ['SaaS', 'web_app'],
  niches: ['finance', 'productivity', 'e-commerce'],
  goals: ['build'],
  growthChannels: ['organic', 'viral', 'paid'],
  skillLevels: ['beginner', 'intermediate'],
  phaseTags: ['Discovery', 'Build'],
  dependencies: [],
  conflicts: [],
  successRate: 92,
  userRating: 4.8,
  completionRate: 87,
  createdAt: 1706425200000,
  updatedAt: 1706425200000,
  version: 1
};
```

#### User Input Schema
```typescript
interface ComposerInput {
  // User profile
  userId: string;
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  
  // Project details
  goal: 'build' | 'monetise' | 'automate' | 'grow' | 'optimise';
  assetType: string;  // SaaS, web app, mobile app, etc.
  niche: string;      // fitness, finance, etc.
  stage: 'idea' | 'MVP' | 'post_launch' | 'scaling';
  
  // Strategy
  growthChannel: 'organic' | 'viral' | 'paid' | 'partnerships' | 'hybrid';
  
  // Constraints
  timeHorizonWeeks: number;
  budgetLevel: 'low' | 'medium' | 'high';
  maxCredits: number;
  
  // Preferences
  preferredPackTypes: string[];  // e.g., ['MVP', 'Monetisation']
  excludePackIds: string[];
  prioritizeSpeed: boolean;
  prioritizeQuality: boolean;
  prioritizeCost: boolean;
}

// Example
const input: ComposerInput = {
  userId: 'user_123',
  skillLevel: 'intermediate',
  goal: 'build',
  assetType: 'SaaS',
  niche: 'fitness',
  stage: 'idea',
  growthChannel: 'organic',
  timeHorizonWeeks: 8,
  budgetLevel: 'medium',
  maxCredits: 5000,
  preferredPackTypes: ['MVP', 'Monetisation'],
  excludePackIds: [],
  prioritizeSpeed: true,
  prioritizeQuality: false,
  prioritizeCost: false
};
```

#### Composition Output
```typescript
interface ComposedSequence {
  // Identity
  sequenceId: string;
  userId: string;
  createdAt: timestamp;