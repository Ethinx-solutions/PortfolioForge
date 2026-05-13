# PromptForge Supabase Realtime Setup — JIRA Tickets

## Epic: PFORGE-REALTIME-001
**Title**: Supabase Realtime Infrastructure & Real-Time Shiver Feature
**Description**: Set up Supabase Realtime environment, create database schema, implement triggers, and enable real-time revenue updates for the Revenue Predictor Dashboard
**Story Points**: 89
**Timeline**: 2 weeks
**Team**: DevOps + Backend
**Priority**: CRITICAL

---

## PHASE 1: SUPABASE REALTIME INFRASTRUCTURE SETUP

### TICKET: PFORGE-REALTIME-101
**Title**: Configure Supabase Project & Enable Realtime
**Type**: Task
**Story Points**: 13
**Assignee**: DevOps Engineer (Lead)
**Priority**: CRITICAL
**Due Date**: Day 1

**Description**:
Set up Supabase project with Realtime enabled, configure authentication, and establish secure connections for the Revenue Predictor Dashboard.

**Acceptance Criteria**:
- [ ] Supabase project created with PostgreSQL database
- [ ] Realtime extension enabled on the project
- [ ] JWT secret configured and stored in secure vault
- [ ] Row-level security (RLS) policies defined
- [ ] API keys generated (anon key, service role key)
- [ ] CORS configured for all frontend domains
- [ ] SSL/TLS certificates validated
- [ ] Supabase dashboard accessible and configured

**Tasks**:
1. Create new Supabase project in production region
2. Enable Realtime extension via Supabase dashboard
3. Configure PostgreSQL connection settings
4. Generate JWT secret (minimum 32 characters)
5. Store secrets in AWS Secrets Manager
6. Create anon key with minimal permissions
7. Create service role key with full permissions
8. Configure CORS for: localhost:3000, app.promptforge.io, *.promptforge.io
9. Test connection from local development environment
10. Document all credentials and access procedures

**Testing**:
```bash
# Test Supabase connection
curl -X GET https://your-project.supabase.co/rest/v1/projects \
  -H "Authorization: Bearer YOUR_ANON_KEY"

# Expected: 200 OK response
```

**Dependencies**: None
**Blockers**: None
**Notes**: Store all credentials in 1Password under "PromptForge - Supabase Credentials"

---

### TICKET: PFORGE-REALTIME-102
**Title**: Set Up Realtime Channel Architecture
**Type**: Task
**Story Points**: 8
**Assignee**: DevOps Engineer
**Priority**: CRITICAL
**Due Date**: Day 2

**Description**:
Design and implement Realtime channel structure for pack executions, project updates, and revenue events.

**Acceptance Criteria**:
- [ ] Channel naming convention documented
- [ ] Project-scoped channels configured
- [ ] User-scoped channels configured
- [ ] Public broadcast channels configured
- [ ] Channel permissions defined via RLS
- [ ] Channel subscription limits set
- [ ] Rate limiting configured (100 subscriptions per user)
- [ ] Channel monitoring dashboard created

**Channel Architecture**:

```
project:{projectId}:executions
  - Broadcasts when pack execution completes
  - Payload: { pack_id, revenue_generated, timestamp }
  - Subscribers: Founder + team members
  - Permissions: RLS-based (only project members)

project:{projectId}:revenue
  - Broadcasts when revenue milestone reached
  - Payload: { total_revenue, milestone_type, timestamp }
  - Subscribers: Founder + analytics team
  - Permissions: RLS-based

project:{projectId}:status
  - Broadcasts project status updates
  - Payload: { status, message, timestamp }
  - Subscribers: Founder + team members
  - Permissions: RLS-based

user:{userId}:notifications
  - Broadcasts personal notifications
  - Payload: { notification_type, message, timestamp }
  - Subscribers: User only
  - Permissions: User-specific

broadcast:revenue-leaderboard
  - Public broadcast of top revenue performers
  - Payload: { rank, founder_name, revenue, timestamp }
  - Subscribers: All users
  - Permissions: Public read-only
```

**Tasks**:
1. Document channel naming convention
2. Create project-scoped channel templates
3. Create user-scoped channel templates
4. Create public broadcast channel templates
5. Configure channel permissions via RLS policies
6. Set up channel subscription limits
7. Configure rate limiting (100 subscriptions/user)
8. Create monitoring dashboard for channel health
9. Document channel subscription procedures
10. Create test channels for development

