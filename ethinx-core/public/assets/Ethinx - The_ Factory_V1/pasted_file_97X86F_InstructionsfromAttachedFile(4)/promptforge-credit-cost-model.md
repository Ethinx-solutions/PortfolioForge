# PromptForge Credit Cost Model & Visualization Integration
## Complete Execution Layer - Part 2

---

## SECTION 2: CREDIT COST MODEL

### 2.1 Credit Cost Per Operation

#### Single Prompt Execution
```
Base Cost Calculation:
- Small prompt (< 500 tokens): 5 credits
- Medium prompt (500-2000 tokens): 25 credits
- Large prompt (2000-5000 tokens): 50 credits
- Extra large prompt (> 5000 tokens): 100 credits

Model Multipliers:
- GPT-3.5 Turbo: 1.0x (base cost)
- GPT-4: 2.0x (base cost)
- GPT-4 Turbo: 2.5x (base cost)
- Claude 3 Opus: 1.5x (base cost)
- Claude 3 Sonnet: 1.2x (base cost)
- Claude 3 Haiku: 0.8x (base cost)

Temperature/Token Adjustments:
- Temperature 0.0-0.3: 1.0x (base cost)
- Temperature 0.3-0.7: 1.1x (base cost)
- Temperature 0.7-1.0: 1.2x (base cost)
- Max tokens 0-1000: 1.0x (base cost)
- Max tokens 1000-2000: 1.1x (base cost)
- Max tokens 2000+: 1.2x (base cost)

Final Cost Formula:
cost = base_cost × model_multiplier × temperature_adjustment × token_adjustment

Examples:
1. Small prompt, GPT-3.5, temp 0.5, tokens 500
   = 5 × 1.0 × 1.1 × 1.0 = 5.5 credits

2. Large prompt, GPT-4, temp 0.8, tokens 3000
   = 50 × 2.0 × 1.2 × 1.1 = 132 credits

3. Extra large prompt, Claude 3 Opus, temp 0.7, tokens 5000
   = 100 × 1.5 × 1.1 × 1.2 = 198 credits
```

#### Pack Execution
```
Multi-Prompt Pack Cost:
- Sum of individual prompt costs
- Dependency resolution: No additional cost
- Context carryover: No additional cost
- Parallel execution: No discount

Pack Execution Example:
Step 1: Small prompt, GPT-3.5 = 5 credits
Step 2: Medium prompt, GPT-4 = 50 credits
Step 3: Large prompt, GPT-4 = 100 credits
Step 4: Medium prompt, GPT-3.5 = 25 credits

Total Pack Cost = 5 + 50 + 100 + 25 = 180 credits

Bulk Execution Discount:
- 5+ packs in same month: 5% discount
- 10+ packs in same month: 10% discount
- 20+ packs in same month: 15% discount
```

#### Visualization Generation
```
Visualization Costs:

Basic Visualization (simple chart/diagram):
- DALL-E 3 (small): 25 credits
- DALL-E 3 (large): 50 credits
- Midjourney (standard): 30 credits
- Stable Diffusion: 15 credits

Advanced Visualization (complex diagram/mockup):
- DALL-E 3 (small): 50 credits
- DALL-E 3 (large): 100 credits
- Midjourney (pro): 60 credits
- Stable Diffusion (advanced): 35 credits

Custom Visualization (highly customized):
- DALL-E 3 (small): 75 credits
- DALL-E 3 (large): 150 credits
- Midjourney (premium): 100 credits
- Stable Diffusion (premium): 60 credits

Visualization Modifiers:
- High resolution: +50% cost
- Multiple variations: +25% per variation
- Revision/editing: +50% of original cost
- Rush delivery (< 1 minute): +100% cost

Examples:
1. Basic DALL-E 3 diagram
   = 25 credits

2. Advanced Midjourney mockup, high resolution
   = 60 × 1.5 = 90 credits

3. Custom Stable Diffusion with 3 variations
   = 60 × (1 + 0.25 × 2) = 90 credits
```

