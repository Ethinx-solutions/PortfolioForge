# PromptForge Pack Execution Engine & Credit Cost Model
## Complete Execution Layer Specification

---

## SECTION 1: PACK EXECUTION ENGINE

### 1.1 Execution Logic: Single Prompts vs Multi-Prompt Packs

#### Single Prompt Execution
```typescript
interface SinglePromptExecution {
  executionId: string;
  promptId: string;
  userId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  
  // Input
  inputVariables: Record<string, any>;
  model: string;
  temperature: number;
  maxTokens: number;
  
  // Output
  output: string;
  creditsUsed: number;
  executionTime: number;
  
  // Metadata
  createdAt: timestamp;
  completedAt: timestamp;
}

Execution Flow:
1. Validate input variables
2. Check credit balance
3. Reserve credits
4. Call LLM API
5. Store output
6. Deduct credits
7. Log execution
8. Return result
```

#### Multi-Prompt Pack Execution
```typescript
interface MultiPromptPackExecution {
  executionId: string;
  packId: string;
  userId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  
  // Pack details
  promptSequence: PromptStep[];
  totalSteps: number;
  currentStep: number;
  
  // Execution tracking
  stepResults: Record<string, StepResult>;
  contextCarryover: Record<string, any>;
  
  // Credits
  totalCreditsUsed: number;
  creditsPerStep: number[];
  
  // Metadata
  createdAt: timestamp;
  completedAt: timestamp;
}

interface PromptStep {
  stepId: string;
  promptId: string;
  inputTemplate: string;
  outputKey: string;
  dependsOn: string[];  // Previous steps
  model: string;
  temperature: number;
  maxTokens: number;
}

Execution Flow:
1. Validate pack structure
2. Calculate total credits needed
3. Check credit balance
4. Reserve credits
5. For each step:
   a. Resolve dependencies
   b. Inject context variables
   c. Call LLM API
   d. Store step result
   e. Update context carryover
6. Aggregate results
7. Deduct total credits
8. Log execution
9. Return final result
```

---

### 1.2 Prompt Sequencing Rules

#### Dependency Resolution
```
Pack Structure:
Step 1: Generate MVP idea
  - Input: niche, productType
  - Output: mvpIdea

Step 2: Create monetisation strategy (depends on Step 1)
  - Input: mvpIdea (from Step 1)
  - Output: monetisationStrategy

Step 3: Build automation plan (depends on Steps 1 & 2)
  - Input: mvpIdea (from Step 1), monetisationStrategy (from Step 2)
  - Output: automationPlan

Step 4: Create launch roadmap (depends on Steps 1, 2, 3)
  - Input: mvpIdea, monetisationStrategy, automationPlan
  - Output: launchRoadmap

Execution Order:
1. Execute Step 1 (no dependencies)
2. Execute Step 2 (depends on Step 1 - wait for completion)
3. Execute Steps 3 & 4 in parallel (both dependencies satisfied)
4. Aggregate results
```

#### Sequencing Algorithm
```typescript
function resolveExecutionOrder(pack: Pack): PromptStep[][] {
  const steps = pack.promptSequence;
  const executed = new Set<string>();
  const batches: PromptStep[][] = [];
  
  while (executed.size < steps.length) {
    const batch: PromptStep[] = [];
    
    for (const step of steps) {
      if (executed.has(step.stepId)) continue;
      
      // Check if all dependencies are satisfied
      const depsMetisEmpty = step.dependsOn.every(dep => 
        executed.has(dep)
      );
      
      if (depsMetisEmpty) {
        batch.push(step);
        executed.add(step.stepId);
      }
    }
    
    if (batch.length === 0) {
      throw new Error('Circular dependency detected');
    }
    
    batches.push(batch);
  }
  
  return batches;
}

// Execution
const batches = resolveExecutionOrder(pack);
for (const batch of batches) {
  // Execute all steps in batch in parallel
  const results = await Promise.all(
    batch.map(step => executeStep(step, context))
  );
  
  // Update context with results
  for (const result of results) {
    context[result.outputKey] = result.output;
  }
}
```