**Testing**:
```javascript
// Test channel subscription
const channel = supabase
  .channel(`project:123:executions`)
  .on('postgres_changes', { event: '*', schema: 'public' }, (payload) => {
    console.log('Received:', payload);
  })
  .subscribe();

// Expected: Connected to channel, ready to receive messages
```

**Dependencies**: PFORGE-REALTIME-101
**Blockers**: None
**Notes**: Channel architecture must support 10,000+ concurrent subscriptions

---

### TICKET: PFORGE-REALTIME-103
**Title**: Configure Row-Level Security (RLS) Policies
**Type**: Task
**Story Points**: 13
**Assignee**: DevOps Engineer (Security)
**Priority**: CRITICAL
**Due Date**: Day 3

**Description**:
Implement comprehensive RLS policies to ensure users can only access their own project data via Realtime.

**Acceptance Criteria**:
- [ ] RLS enabled on all tables
- [ ] Select policies defined for all tables
- [ ] Insert policies defined for execution tables
- [ ] Update policies defined for status tables
- [ ] Delete policies restricted to admins only
- [ ] Service role bypass policies configured
- [ ] Policy testing completed
- [ ] Security audit passed

**RLS Policies**:

```sql
-- Enable RLS on all tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE pack_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE revenue_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Projects: Users can only see their own projects
CREATE POLICY "Users can view own projects"
  ON projects FOR SELECT
  USING (auth.uid() = user_id OR auth.uid() IN (
    SELECT user_id FROM project_members WHERE project_id = projects.id
  ));

-- Pack Executions: Users can only see executions for their projects
CREATE POLICY "Users can view own project executions"
  ON pack_executions FOR SELECT
  USING (project_id IN (
    SELECT id FROM projects WHERE user_id = auth.uid()
  ));

-- Pack Executions: Only backend service can insert
CREATE POLICY "Service role can insert executions"
  ON pack_executions FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

-- Revenue Events: Users can only see events for their projects
CREATE POLICY "Users can view own project revenue events"
  ON revenue_events FOR SELECT
  USING (project_id IN (
    SELECT id FROM projects WHERE user_id = auth.uid()
  ));

-- Revenue Events: Only backend service can insert
CREATE POLICY "Service role can insert revenue events"
  ON revenue_events FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

-- Users: Users can only see their own profile
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);
```

**Tasks**:
1. Enable RLS on all tables
2. Create select policies for projects table
3. Create select policies for pack_executions table
4. Create select policies for revenue_events table
5. Create select policies for users table
6. Create insert policies for pack_executions table
7. Create insert policies for revenue_events table
8. Create update policies for status tables
9. Configure service role bypass policies
10. Test all policies with sample queries
11. Run security audit
12. Document RLS policy matrix

**Testing**:
```sql
-- Test as authenticated user
SET ROLE authenticated;
SET request.jwt.claims = '{"sub":"user-123"}';
SELECT * FROM projects; -- Should only see user's projects

-- Test as service role
SET ROLE service_role;
INSERT INTO pack_executions (...) VALUES (...); -- Should succeed
```

**Dependencies**: PFORGE-REALTIME-101
**Blockers**: None
**Notes**: RLS is critical for security. All policies must be reviewed by security team.

---

## PHASE 2: DATABASE SCHEMA & TRIGGERS

### TICKET: PFORGE-REALTIME-104
**Title**: Create Pack Executions Table & Schema
**Type**: Task
**Story Points**: 8
**Assignee**: Backend Engineer
**Priority**: CRITICAL
**Due Date**: Day 4

**Description**:
Create the `pack_executions` table with all necessary columns, indexes, and constraints for tracking pack execution events.

**Acceptance Criteria**:
- [ ] Table created with all columns
- [ ] Primary key configured
- [ ] Foreign keys configured
- [ ] Indexes created for performance
- [ ] Constraints validated
- [ ] Default values set
- [ ] Comments added to all columns
- [ ] Schema migration tested

**Schema**:

```sql
CREATE TABLE pack_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  pack_id UUID NOT NULL REFERENCES packs(id) ON DELETE CASCADE,
  pack_name TEXT NOT NULL,
  pack_category TEXT NOT NULL,
  
  -- Execution details
  status TEXT NOT NULL DEFAULT 'pending',
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  duration_seconds INTEGER,
  
  -- Revenue tracking
  revenue_generated DECIMAL(12, 2) NOT NULL DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  
  -- Metadata
  execution_params JSONB,
  output_data JSONB,
  error_message TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Audit
  created_by UUID REFERENCES users(id),
  updated_by UUID REFERENCES users(id),
  
  CONSTRAINT revenue_non_negative CHECK (revenue_generated >= 0),
  CONSTRAINT valid_status CHECK (status IN ('pending', 'running', 'completed', 'failed'))
);

-- Indexes for performance
CREATE INDEX idx_pack_executions_project_id ON pack_executions(project_id);
CREATE INDEX idx_pack_executions_user_id ON pack_executions(user_id);
CREATE INDEX idx_pack_executions_pack_id ON pack_executions(pack_id);
CREATE INDEX idx_pack_executions_created_at ON pack_executions(created_at DESC);
CREATE INDEX idx_pack_executions_status ON pack_executions(status);
CREATE INDEX idx_pack_executions_completed_at ON pack_executions(completed_at DESC);

-- Composite indexes for common queries
CREATE INDEX idx_pack_executions_project_status ON pack_executions(project_id, status);
CREATE INDEX idx_pack_executions_project_created ON pack_executions(project_id, created_at DESC);

-- Comments for documentation
COMMENT ON TABLE pack_executions IS 'Tracks all pack execution events for revenue tracking and Realtime updates';
COMMENT ON COLUMN pack_executions.revenue_generated IS 'Revenue generated by this pack execution (in USD)';
COMMENT ON COLUMN pack_executions.status IS 'Execution status: pending, running, completed, or failed';
```

**Tasks**:
1. Create table definition
2. Add all columns with proper types
3. Configure primary key
4. Configure foreign keys
5. Create performance indexes
6. Add constraints
7. Add comments
8. Test schema creation
9. Verify indexes are created
10. Document schema

**Testing**:
```sql
-- Verify table exists
SELECT * FROM information_schema.tables WHERE table_name = 'pack_executions';

-- Verify indexes exist
SELECT * FROM pg_indexes WHERE tablename = 'pack_executions';

-- Test insert
INSERT INTO pack_executions (project_id, user_id, pack_id, pack_name, pack_category, revenue_generated)
VALUES (gen_random_uuid(), gen_random_uuid(), gen_random_uuid(), 'Test Pack', 'Monetisation', 5000);
```

**Dependencies**: PFORGE-REALTIME-101
**Blockers**: None
**Notes**: This table is critical for Realtime shiver feature. Must be optimized for high-volume inserts.

---

### TICKET: PFORGE-REALTIME-105
**Title**: Create Revenue Events Table & Schema
**Type**: Task
**Story Points**: 5
**Assignee**: Backend Engineer
**Priority**: HIGH
**Due Date**: Day 4

**Description**:
Create the `revenue_events` table for tracking revenue milestones and aggregate events.

**Acceptance Criteria**:
- [ ] Table created with all columns
- [ ] Indexes created
- [ ] Constraints validated
- [ ] Schema migration tested
- [ ] Ready for Realtime broadcasts

**Schema**:

```sql
CREATE TABLE revenue_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Event details
  event_type TEXT NOT NULL,
  milestone_type TEXT,
  milestone_value DECIMAL(12, 2),
  
  -- Revenue snapshot
  total_revenue DECIMAL(12, 2) NOT NULL,
  previous_revenue DECIMAL(12, 2),
  revenue_delta DECIMAL(12, 2),
  
  -- Metadata
  description TEXT,
  metadata JSONB,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT valid_event_type CHECK (event_type IN ('milestone', 'pack_complete', 'subscription_upgrade', 'manual_adjustment')),
  CONSTRAINT revenue_non_negative CHECK (total_revenue >= 0)
);

-- Indexes
CREATE INDEX idx_revenue_events_project_id ON revenue_events(project_id);
CREATE INDEX idx_revenue_events_user_id ON revenue_events(user_id);
CREATE INDEX idx_revenue_events_created_at ON revenue_events(created_at DESC);
CREATE INDEX idx_revenue_events_event_type ON revenue_events(event_type);
CREATE INDEX idx_revenue_events_project_created ON revenue_events(project_id, created_at DESC);
```

**Tasks**:
1. Create table definition
2. Add all columns
3. Create indexes
4. Add constraints
5. Test schema
6. Document schema

**Testing**:
```sql
-- Test insert
INSERT INTO revenue_events (project_id, user_id, event_type, total_revenue, description)
VALUES (gen_random_uuid(), gen_random_uuid(), 'milestone', 50000, 'Reached $50K MRR milestone');
```

**Dependencies**: PFORGE-REALTIME-101
**Blockers**: None

---