#### Visualization Editing
```
Editing Costs:

Minor edits (color, text, small changes):
- 10 credits per edit

Major edits (layout, structure, significant changes):
- 25 credits per edit

Complete redesign:
- 50 credits (same as original generation)

Batch edits (multiple visualizations):
- 5 credits per visualization (minimum)

Examples:
1. Change color scheme: 10 credits
2. Modify layout: 25 credits
3. Complete redesign: 50 credits
4. Batch edit 10 visualizations: 50 credits (5 × 10)
```

#### Context Variable Expansion
```
Context Variable Expansion Costs:

Simple expansion (< 100 characters):
- 0 credits (included in prompt execution)

Complex expansion (100-1000 characters):
- 2 credits per expansion

Very complex expansion (> 1000 characters):
- 5 credits per expansion

Batch expansion (multiple variables):
- 1 credit per variable (minimum)

Examples:
1. Expand "{{niche}}" to "fitness app for gym enthusiasts"
   = 0 credits (simple, included)

2. Expand "{{features}}" to detailed feature list (500 chars)
   = 2 credits

3. Expand "{{automationPlan}}" to detailed plan (2000 chars)
   = 5 credits

4. Expand 10 variables in pack
   = 10 credits (minimum)
```

#### API Calls
```
API Call Costs:

Free Tier:
- Included: 100 API calls/day
- Overage: 0.01 credits per call

Pro Tier:
- Included: 1,000 API calls/day
- Overage: 0.005 credits per call

Enterprise Tier:
- Included: Unlimited API calls
- Overage: 0 credits

Examples:
1. Free tier, 150 calls in day
   = 50 calls × 0.01 = 0.5 credits

2. Pro tier, 1,500 calls in day
   = 500 calls × 0.005 = 2.5 credits

3. Enterprise tier, unlimited calls
   = 0 credits
```

---

### 2.2 Tiered Pricing Model

#### Free Tier
```
Monthly Allocation:
- Credits: 100/month
- Resets: 1st of each month
- Rollover: No (unused credits expire)

Limitations:
- Max 10 pack executions/month
- Max 10 visualizations/month
- Max 5 saved executions
- No API access
- Community support only

Cost Breakdown:
- Signup: Free
- Monthly: $0
- Per-credit overage: Not allowed (soft limit)

Use Cases:
- Exploration and learning
- Small projects
- Testing the platform
```

#### Pro Tier
```
Monthly Allocation:
- Credits: 5,000/month
- Resets: On subscription renewal
- Rollover: No (unused credits expire)

Limitations:
- Unlimited pack executions
- Unlimited visualizations
- Unlimited saved executions
- API access: 1,000 calls/day
- Email support (24-hour response)

Cost Breakdown:
- Monthly: $99
- Annual: $990 (10% discount)
- Per-credit overage: $0.01/credit

Use Cases:
- Regular users
- Small businesses
- Content creators
- Freelancers
```

#### Enterprise Tier
```
Custom Allocation:
- Credits: Custom (starting 50,000/month)
- Resets: Custom billing cycle
- Rollover: Negotiable

Unlimited Features:
- Unlimited pack executions
- Unlimited visualizations
- Unlimited saved executions
- Unlimited API access
- Dedicated account manager
- Priority support (1-hour response)
- SSO/SAML
- Custom contracts
- SLA guarantees

Cost Breakdown:
- Monthly: Custom (starting $5,000)
- Annual: Custom (negotiable discount)
- Per-credit overage: Custom rate

Use Cases:
- Large organizations
- High-volume users
- Mission-critical applications
- Compliance requirements
```

---

### 2.3 Credit Replenishment Logic