---

### 1.3 Context Variable Injection

#### Variable Resolution
```typescript
interface ContextVariable {
  name: string;
  value: any;
  source: 'user_input' | 'step_output' | 'system' | 'cache';
  timestamp: number;
}

interface ContextInjection {
  template: string;
  variables: Record<string, any>;
  resolvedPrompt: string;
}

function injectContextVariables(
  template: string,
  context: Record<string, any>
): string {
  // Replace {{variable}} with actual values
  return template.replace(/\{\{(\w+)\}\}/g, (match, varName) => {
    if (!(varName in context)) {
      throw new Error(`Missing context variable: ${varName}`);
    }
    
    const value = context[varName];
    
    // Type-specific formatting
    if (typeof value === 'object') {
      return JSON.stringify(value, null, 2);
    }
    
    return String(value);
  });
}

// Example
const template = `
Create a {{productType}} for the {{niche}} niche.
Target audience: {{targetAudience}}
Key features: {{features}}
`;

const context = {
  productType: 'mobile app',
  niche: 'fitness',
  targetAudience: 'gym enthusiasts',
  features: ['workout tracking', 'social features', 'AI coaching']
};

const resolvedPrompt = injectContextVariables(template, context);
// Result:
// Create a mobile app for the fitness niche.
// Target audience: gym enthusiasts
// Key features: ["workout tracking", "social features", "AI coaching"]
```

#### Variable Types
```
User-Provided Variables:
- niche: string
- productType: string
- targetAudience: string
- features: string[]
- monetisationModel: string

Step Output Variables:
- mvpIdea: string (from Step 1)
- monetisationStrategy: string (from Step 2)
- automationPlan: string (from Step 3)

System Variables:
- userId: string
- timestamp: number
- executionId: string
- packId: string

Cached Variables:
- previousResults: Record<string, any>
- userPreferences: Record<string, any>
```

---

### 1.4 Visualisation Hook Triggering

#### Automatic Visualization Triggers
```typescript
interface VisualisationHook {
  hookId: string;
  stepId: string;
  triggerCondition: 'on_completion' | 'on_error' | 'manual';
  visualisationType: 'chart' | 'diagram' | 'mockup' | 'wireframe';
  promptTemplate: string;
  creditCost: number;
}

// Trigger on step completion
if (stepResult.status === 'completed') {
  const hooks = pack.visualisationHooks.filter(
    h => h.stepId === currentStep.stepId && 
         h.triggerCondition === 'on_completion'
  );
  
  for (const hook of hooks) {
    // Check if user has sufficient credits
    if (userCredits >= hook.creditCost) {
      // Trigger visualization generation
      await triggerVisualization(hook, stepResult);
    }
  }
}

// Manual trigger
POST /executions/:executionId/visualizations
{
  "hookId": "hook_123",
  "stepId": "step_456"
}
```

#### Visualization Prompt Generation
```typescript
function generateVisualizationPrompt(
  hook: VisualisationHook,
  stepOutput: string,
  context: Record<string, any>
): string {
  // Inject step output and context into visualization prompt template
  let prompt = hook.promptTemplate;
  
  // Replace {{output}} with step output
  prompt = prompt.replace('{{output}}', stepOutput);
  
  // Replace {{variable}} with context variables
  prompt = injectContextVariables(prompt, context);
  
  return prompt;
}

// Example
const hook: VisualisationHook = {
  hookId: 'hook_123',
  stepId: 'step_1',
  triggerCondition: 'on_completion',
  visualisationType: 'diagram',
  promptTemplate: `
    Create a system architecture diagram for:
    {{output}}
    
    Style: {{visualizationStyle}}
    Format: {{visualizationFormat}}
  `,
  creditCost: 50
};

const prompt = generateVisualizationPrompt(
  hook,
  'MVP idea: AI-powered fitness app with real-time coaching',
  { visualizationStyle: 'modern', visualizationFormat: 'svg' }
);
```

---

### 1.5 Credit Consumption Tracking