### TICKET: PFORGE-REALTIME-106
**Title**: Implement Database Triggers for Realtime Events
**Type**: Task
**Story Points**: 21
**Assignee**: Backend Engineer (Senior)
**Priority**: CRITICAL
**Due Date**: Day 5-6

**Description**:
Create database triggers that automatically broadcast pack execution events and revenue updates to Realtime channels.

**Acceptance Criteria**:
- [ ] Trigger for pack execution completion created
- [ ] Trigger for revenue milestone detection created
- [ ] Trigger for revenue event creation created
- [ ] All triggers tested and working
- [ ] Performance impact assessed (<10ms per trigger)
- [ ] Error handling implemented
- [ ] Logging implemented
- [ ] Rollback procedure documented

**Triggers**:

```sql
-- Function to broadcast pack execution completion
CREATE OR REPLACE FUNCTION broadcast_pack_execution()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    -- Broadcast to project channel
    PERFORM pg_notify(
      'realtime:' || NEW.project_id || ':executions',
      json_build_object(
        'type', 'pack_execution_complete',
        'id', NEW.id,
        'pack_id', NEW.pack_id,
        'pack_name', NEW.pack_name,
        'revenue_generated', NEW.revenue_generated,
        'completed_at', NEW.completed_at,
        'duration_seconds', NEW.duration_seconds
      )::text
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger on pack_executions table
CREATE TRIGGER pack_execution_complete_trigger
AFTER UPDATE ON pack_executions
FOR EACH ROW
EXECUTE FUNCTION broadcast_pack_execution();

-- Function to detect and broadcast revenue milestones
CREATE OR REPLACE FUNCTION detect_revenue_milestone()
RETURNS TRIGGER AS $$
DECLARE
  total_revenue DECIMAL;
  milestone_value DECIMAL;
  milestone_type TEXT;
BEGIN
  -- Calculate total revenue for project
  SELECT COALESCE(SUM(revenue_generated), 0)
  INTO total_revenue
  FROM pack_executions
  WHERE project_id = NEW.project_id AND status = 'completed';
  
  -- Check for milestones
  IF total_revenue >= 50000 AND NEW.revenue_generated > 0 THEN
    -- Check if this is the first time hitting $50K
    IF (total_revenue - NEW.revenue_generated) < 50000 THEN
      milestone_type := '$50K_MRR';
      milestone_value := 50000;
      
      -- Insert revenue event
      INSERT INTO revenue_events (
        project_id, user_id, event_type, milestone_type, milestone_value,
        total_revenue, previous_revenue, revenue_delta, description
      )
      VALUES (
        NEW.project_id, NEW.user_id, 'milestone', milestone_type, milestone_value,
        total_revenue, total_revenue - NEW.revenue_generated, NEW.revenue_generated,
        'Reached $50K MRR milestone!'
      );
      
      -- Broadcast milestone to project channel
      PERFORM pg_notify(
        'realtime:' || NEW.project_id || ':revenue',
        json_build_object(
          'type', 'milestone_reached',
          'milestone_type', milestone_type,
          'milestone_value', milestone_value,
          'total_revenue', total_revenue,
          'timestamp', NOW()
        )::text
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger on pack_executions for milestone detection
CREATE TRIGGER revenue_milestone_trigger
AFTER INSERT ON pack_executions
FOR EACH ROW
WHEN (NEW.status = 'completed')
EXECUTE FUNCTION detect_revenue_milestone();

-- Function to broadcast revenue events
CREATE OR REPLACE FUNCTION broadcast_revenue_event()
RETURNS TRIGGER AS $$
BEGIN
  -- Broadcast to project channel
  PERFORM pg_notify(
    'realtime:' || NEW.project_id || ':revenue',
    json_build_object(
      'type', 'revenue_event',
      'id', NEW.id,
      'event_type', NEW.event_type,
      'milestone_type', NEW.milestone_type,
      'total_revenue', NEW.total_revenue,
      'revenue_delta', NEW.revenue_delta,
      'description', NEW.description,
      'timestamp', NEW.created_at
    )::text
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger on revenue_events table
CREATE TRIGGER revenue_event_broadcast_trigger
AFTER INSERT ON revenue_events
FOR EACH ROW
EXECUTE FUNCTION broadcast_revenue_event();

-- Function to update pack_executions timestamp
CREATE OR REPLACE FUNCTION update_pack_executions_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update timestamp
CREATE TRIGGER pack_executions_timestamp_trigger
BEFORE UPDATE ON pack_executions
FOR EACH ROW
EXECUTE FUNCTION update_pack_executions_timestamp();
```