#### Monthly Replenishment
```
Automatic Replenishment:
- Trigger: Subscription renewal date
- Amount: Monthly credit allocation
- Timing: Automatic at midnight UTC
- Notification: Email confirmation sent

Replenishment Process:
1. Check subscription status
2. Verify payment successful
3. Reset credit balance to monthly allocation
4. Log replenishment transaction
5. Send confirmation email

Example:
- Pro user, renewal date: 2024-02-15
- Monthly allocation: 5,000 credits
- On 2024-02-15 at 00:00 UTC:
  - Credits reset to 5,000
  - Previous month's unused credits expire
  - Replenishment logged
  - Email sent to user
```

#### Upgrade Replenishment
```
Upgrade Credit Bonus:
- Free → Pro: 1,000 bonus credits (one-time)
- Free → Enterprise: 5,000 bonus credits (one-time)
- Pro → Enterprise: 10,000 bonus credits (one-time)

Upgrade Process:
1. User selects new tier
2. Payment processed
3. Bonus credits added immediately
4. Monthly allocation set to new tier
5. Confirmation email sent

Example:
- User upgrades Free → Pro
- Free tier: 100 credits remaining
- Upgrade bonus: 1,000 credits
- New Pro allocation: 5,000 credits
- Total after upgrade: 100 + 1,000 + 5,000 = 6,100 credits
```

#### Referral Replenishment
```
Referral Bonus:
- Referrer: 100 credits per successful referral
- Referee: 50 credits (on first purchase)

Referral Process:
1. Referrer generates referral link
2. Referee signs up via link
3. Referee makes first purchase
4. Both receive bonus credits
5. Bonuses added immediately

Example:
- Referrer has 2,000 credits
- Refers 5 friends
- 3 friends make purchases
- Referrer receives: 3 × 100 = 300 bonus credits
- New total: 2,000 + 300 = 2,300 credits
```

---

### 2.4 Credit Overage Handling

#### Soft Limit (Free Tier)
```
Soft Limit Behavior:
- User cannot execute packs when credits insufficient
- Error message: "Insufficient credits"
- Suggestion: "Upgrade to Pro for 5,000 monthly credits"
- No partial execution allowed

Example:
- Free user has 20 credits
- Wants to execute 50-credit pack
- Execution blocked
- Suggestion to upgrade shown
```

#### Hard Limit (Pro Tier)
```
Hard Limit Behavior:
- User cannot execute packs when credits insufficient
- Error message: "Insufficient credits"
- Suggestion: "Purchase additional credits"
- No partial execution allowed

Grace Period:
- None (hard limit enforced immediately)

Overage Purchase:
- User can purchase additional credits
- Price: $0.01 per credit
- Minimum purchase: 1,000 credits ($10)
- Purchased credits expire: End of billing month

Example:
- Pro user has 500 credits
- Wants to execute 1,000-credit pack
- Execution blocked
- Can purchase 1,000 credits for $10
- After purchase: 1,500 credits available
```

#### Grace Period (Enterprise)
```
Grace Period Behavior:
- Custom grace period (typically 7 days)
- User can execute packs over limit
- Overage tracked and billed
- Warning notifications sent

Overage Billing:
- Calculated at end of grace period
- Billed at custom rate (typically $0.01-0.05 per credit)
- Added to next invoice

Example:
- Enterprise user has 50,000 credits
- Executes 60,000 credits worth of packs
- Overage: 10,000 credits
- Grace period: 7 days
- After 7 days: Billed for 10,000 credits at custom rate
```

---

### 2.5 Refund Logic

#### Execution Failure Refund
```
Automatic Refund Conditions:
- Execution failed (error occurred)
- Execution timeout (> 30 seconds)
- API error (500+)
- User cancellation (before completion)

Refund Process:
1. Detect failure condition
2. Identify reserved credits
3. Refund immediately
4. Log refund transaction
5. Notify user

Example:
- User executes 100-credit pack
- Pack fails at step 3 (API error)
- 75 credits already consumed
- Refund: 100 - 75 = 25 credits
- User receives 25 credits back
```