#### Real-Time Credit Tracking
```typescript
interface CreditTransaction {
  transactionId: string;
  userId: string;
  executionId: string;
  type: 'debit' | 'credit';
  amount: number;
  reason: string;
  timestamp: number;
  status: 'pending' | 'confirmed' | 'failed';
}

class CreditTracker {
  private transactions: CreditTransaction[] = [];
  private reservedCredits: number = 0;
  
  // Reserve credits before execution
  async reserveCredits(
    userId: string,
    amount: number,
    executionId: string
  ): Promise<boolean> {
    const balance = await this.getBalance(userId);
    
    if (balance < amount) {
      return false;
    }
    
    this.reservedCredits += amount;
    
    const transaction: CreditTransaction = {
      transactionId: generateId(),
      userId,
      executionId,
      type: 'debit',
      amount,
      reason: 'execution_reserved',
      timestamp: Date.now(),
      status: 'pending'
    };
    
    this.transactions.push(transaction);
    return true;
  }
  
  // Confirm credit deduction after successful execution
  async confirmCredits(
    userId: string,
    executionId: string,
    actualAmount: number
  ): Promise<void> {
    const transaction = this.transactions.find(
      t => t.executionId === executionId && t.status === 'pending'
    );
    
    if (!transaction) {
      throw new Error('Transaction not found');
    }
    
    // Refund difference if actual < reserved
    if (actualAmount < transaction.amount) {
      const refundAmount = transaction.amount - actualAmount;
      await this.refundCredits(userId, refundAmount, executionId);
    }
    
    transaction.status = 'confirmed';
    transaction.amount = actualAmount;
    
    // Update database
    await db.creditTransactions.create(transaction);
  }
  
  // Refund credits on failure
  async refundCredits(
    userId: string,
    amount: number,
    executionId: string
  ): Promise<void> {
    const transaction: CreditTransaction = {
      transactionId: generateId(),
      userId,
      executionId,
      type: 'credit',
      amount,
      reason: 'execution_refund',
      timestamp: Date.now(),
      status: 'confirmed'
    };
    
    this.transactions.push(transaction);
    await db.creditTransactions.create(transaction);
  }
  
  // Get current balance
  async getBalance(userId: string): Promise<number> {
    const subscription = await db.subscriptions.findByUserId(userId);
    const monthlyCredits = getMonthlyCredits(subscription.plan);
    
    const usedThisMonth = await db.creditTransactions.sumByMonth(
      userId,
      'debit'
    );
    
    return monthlyCredits - usedThisMonth;
  }
}
```

---

### 1.6 Execution State Management

#### State Machine
```
Execution States:
pending → running → completed
         → failed
         → canceled

State Transitions:
pending → running: Execution starts
running → completed: All steps successful
running → failed: Error occurs
running → canceled: User cancels
pending → canceled: User cancels before start

State Persistence:
- Store state in database
- Update on each transition
- Log state changes
- Enable recovery from failures
```

#### State Store
```typescript
interface ExecutionState {
  executionId: string;
  userId: string;
  packId: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'canceled';
  
  // Progress tracking
  totalSteps: number;
  completedSteps: number;
  currentStep: number;
  
  // Results
  stepResults: Record<string, any>;
  finalOutput: string;
  
  // Error tracking
  error: string | null;
  errorStep: string | null;
  
  // Timing
  startedAt: timestamp;
  completedAt: timestamp;
  
  // Credits
  creditsReserved: number;
  creditsUsed: number;
}

class ExecutionStateManager {
  async updateState(
    executionId: string,
    updates: Partial<ExecutionState>
  ): Promise<void> {
    const state = await db.executionStates.findById(executionId);
    
    // Validate state transition
    if (!isValidTransition(state.status, updates.status)) {
      throw new Error('Invalid state transition');
    }
    
    // Update state
    const newState = { ...state, ...updates };
    await db.executionStates.update(executionId, newState);
    
    // Publish event for real-time updates
    await eventBus.publish('execution.state_changed', {
      executionId,
      oldStatus: state.status,
      newStatus: updates.status,
      timestamp: Date.now()
    });
  }
  
  async getState(executionId: string): Promise<ExecutionState> {
    return db.executionStates.findById(executionId);
  }
}
```