**Tasks**:
1. Create broadcast_pack_execution function
2. Create pack_execution_complete_trigger
3. Create detect_revenue_milestone function
4. Create revenue_milestone_trigger
5. Create broadcast_revenue_event function
6. Create revenue_event_broadcast_trigger
7. Create update_pack_executions_timestamp function
8. Create pack_executions_timestamp_trigger
9. Test all triggers with sample data
10. Measure performance impact
11. Implement error handling
12. Implement logging
13. Document trigger behavior

**Testing**:
```sql
-- Test pack execution trigger
INSERT INTO pack_executions (project_id, user_id, pack_id, pack_name, pack_category, status, revenue_generated)
VALUES (gen_random_uuid(), gen_random_uuid(), gen_random_uuid(), 'Test', 'Monetisation', 'pending', 5000);

-- Update to completed
UPDATE pack_executions SET status = 'completed', completed_at = NOW() WHERE id = (SELECT id FROM pack_executions ORDER BY created_at DESC LIMIT 1);

-- Check if trigger fired (should see pg_notify message)
```

**Dependencies**: PFORGE-REALTIME-104, PFORGE-REALTIME-105
**Blockers**: None
**Notes**: Triggers must be optimized for high-volume operations. Test with 1000+ concurrent inserts.

---

## PHASE 3: TESTING & VALIDATION

### TICKET: PFORGE-REALTIME-107
**Title**: Test Realtime Channel Subscriptions
**Type**: Task
**Story Points**: 13
**Assignee**: QA Engineer
**Priority**: CRITICAL
**Due Date**: Day 7

**Description**:
Comprehensive testing of Realtime channel subscriptions, message delivery, and error handling.

**Acceptance Criteria**:
- [ ] Channel subscription test passed
- [ ] Message delivery test passed
- [ ] Multiple subscriber test passed
- [ ] Unsubscribe test passed
- [ ] Error handling test passed
- [ ] Performance test passed (100+ subscribers)
- [ ] Load test passed (1000+ messages/second)
- [ ] All tests documented

**Test Cases**:

```javascript
// Test 1: Basic subscription
describe('Realtime Channel Subscriptions', () => {
  test('should subscribe to project channel', async () => {
    const channel = supabase
      .channel('project:123:executions')
      .on('postgres_changes', { event: '*' }, (payload) => {
        expect(payload.new).toBeDefined();
      })
      .subscribe();
    
    expect(channel.state).toBe('SUBSCRIBED');
  });
  
  // Test 2: Message delivery
  test('should receive messages on subscribed channel', async () => {
    const messages = [];
    const channel = supabase
      .channel('project:123:executions')
      .on('postgres_changes', { event: 'INSERT' }, (payload) => {
        messages.push(payload.new);
      })
      .subscribe();
    
    // Insert test data
    await supabase.from('pack_executions').insert({
      project_id: '123',
      user_id: 'user-1',
      pack_id: 'pack-1',
      pack_name: 'Test',
      pack_category: 'Monetisation',
      revenue_generated: 5000
    });
    
    // Wait for message
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    expect(messages.length).toBe(1);
    expect(messages[0].revenue_generated).toBe(5000);
  });
  
  // Test 3: Multiple subscribers
  test('should deliver to multiple subscribers', async () => {
    const messages1 = [];
    const messages2 = [];
    
    const channel1 = supabase
      .channel('project:123:executions')
      .on('postgres_changes', { event: 'INSERT' }, (p) => messages1.push(p.new))
      .subscribe();
    
    const channel2 = supabase
      .channel('project:123:executions')
      .on('postgres_changes', { event: 'INSERT' }, (p) => messages2.push(p.new))
      .subscribe();
    
    // Insert test data
    await supabase.from('pack_executions').insert({...});
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    expect(messages1.length).toBe(1);
    expect(messages2.length).toBe(1);
  });
  
  // Test 4: Unsubscribe
  test('should stop receiving messages after unsubscribe', async () => {
    const messages = [];
    const channel = supabase
      .channel('project:123:executions')
      .on('postgres_changes', { event: 'INSERT' }, (p) => messages.push(p.new))
      .subscribe();
    
    channel.unsubscribe();
    
    // Insert test data
    await supabase.from('pack_executions').insert({...});
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    expect(messages.length).toBe(0);
  });
});

// Test 5: Performance - 100+ subscribers
test('should handle 100+ concurrent subscribers', async () => {
  const channels = [];
  for (let i = 0; i < 100; i++) {
    const channel = supabase
      .channel(`project:123:executions:${i}`)
      .on('postgres_changes', { event: '*' }, () => {})
      .subscribe();
    channels.push(channel);
  }
  
  // All should be subscribed
  channels.forEach(ch => expect(ch.state).toBe('SUBSCRIBED'));
});

// Test 6: Load test - 1000+ messages/second
test('should handle 1000+ messages per second', async () => {
  const startTime = Date.now();
  const messageCount = 1000;
  
  for (let i = 0; i < messageCount; i++) {
    await supabase.from('pack_executions').insert({
      project_id: '123',
      user_id: `user-${i}`,
      pack_id: `pack-${i}`,
      pack_name: `Test ${i}`,
      pack_category: 'Monetisation',
      revenue_generated: 5000
    });
  }
  
  const duration = Date.now() - startTime;
  const messagesPerSecond = (messageCount / duration) * 1000;
  
  expect(messagesPerSecond).toBeGreaterThan(1000);
});
```