#### User-Initiated Refund
```
Refund Eligibility:
- Within 14 days of purchase
- Unused credits only
- Valid reason required

Refund Reasons:
- Accidental purchase
- Service issue
- Changed mind
- Technical problem

Refund Process:
1. User submits refund request
2. Support team verifies eligibility
3. Refund amount calculated
4. Refund processed
5. Confirmation email sent

Example:
- User purchased 1,000 credits for $10
- Used 200 credits
- Requests refund within 14 days
- Refund eligible: 800 unused credits
- Refund amount: $8 (800 × $0.01)
- Refund processed to original payment method
```

#### Subscription Cancellation Refund
```
Refund Eligibility:
- Within 30 days of subscription start
- Pro tier only (Free tier non-refundable)
- Valid reason required

Refund Amount:
- Prorated refund based on days used
- Unused credits: Refunded at $0.01 per credit

Example:
- User subscribes to Pro ($99/month)
- Uses 10 days of 30-day month
- Unused days: 20 days
- Prorated refund: $99 × (20/30) = $66
- Unused credits: 4,000 credits
- Credit refund: 4,000 × $0.01 = $40
- Total refund: $66 + $40 = $106
```

---

### 2.6 Abuse Prevention

#### Usage Monitoring
```
Monitored Metrics:
- Daily execution count
- Hourly execution count
- Credits consumed per day
- Unique prompts executed
- Unique packs executed
- API call rate

Anomaly Detection:
- Execution count > 10x average
- Credits consumed > 10x average
- Unusual execution patterns
- Rapid pack switching
- High API call rate

Actions:
- Alert: Send warning email
- Review: Manual review by support
- Suspend: Temporary account suspension
- Block: Permanent account block
```

#### Rate Limiting
```
Free Tier Rate Limits:
- 10 executions/minute
- 100 executions/day
- 5 API calls/minute
- 100 API calls/day

Pro Tier Rate Limits:
- 60 executions/minute
- 1,000 executions/day
- 30 API calls/minute
- 1,000 API calls/day

Enterprise Tier Rate Limits:
- Custom (typically 1,000+ executions/minute)
- Custom API call limits

Enforcement:
- Return 429 (Too Many Requests) on limit exceeded
- Include Retry-After header
- Log rate limit violations
```

#### Fraud Detection
```
Fraud Indicators:
- Multiple signups from same IP
- Multiple payment methods from same IP
- Rapid subscription changes
- Unusual geographic activity
- Device fingerprint anomalies

Actions:
- Flag: Manual review
- Warn: Send security email
- Block: Require verification
- Suspend: Temporary account suspension
```

---

### 2.7 Credit Usage Dashboard UX

#### Dashboard Components
```
Credit Balance Widget:
- Current balance: 3,500 credits
- Monthly allocation: 5,000 credits
- Usage this month: 1,500 credits (30%)
- Days remaining: 14 days
- Estimated daily burn: 107 credits/day
- Projected balance at end of month: 1,000 credits

Usage Breakdown:
- Pack executions: 1,200 credits (80%)
- Visualizations: 250 credits (17%)
- API calls: 50 credits (3%)

Spending Trend Chart:
- X-axis: Days of month
- Y-axis: Credits used
- Line chart showing cumulative usage
- Comparison to previous month

Upcoming Charges:
- Next billing date: 2024-02-15
- Estimated charge: $99 (Pro renewal)
- Bonus credits: None
- Overage charges: $0
```

#### Credit Purchase UI
```
Purchase Credits:
- 1,000 credits: $10
- 5,000 credits: $45 (10% discount)
- 10,000 credits: $80 (20% discount)
- 50,000 credits: $350 (30% discount)

Purchase Process:
1. Select credit package
2. Review pricing
3. Select payment method
4. Confirm purchase
5. Credits added immediately
6. Confirmation email sent

Purchase History:
- Date purchased
- Amount purchased
- Price paid
- Expiration date
- Status (active/expired)
```