---

### 1.7 Retry Logic

#### Automatic Retries
```typescript
interface RetryPolicy {
  maxRetries: number;
  backoffMultiplier: number;
  initialDelayMs: number;
  maxDelayMs: number;
  retryableErrors: string[];
}

const DEFAULT_RETRY_POLICY: RetryPolicy = {
  maxRetries: 3,
  backoffMultiplier: 2,
  initialDelayMs: 1000,
  maxDelayMs: 30000,
  retryableErrors: [
    'RATE_LIMIT_ERROR',
    'TIMEOUT_ERROR',
    'TEMPORARY_ERROR',
    'SERVICE_UNAVAILABLE'
  ]
};

async function executeWithRetry(
  fn: () => Promise<any>,
  policy: RetryPolicy = DEFAULT_RETRY_POLICY
): Promise<any> {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt <= policy.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // Check if error is retryable
      if (!policy.retryableErrors.includes(error.code)) {
        throw error;
      }
      
      // Calculate backoff delay
      if (attempt < policy.maxRetries) {
        const delay = Math.min(
          policy.initialDelayMs * Math.pow(policy.backoffMultiplier, attempt),
          policy.maxDelayMs
        );
        
        await sleep(delay);
      }
    }
  }
  
  throw lastError;
}

// Usage
const result = await executeWithRetry(async () => {
  return await callLLMAPI(prompt);
});
```

---

### 1.8 Error Handling

#### Error Types
```typescript
class PromptForgeError extends Error {
  constructor(
    public code: string,
    public message: string,
    public statusCode: number,
    public details?: Record<string, any>
  ) {
    super(message);
  }
}

class InsufficientCreditsError extends PromptForgeError {
  constructor(required: number, available: number) {
    super(
      'INSUFFICIENT_CREDITS',
      `Insufficient credits: ${required} required, ${available} available`,
      402,
      { required, available }
    );
  }
}

class InvalidInputError extends PromptForgeError {
  constructor(field: string, reason: string) {
    super(
      'INVALID_INPUT',
      `Invalid input for field "${field}": ${reason}`,
      400,
      { field, reason }
    );
  }
}

class ExecutionTimeoutError extends PromptForgeError {
  constructor(stepId: string, timeoutMs: number) {
    super(
      'EXECUTION_TIMEOUT',
      `Execution timeout for step "${stepId}" after ${timeoutMs}ms`,
      504,
      { stepId, timeoutMs }
    );
  }
}

class PackNotFoundError extends PromptForgeError {
  constructor(packId: string) {
    super(
      'PACK_NOT_FOUND',
      `Pack "${packId}" not found`,
      404,
      { packId }
    );
  }
}
```

#### Error Handling Strategy
```typescript
async function executePackSafely(
  packId: string,
  userId: string,
  inputVariables: Record<string, any>
): Promise<ExecutionResult> {
  const execution = await db.executions.create({
    packId,
    userId,
    status: 'pending'
  });
  
  try {
    // Validate inputs
    const pack = await validatePack(packId);
    validateInputVariables(inputVariables, pack);
    
    // Check credits
    const creditsNeeded = calculateCreditsNeeded(pack, inputVariables);
    const balance = await creditTracker.getBalance(userId);
    
    if (balance < creditsNeeded) {
      throw new InsufficientCreditsError(creditsNeeded, balance);
    }
    
    // Reserve credits
    await creditTracker.reserveCredits(userId, creditsNeeded, execution.id);
    
    // Update state
    await stateManager.updateState(execution.id, { status: 'running' });
    
    // Execute pack
    const result = await executePack(pack, inputVariables);
    
    // Confirm credits
    await creditTracker.confirmCredits(userId, execution.id, result.creditsUsed);
    
    // Update state
    await stateManager.updateState(execution.id, {
      status: 'completed',
      finalOutput: result.output,
      creditsUsed: result.creditsUsed
    });
    
    return result;
    
  } catch (error) {
    // Refund reserved credits
    if (error instanceof InsufficientCreditsError) {
      await creditTracker.refundCredits(userId, creditsNeeded, execution.id);
    }
    
    // Update state
    await stateManager.updateState(execution.id, {
      status: 'failed',
      error: error.message,
      errorStep: error.stepId
    });
    
    // Log error
    logger.error('Pack execution failed', {
      executionId: execution.id,
      packId,
      userId,
      error: error.message
    });
    
    throw error;
  }
}
```