**Tasks**:
1. Write subscription test cases
2. Write message delivery tests
3. Write multiple subscriber tests
4. Write unsubscribe tests
5. Write error handling tests
6. Write performance tests (100+ subscribers)
7. Write load tests (1000+ messages/second)
8. Execute all tests
9. Document results
10. Fix any failures

**Dependencies**: PFORGE-REALTIME-106
**Blockers**: None

---

### TICKET: PFORGE-REALTIME-108
**Title**: Test Database Triggers & Revenue Calculations
**Type**: Task
**Story Points**: 13
**Assignee**: QA Engineer
**Priority**: CRITICAL
**Due Date**: Day 7

**Description**:
Test all database triggers, revenue calculations, and milestone detection.

**Acceptance Criteria**:
- [ ] Pack execution trigger test passed
- [ ] Revenue milestone trigger test passed
- [ ] Revenue event trigger test passed
- [ ] Revenue calculation accuracy verified
- [ ] Milestone detection test passed
- [ ] Edge cases tested
- [ ] Performance test passed
- [ ] All tests documented

**Test Cases**:

```sql
-- Test 1: Pack execution trigger
BEGIN;
INSERT INTO pack_executions (project_id, user_id, pack_id, pack_name, pack_category, status, revenue_generated)
VALUES ('proj-1', 'user-1', 'pack-1', 'Test Pack', 'Monetisation', 'pending', 5000);

UPDATE pack_executions SET status = 'completed', completed_at = NOW() WHERE pack_name = 'Test Pack';

-- Verify trigger fired (check pg_notify logs)
SELECT * FROM revenue_events WHERE project_id = 'proj-1' ORDER BY created_at DESC LIMIT 1;
ROLLBACK;

-- Test 2: Revenue milestone detection
BEGIN;
-- Insert multiple pack executions to reach $50K milestone
INSERT INTO pack_executions (project_id, user_id, pack_id, pack_name, pack_category, status, revenue_generated)
VALUES 
  ('proj-2', 'user-2', 'pack-1', 'Pack 1', 'Monetisation', 'completed', 10000),
  ('proj-2', 'user-2', 'pack-2', 'Pack 2', 'Monetisation', 'completed', 15000),
  ('proj-2', 'user-2', 'pack-3', 'Pack 3', 'Monetisation', 'completed', 12000),
  ('proj-2', 'user-2', 'pack-4', 'Pack 4', 'Monetisation', 'completed', 13000);

-- Check if $50K milestone event was created
SELECT * FROM revenue_events WHERE project_id = 'proj-2' AND milestone_type = '$50K_MRR';

-- Should have 1 milestone event
ROLLBACK;

-- Test 3: Revenue calculation accuracy
BEGIN;
INSERT INTO pack_executions (project_id, user_id, pack_id, pack_name, pack_category, status, revenue_generated)
VALUES 
  ('proj-3', 'user-3', 'pack-1', 'Pack 1', 'Monetisation', 'completed', 5000.50),
  ('proj-3', 'user-3', 'pack-2', 'Pack 2', 'Monetisation', 'completed', 3250.75);

-- Verify total revenue is correct (8251.25)
SELECT SUM(revenue_generated) as total_revenue FROM pack_executions WHERE project_id = 'proj-3';

-- Should be 8251.25
ROLLBACK;

-- Test 4: Edge cases
BEGIN;
-- Test with zero revenue
INSERT INTO pack_executions (project_id, user_id, pack_id, pack_name, pack_category, status, revenue_generated)
VALUES ('proj-4', 'user-4', 'pack-1', 'Free Pack', 'Monetisation', 'completed', 0);

-- Test with negative revenue (should fail)
INSERT INTO pack_executions (project_id, user_id, pack_id, pack_name, pack_category, status, revenue_generated)
VALUES ('proj-4', 'user-4', 'pack-2', 'Invalid', 'Monetisation', 'completed', -100);
-- Should fail due to constraint

ROLLBACK;

-- Test 5: Trigger performance
BEGIN;
-- Insert 1000 pack executions and measure time
EXPLAIN ANALYZE
INSERT INTO pack_executions (project_id, user_id, pack_id, pack_name, pack_category, status, revenue_generated)
SELECT 
  'proj-5',
  'user-5',
  'pack-' || i,
  'Pack ' || i,
  'Monetisation',
  'completed',
  (random() * 10000)::numeric
FROM generate_series(1, 1000) as i;

-- Should complete in < 5 seconds
ROLLBACK;
```