#### Usage History
```
Execution History:
- Execution date/time
- Pack/prompt name
- Credits used
- Execution time
- Status (success/failed)
- Output preview

Visualization History:
- Generation date/time
- Visualization type
- Credits used
- Image preview
- Status (success/failed)

API Call History:
- Call date/time
- Endpoint
- Response status
- Credits used (if applicable)
- Request/response size

Filters:
- Date range
- Type (execution/visualization/api)
- Status (success/failed)
- Credit range
```

---

### 2.8 API Endpoints for Credit Management

#### Check Credit Balance
```
GET /credits/balance
Authorization: Bearer {token}

Response (200):
{
  "userId": "user_123",
  "currentBalance": 3500,
  "monthlyAllocation": 5000,
  "usedThisMonth": 1500,
  "percentageUsed": 30,
  "daysRemaining": 14,
  "estimatedDailyBurn": 107,
  "projectedBalance": 1000,
  "tier": "pro",
  "nextResetDate": "2024-02-15T00:00:00Z"
}
```

#### Consume Credits
```
POST /credits/consume
Content-Type: application/json
Authorization: Bearer {token}

Request:
{
  "executionId": "exec_123",
  "amount": 116,
  "reason": "pack_execution",
  "metadata": {
    "packId": "pack_456",
    "model": "gpt-4"
  }
}

Response (200):
{
  "transactionId": "txn_789",
  "userId": "user_123",
  "amount": 116,
  "newBalance": 3384,
  "timestamp": "2024-01-28T10:30:00Z",
  "status": "confirmed"
}

Error Response (402):
{
  "error": {
    "code": "INSUFFICIENT_CREDITS",
    "message": "Insufficient credits: 116 required, 50 available"
  }
}
```

#### Replenish Credits
```
POST /credits/replenish
Content-Type: application/json
Authorization: Bearer {token}

Request:
{
  "amount": 5000,
  "reason": "subscription_renewal",
  "metadata": {
    "subscriptionId": "sub_123",
    "billingCycle": "2024-01-15 to 2024-02-15"
  }
}

Response (200):
{
  "transactionId": "txn_790",
  "userId": "user_123",
  "amount": 5000,
  "newBalance": 8384,
  "timestamp": "2024-02-15T00:00:00Z",
  "status": "confirmed"
}
```

#### View Credit History
```
GET /credits/history?limit=50&offset=0
Authorization: Bearer {token}

Response (200):
{
  "transactions": [
    {
      "transactionId": "txn_789",
      "type": "debit",
      "amount": 116,
      "reason": "pack_execution",
      "balance": 3384,
      "timestamp": "2024-01-28T10:30:00Z",
      "metadata": { "packId": "pack_456" }
    },
    {
      "transactionId": "txn_788",
      "type": "debit",
      "amount": 50,
      "reason": "visualization_generation",
      "balance": 3500,
      "timestamp": "2024-01-28T10:25:00Z",
      "metadata": { "visualizationType": "diagram" }
    },
    {
      "transactionId": "txn_787",
      "type": "credit",
      "amount": 100,
      "reason": "referral_bonus",
      "balance": 3550,
      "timestamp": "2024-01-27T15:00:00Z",
      "metadata": { "referrerId": "user_456" }
    }
  ],
  "total": 3,
  "limit": 50,
  "offset": 0
}
```

#### Purchase Credits
```
POST /credits/purchase
Content-Type: application/json
Authorization: Bearer {token}

Request:
{
  "package": "5000_credits",
  "paymentMethodId": "pm_123",
  "promoCode": "SAVE20"
}

Response (200):
{
  "purchaseId": "purch_123",
  "userId": "user_123",
  "creditsAdded": 5000,
  "pricePerCredit": 0.009,
  "totalPrice": 45,
  "discount": 5,
  "finalPrice": 40,
  "newBalance": 8384,
  "expirationDate": "2024-02-28T23:59:59Z",
  "timestamp": "2024-01-28T10:35:00Z",
  "status": "completed"
}
```