---

### 1.9 Output Formatting Rules

#### Output Format Templates
```typescript
interface OutputFormat {
  formatType: 'markdown' | 'json' | 'html' | 'plain_text';
  template: string;
  sections: OutputSection[];
}

interface OutputSection {
  sectionId: string;
  title: string;
  content: string;
  type: 'text' | 'list' | 'table' | 'code' | 'quote';
}

// Markdown Format
const markdownFormat: OutputFormat = {
  formatType: 'markdown',
  template: `
# {{title}}

## Overview
{{overview}}

## Key Points
{{keyPoints}}

## Implementation
{{implementation}}

## Next Steps
{{nextSteps}}
  `,
  sections: [
    { sectionId: 'title', title: 'Title', content: '', type: 'text' },
    { sectionId: 'overview', title: 'Overview', content: '', type: 'text' },
    { sectionId: 'keyPoints', title: 'Key Points', content: '', type: 'list' },
    { sectionId: 'implementation', title: 'Implementation', content: '', type: 'code' },
    { sectionId: 'nextSteps', title: 'Next Steps', content: '', type: 'list' }
  ]
};

// JSON Format
const jsonFormat: OutputFormat = {
  formatType: 'json',
  template: `
{
  "title": "{{title}}",
  "overview": "{{overview}}",
  "keyPoints": {{keyPoints}},
  "implementation": {{implementation}},
  "nextSteps": {{nextSteps}}
}
  `,
  sections: []
};

function formatOutput(
  output: string,
  format: OutputFormat
): string {
  // Parse output into sections
  const sections = parseOutputSections(output);
  
  // Format according to template
  let formatted = format.template;
  
  for (const section of sections) {
    formatted = formatted.replace(
      `{{${section.sectionId}}}`,
      formatSection(section)
    );
  }
  
  return formatted;
}
```

---

### 1.10 Device Sync Logic

#### Cross-Device Synchronization
```typescript
interface SyncEvent {
  eventId: string;
  userId: string;
  eventType: 'execution_completed' | 'execution_saved' | 'visualization_created';
  deviceId: string;
  timestamp: number;
  data: Record<string, any>;
}

class DeviceSyncManager {
  async syncExecution(
    userId: string,
    executionId: string,
    sourceDeviceId: string
  ): Promise<void> {
    // Get execution details
    const execution = await db.executions.findById(executionId);
    
    // Create sync event
    const syncEvent: SyncEvent = {
      eventId: generateId(),
      userId,
      eventType: 'execution_completed',
      deviceId: sourceDeviceId,
      timestamp: Date.now(),
      data: {
        executionId,
        packId: execution.packId,
        output: execution.output,
        creditsUsed: execution.creditsUsed
      }
    };
    
    // Publish to message queue
    await messageQueue.publish('sync.events', syncEvent);
    
    // Notify all user devices
    const userDevices = await db.devices.findByUserId(userId);
    
    for (const device of userDevices) {
      if (device.deviceId !== sourceDeviceId) {
        // Send push notification
        await pushNotificationService.send(device.deviceId, {
          title: 'Execution Synced',
          body: 'Your execution has been synced to this device',
          data: syncEvent.data
        });
      }
    }
  }
  
  async resolveConflict(
    userId: string,
    executionId: string,
    localVersion: ExecutionState,
    remoteVersion: ExecutionState
  ): Promise<ExecutionState> {
    // Last-write-wins strategy
    if (localVersion.updatedAt > remoteVersion.updatedAt) {
      return localVersion;
    }
    
    return remoteVersion;
  }
}
```

---

### 1.11 Offline Execution Fallback