**Tasks**:
1. Write pack execution trigger tests
2. Write revenue milestone trigger tests
3. Write revenue event trigger tests
4. Write revenue calculation tests
5. Write edge case tests
6. Write performance tests
7. Execute all tests
8. Document results
9. Fix any failures
10. Verify accuracy

**Dependencies**: PFORGE-REALTIME-106
**Blockers**: None

---

## PHASE 4: MONITORING & DOCUMENTATION

### TICKET: PFORGE-REALTIME-109
**Title**: Set Up Realtime Monitoring & Alerting
**Type**: Task
**Story Points**: 8
**Assignee**: DevOps Engineer
**Priority**: HIGH
**Due Date**: Day 8

**Description**:
Configure monitoring, alerting, and dashboards for Realtime health and performance.

**Acceptance Criteria**:
- [ ] Realtime connection monitoring configured
- [ ] Message delivery latency monitored
- [ ] Channel subscription limits monitored
- [ ] Error rate monitoring configured
- [ ] Performance metrics dashboard created
- [ ] Alerts configured for critical issues
- [ ] Logging configured
- [ ] Documentation completed

**Monitoring Setup**:

```yaml
# Prometheus metrics to collect
metrics:
  - realtime_connections_total
  - realtime_messages_delivered_total
  - realtime_message_latency_ms
  - realtime_channel_subscriptions
  - realtime_errors_total
  - realtime_trigger_execution_time_ms
  - database_trigger_errors_total

# Grafana dashboard queries
dashboard_queries:
  - "rate(realtime_messages_delivered_total[5m])"
  - "histogram_quantile(0.95, realtime_message_latency_ms)"
  - "realtime_connections_total"
  - "rate(realtime_errors_total[5m])"

# Alert rules
alerts:
  - name: "High Message Latency"
    condition: "histogram_quantile(0.95, realtime_message_latency_ms) > 1000"
    severity: "warning"
    
  - name: "Realtime Connection Failures"
    condition: "rate(realtime_errors_total[5m]) > 0.1"
    severity: "critical"
    
  - name: "Trigger Execution Timeout"
    condition: "realtime_trigger_execution_time_ms > 5000"
    severity: "warning"
```

**Tasks**:
1. Configure Prometheus scrape config
2. Create Grafana dashboard
3. Set up alert rules
4. Configure alert notifications
5. Set up logging aggregation
6. Create runbooks for common issues
7. Document monitoring procedures
8. Test alerts

**Dependencies**: PFORGE-REALTIME-106
**Blockers**: None

---

### TICKET: PFORGE-REALTIME-110
**Title**: Create Realtime Implementation Documentation
**Type**: Task
**Story Points**: 8
**Assignee**: Technical Writer
**Priority**: HIGH
**Due Date**: Day 9

**Description**:
Create comprehensive documentation for Realtime setup, configuration, and troubleshooting.

**Acceptance Criteria**:
- [ ] Architecture documentation completed
- [ ] Setup guide completed
- [ ] Configuration guide completed
- [ ] API reference completed
- [ ] Troubleshooting guide completed
- [ ] Performance tuning guide completed
- [ ] Security best practices documented
- [ ] All documentation reviewed

**Documentation Sections**:

1. **Architecture Overview**
   - Realtime architecture diagram
   - Channel structure explanation
   - Trigger flow explanation
   - Performance characteristics

2. **Setup Guide**
   - Step-by-step Supabase configuration
   - Database schema creation
   - Trigger creation
   - Testing procedures

3. **Configuration Guide**
   - Channel configuration
   - RLS policy configuration
   - Trigger configuration
   - Performance tuning