---

## SECTION 3: VISUALIZATION INTEGRATION

### 3.1 Visualization Prompt Triggering

#### Automatic Triggers
```typescript
interface VisualizationTrigger {
  triggerId: string;
  stepId: string;
  triggerEvent: 'on_completion' | 'on_error' | 'on_timeout';
  condition: string;  // JavaScript expression
  visualizationType: string;
  autoGenerate: boolean;
  requiresApproval: boolean;
}

// Trigger on step completion
if (stepResult.status === 'completed') {
  const triggers = pack.visualizationTriggers.filter(
    t => t.stepId === currentStep.stepId && 
         t.triggerEvent === 'on_completion'
  );
  
  for (const trigger of triggers) {
    // Evaluate condition
    if (evaluateCondition(trigger.condition, stepResult)) {
      if (trigger.autoGenerate) {
        // Auto-generate visualization
        await generateVisualization(trigger, stepResult);
      } else if (trigger.requiresApproval) {
        // Send notification for approval
        await notifyUserForApproval(trigger, stepResult);
      }
    }
  }
}

// Trigger on error
if (stepResult.status === 'failed') {
  const triggers = pack.visualizationTriggers.filter(
    t => t.stepId === currentStep.stepId && 
         t.triggerEvent === 'on_error'
  );
  
  for (const trigger of triggers) {
    // Generate error visualization
    await generateErrorVisualization(trigger, stepResult);
  }
}
```

#### Manual Triggers
```
POST /executions/:executionId/visualizations/generate
Content-Type: application/json
Authorization: Bearer {token}

Request:
{
  "triggerId": "trigger_123",
  "stepId": "step_456",
  "visualizationType": "diagram",
  "customPrompt": "Optional custom prompt override"
}

Response (202 - Accepted):
{
  "jobId": "job_789",
  "status": "queued",
  "estimatedTime": 5000,
  "creditCost": 50,
  "queuePosition": 1
}
```

---

### 3.2 Credit Consumption for Generation/Editing

#### Generation Credit Flow
```
1. User requests visualization
2. Calculate credit cost based on:
   - Visualization type
   - Complexity level
   - Resolution/quality
   - Rush delivery (if applicable)
3. Check user has sufficient credits
4. Reserve credits
5. Queue visualization generation
6. Generate visualization
7. Confirm credit deduction
8. Return visualization

Example:
- Visualization type: Advanced diagram
- Base cost: 50 credits
- High resolution: +50% = 75 credits
- Total: 75 credits
- User has 200 credits
- 75 credits reserved
- Visualization generated
- 75 credits confirmed deducted
- New balance: 125 credits
```

#### Editing Credit Flow
```
1. User requests visualization edit
2. Calculate credit cost based on:
   - Edit type (minor/major/redesign)
   - Number of edits
   - Batch editing discount
3. Check user has sufficient credits
4. Reserve credits
5. Queue visualization edit
6. Edit visualization
7. Confirm credit deduction
8. Return edited visualization

Example:
- Edit type: Major edit (layout change)
- Base cost: 25 credits
- User has 100 credits
- 25 credits reserved
- Visualization edited
- 25 credits confirmed deducted
- New balance: 75 credits
```

---

### 3.3 Visualization Preview Delivery

#### Preview Generation
```
GET /visualizations/:jobId/preview
Authorization: Bearer {token}

Response (200):
{
  "jobId": "job_789",
  "status": "completed",
  "visualizationType": "diagram",
  "previewUrl": "https://cdn.promptforge.com/previews/job_789_preview.jpg",
  "fullImageUrl": "https://cdn.promptforge.com/visualizations/job_789_full.png",
  "thumbnailUrl": "https://cdn.promptforge.com/visualizations/job_789_thumb.jpg",
  "creditsUsed": 50,
  "generatedAt": "2024-01-28T10:35:00Z",
  "expiresAt": "2024-02-28T10:35:00Z"
}
```

