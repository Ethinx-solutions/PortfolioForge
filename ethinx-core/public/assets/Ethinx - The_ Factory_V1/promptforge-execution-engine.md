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