4. **API Reference**
   - Channel subscription API
   - Message format specification
   - Error codes and handling
   - Rate limiting

5. **Troubleshooting Guide**
   - Common issues and solutions
   - Debug procedures
   - Performance troubleshooting
   - Error log analysis

6. **Security Best Practices**
   - RLS policy best practices
   - Secret management
   - Rate limiting
   - Audit logging

**Tasks**:
1. Write architecture documentation
2. Write setup guide
3. Write configuration guide
4. Write API reference
5. Write troubleshooting guide
6. Write performance tuning guide
7. Write security best practices
8. Create diagrams
9. Review all documentation
10. Publish to wiki

**Dependencies**: PFORGE-REALTIME-108
**Blockers**: None

---

### TICKET: PFORGE-REALTIME-111
**Title**: Create Runbooks & Incident Response Procedures
**Type**: Task
**Story Points**: 5
**Assignee**: DevOps Engineer
**Priority**: HIGH
**Due Date**: Day 9

**Description**:
Create runbooks for common incidents and incident response procedures.

**Acceptance Criteria**:
- [ ] Realtime connection failure runbook created
- [ ] High latency runbook created
- [ ] Trigger failure runbook created
- [ ] Database performance runbook created
- [ ] Incident response procedure documented
- [ ] Escalation procedures documented
- [ ] All runbooks tested
- [ ] Team trained

**Runbook Examples**:

```markdown
# Runbook: Realtime Connection Failures

## Symptoms
- Users unable to connect to Realtime
- Error: "Failed to subscribe to channel"
- Dashboard not updating

## Diagnosis
1. Check Supabase status page
2. Check connection logs: `SELECT * FROM pg_stat_activity WHERE application_name LIKE '%realtime%'`
3. Check for network issues: `ping supabase-project.supabase.co`
4. Check JWT token validity

## Resolution
1. Restart Realtime service (if available)
2. Check JWT secret configuration
3. Verify RLS policies are correct
4. Check database connections

## Prevention
- Monitor connection count
- Set up alerts for connection failures
- Regular security audits
```

**Tasks**:
1. Create connection failure runbook
2. Create high latency runbook
3. Create trigger failure runbook
4. Create database performance runbook
5. Document incident response procedure
6. Document escalation procedures
7. Test all runbooks
8. Train team

**Dependencies**: PFORGE-REALTIME-109
**Blockers**: None

---

## SUMMARY

| Ticket | Title | Story Points | Status |
|--------|-------|--------------|--------|
| PFORGE-REALTIME-101 | Configure Supabase Project & Enable Realtime | 13 | Ready |
| PFORGE-REALTIME-102 | Set Up Realtime Channel Architecture | 8 | Ready |
| PFORGE-REALTIME-103 | Configure Row-Level Security (RLS) Policies | 13 | Ready |
| PFORGE-REALTIME-104 | Create Pack Executions Table & Schema | 8 | Ready |
| PFORGE-REALTIME-105 | Create Revenue Events Table & Schema | 5 | Ready |
| PFORGE-REALTIME-106 | Implement Database Triggers for Realtime Events | 21 | Ready |
| PFORGE-REALTIME-107 | Test Realtime Channel Subscriptions | 13 | Ready |
| PFORGE-REALTIME-108 | Test Database Triggers & Revenue Calculations | 13 | Ready |
| PFORGE-REALTIME-109 | Set Up Realtime Monitoring & Alerting | 8 | Ready |
| PFORGE-REALTIME-110 | Create Realtime Implementation Documentation | 8 | Ready |
| PFORGE-REALTIME-111 | Create Runbooks & Incident Response Procedures | 5 | Ready |

**Total Story Points**: 113
**Total Timeline**: 2 weeks
**Team**: 2 DevOps Engineers, 1 Backend Engineer (Senior), 1 QA Engineer, 1 Technical Writer

---

## IMPORT INTO JIRA

To import these tickets into JIRA:

1. Go to JIRA Project Settings → Import/Export
2. Use the JIRA REST API to bulk create tickets
3. Or manually create each ticket and copy the acceptance criteria

**API Endpoint**:
```bash
curl -X POST https://jira.promptforge.io/rest/api/3/issue \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "fields": {
      "project": {"key": "PFORGE"},
      "issuetype": {"name": "Task"},
      "summary": "Configure Supabase Project & Enable Realtime",
      "description": "...",
      "customfield_10000": 13,
      "assignee": {"name": "devops-engineer"}
    }
  }'
```

---

**Created by**: Manus AI
**Date**: January 30, 2026
**Status**: Ready for Implementation