#### Offline Mode
```typescript
class OfflineExecutionManager {
  // Queue executions when offline
  async queueExecution(
    execution: ExecutionRequest
  ): Promise<string> {
    const queuedExecution = {
      id: generateId(),
      ...execution,
      status: 'queued',
      queuedAt: Date.now(),
      syncedAt: null
    };
    
    // Store in local storage
    await localDB.queuedExecutions.create(queuedExecution);
    
    return queuedExecution.id;
  }
  
  // Sync queued executions when online
  async syncQueuedExecutions(userId: string): Promise<void> {
    const queuedExecutions = await localDB.queuedExecutions.findByUserId(userId);
    
    for (const execution of queuedExecutions) {
      try {
        // Execute on server
        const result = await executePackOnServer(execution);
        
        // Update local record
        await localDB.queuedExecutions.update(execution.id, {
          status: 'synced',
          syncedAt: Date.now(),
          result
        });
        
        // Publish sync event
        await eventBus.publish('execution.synced', {
          executionId: execution.id,
          userId
        });
        
      } catch (error) {
        logger.error('Failed to sync queued execution', {
          executionId: execution.id,
          error: error.message
        });
      }
    }
  }
  
  // Use cached pack data when offline
  async getCachedPack(packId: string): Promise<Pack> {
    return localDB.cachedPacks.findById(packId);
  }
}
```

---

### 1.12 Execution History Logging

#### History Tracking
```typescript
interface ExecutionHistoryEntry {
  historyId: string;
  executionId: string;
  userId: string;
  packId: string;
  title: string;
  description: string;
  tags: string[];
  
  // Execution details
  inputVariables: Record<string, any>;
  output: string;
  creditsUsed: number;
  executionTime: number;
  
  // Metadata
  starred: boolean;
  sharedWith: string[];
  isPublic: boolean;
  publicUrl: string;
  
  // Timestamps
  createdAt: timestamp;
  updatedAt: timestamp;
  deletedAt: timestamp | null;
}

class ExecutionHistoryManager {
  async saveExecution(
    execution: ExecutionState,
    title: string,
    description: string,
    tags: string[]
  ): Promise<ExecutionHistoryEntry> {
    const entry: ExecutionHistoryEntry = {
      historyId: generateId(),
      executionId: execution.executionId,
      userId: execution.userId,
      packId: execution.packId,
      title,
      description,
      tags,
      inputVariables: execution.inputVariables,
      output: execution.finalOutput,
      creditsUsed: execution.creditsUsed,
      executionTime: execution.completedAt - execution.startedAt,
      starred: false,
      sharedWith: [],
      isPublic: false,
      publicUrl: null,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      deletedAt: null
    };
    
    await db.executionHistory.create(entry);
    return entry;
  }
  
  async shareExecution(
    historyId: string,
    userId: string,
    shareWith: string[]
  ): Promise<void> {
    const entry = await db.executionHistory.findById(historyId);
    
    if (entry.userId !== userId) {
      throw new Error('Unauthorized');
    }
    
    entry.sharedWith = shareWith;
    entry.updatedAt = Date.now();
    
    await db.executionHistory.update(historyId, entry);
    
    // Send notifications to shared users
    for (const sharedUserId of shareWith) {
      await notificationService.send(sharedUserId, {
        type: 'execution_shared',
        title: 'Execution Shared',
        body: `${entry.title} was shared with you`,
        data: { historyId }
      });
    }
  }
}
```

---

### 1.13 API Endpoints for Pack Execution

#### Execute Prompt
```
POST /prompts/:promptId/execute
Content-Type: application/json
Authorization: Bearer {token}

Request:
{
  "inputVariables": {
    "niche": "fitness",
    "productType": "mobile_app"
  },
  "model": "gpt-4",
  "temperature": 0.7,
  "maxTokens": 2000
}

Response (200):
{
  "executionId": "exec_123",
  "status": "completed",
  "output": "Generated prompt content...",
  "creditsUsed": 116,
  "executionTime": 1234,
  "timestamp": "2024-01-28T10:30:00Z"
}

Error Response (402):
{
  "error": {
    "code": "INSUFFICIENT_CREDITS",
    "message": "Insufficient credits: 116 required, 50 available",
    "details": { "required": 116, "available": 50 }
  }
}
```