#### Preview Caching
```
Cache Strategy:
- Preview cached for 30 days
- CDN distribution (CloudFront)
- Multiple resolutions:
  - Thumbnail: 200x200px
  - Preview: 600x600px
  - Full: 2000x2000px
- Automatic cleanup after expiration
```

---

### 3.4 Visualization History Storage

#### History Tracking
```typescript
interface VisualizationHistory {
  historyId: string;
  executionId: string;
  userId: string;
  jobId: string;
  visualizationType: string;
  
  // Generation details
  prompt: string;
  model: string;
  creditsUsed: number;
  generatedAt: timestamp;
  
  // Image details
  imageUrl: string;
  imageSize: number;
  imageFormat: string;
  
  // Metadata
  title: string;
  description: string;
  tags: string[];
  starred: boolean;
  
  // Sharing
  sharedWith: string[];
  isPublic: boolean;
  publicUrl: string;
}

class VisualizationHistoryManager {
  async saveVisualization(
    executionId: string,
    jobId: string,
    title: string,
    tags: string[]
  ): Promise<VisualizationHistory> {
    const job = await db.visualizationJobs.findById(jobId);
    
    const entry: VisualizationHistory = {
      historyId: generateId(),
      executionId,
      userId: job.userId,
      jobId,
      visualizationType: job.visualizationType,
      prompt: job.prompt,
      model: job.model,
      creditsUsed: job.creditsUsed,
      generatedAt: job.completedAt,
      imageUrl: job.imageUrl,
      imageSize: job.imageSize,
      imageFormat: job.imageFormat,
      title,
      description: '',
      tags,
      starred: false,
      sharedWith: [],
      isPublic: false,
      publicUrl: null
    };
    
    await db.visualizationHistory.create(entry);
    return entry;
  }
}
```

---

### 3.5 Visualization Output Sync Across Devices

#### Cross-Device Sync
```typescript
class VisualizationSyncManager {
  async syncVisualization(
    userId: string,
    visualizationId: string,
    sourceDeviceId: string
  ): Promise<void> {
    // Get visualization details
    const visualization = await db.visualizations.findById(visualizationId);
    
    // Create sync event
    const syncEvent = {
      eventId: generateId(),
      userId,
      eventType: 'visualization_created',
      deviceId: sourceDeviceId,
      timestamp: Date.now(),
      data: {
        visualizationId,
        imageUrl: visualization.imageUrl,
        jobId: visualization.jobId,
        creditsUsed: visualization.creditsUsed
      }
    };
    
    // Publish to message queue
    await messageQueue.publish('sync.visualizations', syncEvent);
    
    // Notify all user devices
    const userDevices = await db.devices.findByUserId(userId);
    
    for (const device of userDevices) {
      if (device.deviceId !== sourceDeviceId) {
        // Send push notification
        await pushNotificationService.send(device.deviceId, {
          title: 'Visualization Synced',
          body: 'A new visualization has been synced',
          data: syncEvent.data
        });
      }
    }
  }
  
  async downloadVisualization(
    userId: string,
    visualizationId: string,
    deviceId: string
  ): Promise<void> {
    const visualization = await db.visualizations.findById(visualizationId);
    
    // Download image to device storage
    const localPath = await downloadToDevice(
      visualization.imageUrl,
      deviceId
    );
    
    // Create sync event
    const syncEvent = {
      eventId: generateId(),
      userId,
      eventType: 'visualization_downloaded',
      deviceId,
      timestamp: Date.now(),
      data: {
        visualizationId,
        localPath
      }
    };
    
    // Publish to message queue
    await messageQueue.publish('sync.visualizations', syncEvent);
  }
}
```

This completes the Credit Cost Model and Visualization Integration sections. The final sections will cover architecture diagrams, comprehensive API specifications, and QA checks.