#### Execute Pack
```
POST /packs/:packId/execute
Content-Type: application/json
Authorization: Bearer {token}

Request:
{
  "inputVariables": {
    "niche": "fitness",
    "productType": "mobile_app",
    "targetAudience": "gym enthusiasts"
  },
  "model": "gpt-4",
  "temperature": 0.7
}

Response (200):
{
  "executionId": "exec_456",
  "status": "completed",
  "packId": "pack_789",
  "totalSteps": 4,
  "completedSteps": 4,
  "stepResults": {
    "step_1": { "output": "MVP idea..." },
    "step_2": { "output": "Monetisation strategy..." },
    "step_3": { "output": "Automation plan..." },
    "step_4": { "output": "Launch roadmap..." }
  },
  "finalOutput": "Complete pack output...",
  "totalCreditsUsed": 450,
  "executionTime": 5000,
  "timestamp": "2024-01-28T10:35:00Z"
}
```

#### Fetch Pack Metadata
```
GET /packs/:packId/metadata
Authorization: Bearer {token}

Response (200):
{
  "packId": "pack_789",
  "name": "Complete MVP Builder",
  "description": "Build a complete MVP in 4 steps",
  "category": "MVP Builder",
  "totalSteps": 4,
  "estimatedCredits": 450,
  "estimatedTime": 5000,
  "inputVariables": [
    { "name": "niche", "type": "string", "required": true },
    { "name": "productType", "type": "string", "required": true },
    { "name": "targetAudience", "type": "string", "required": true }
  ],
  "outputFormat": "markdown",
  "visualisationHooks": [
    { "hookId": "hook_1", "stepId": "step_1", "type": "diagram" }
  ]
}
```

#### Fetch Context Variables
```
GET /packs/:packId/context-variables
Authorization: Bearer {token}

Response (200):
{
  "inputVariables": [
    {
      "name": "niche",
      "type": "string",
      "description": "Target niche for the MVP",
      "examples": ["fitness", "finance", "productivity"],
      "required": true
    },
    {
      "name": "productType",
      "type": "string",
      "description": "Type of product to build",
      "examples": ["mobile_app", "saas", "chrome_extension"],
      "required": true
    }
  ],
  "systemVariables": [
    { "name": "userId", "type": "string" },
    { "name": "timestamp", "type": "number" }
  ]
}
```

#### Fetch Visualization Prompt
```
GET /executions/:executionId/visualizations/:hookId/prompt
Authorization: Bearer {token}

Response (200):
{
  "hookId": "hook_1",
  "visualisationType": "diagram",
  "prompt": "Create a system architecture diagram for: [MVP idea from step 1]",
  "creditCost": 50,
  "estimatedTime": 2000
}
```

#### Save Execution History
```
POST /executions/:executionId/save
Content-Type: application/json
Authorization: Bearer {token}

Request:
{
  "title": "My First MVP",
  "description": "Fitness app MVP for gym enthusiasts",
  "tags": ["fitness", "mvp", "mobile"]
}

Response (201):
{
  "historyId": "hist_123",
  "executionId": "exec_456",
  "title": "My First MVP",
  "description": "Fitness app MVP for gym enthusiasts",
  "tags": ["fitness", "mvp", "mobile"],
  "createdAt": "2024-01-28T10:35:00Z",
  "publicUrl": "https://promptforge.com/history/hist_123"
}
```

#### Sync Execution State
```
POST /executions/:executionId/sync
Content-Type: application/json
Authorization: Bearer {token}

Request:
{
  "deviceId": "device_xyz",
  "localVersion": { "status": "completed", "updatedAt": 1706425200000 }
}

Response (200):
{
  "executionId": "exec_456",
  "status": "completed",
  "remoteVersion": { "status": "completed", "updatedAt": 1706425200000 },
  "synced": true,
  "conflicts": []
}
```

This completes Section 1. The next sections will cover Credit Cost Model, Visualization Integration, and comprehensive API specifications.

