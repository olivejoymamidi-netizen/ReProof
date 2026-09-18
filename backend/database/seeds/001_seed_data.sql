-- =============================================================
-- ReProof — Seed Data
-- File: 001_seed_data.sql
-- =============================================================
-- Run AFTER 001_initial_schema.sql.
-- Uses fixed UUIDs so the seed is idempotent (safe to re-run).
-- =============================================================


-- =============================================================
-- COURSE: Software Engineering
-- =============================================================

INSERT INTO courses (id, name, description)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Software Engineering',
  'Core software engineering skills covering debugging, testing, design and implementation.'
)
ON CONFLICT (id) DO NOTHING;


-- =============================================================
-- SKILLS: Debugging, Testing
-- (both under Software Engineering)
-- =============================================================

INSERT INTO skills (id, course_id, name, description)
VALUES
  (
    '00000000-0000-0000-0001-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'Debugging',
    'The ability to identify, analyse, and resolve defects in software systematically.'
  ),
  (
    '00000000-0000-0000-0001-000000000002',
    '00000000-0000-0000-0000-000000000001',
    'Testing',
    'The ability to design, implement, and evaluate software tests to ensure correctness.'
  )
ON CONFLICT (id) DO NOTHING;


-- =============================================================
-- SKILL LEVELS: Debugging — Levels 1, 2, 3
-- =============================================================

INSERT INTO skill_levels (id, skill_id, level_number, title, description, difficulty)
VALUES
  (
    '00000000-0000-0000-0002-000000000001',
    '00000000-0000-0000-0001-000000000001',
    1,
    'Debugging — Level 1',
    'Identify and fix straightforward bugs in isolated functions with clear error messages.',
    'beginner'
  ),
  (
    '00000000-0000-0000-0002-000000000002',
    '00000000-0000-0000-0001-000000000001',
    2,
    'Debugging — Level 2',
    'Debug logic errors and integration issues across multiple modules without direct error messages.',
    'intermediate'
  ),
  (
    '00000000-0000-0000-0003-000000000001',
    '00000000-0000-0000-0001-000000000001',
    3,
    'Debugging — Level 3',
    'Debug complex concurrency, performance, and system-level issues in a multi-component environment.',
    'advanced'
  )
ON CONFLICT (id) DO NOTHING;


-- =============================================================
-- SKILL LEVELS: Testing — Levels 1, 2, 3
-- =============================================================

INSERT INTO skill_levels (id, skill_id, level_number, title, description, difficulty)
VALUES
  (
    '00000000-0000-0000-0002-000000000003',
    '00000000-0000-0000-0001-000000000002',
    1,
    'Testing — Level 1',
    'Write basic unit tests for individual functions with clear inputs and expected outputs.',
    'beginner'
  ),
  (
    '00000000-0000-0000-0002-000000000004',
    '00000000-0000-0000-0001-000000000002',
    2,
    'Testing — Level 2',
    'Write integration tests and handle mocking, edge cases, and boundary conditions.',
    'intermediate'
  ),
  (
    '00000000-0000-0000-0003-000000000002',
    '00000000-0000-0000-0001-000000000002',
    3,
    'Testing — Level 3',
    'Design a comprehensive test strategy including unit, integration, and end-to-end tests with coverage analysis.',
    'advanced'
  )
ON CONFLICT (id) DO NOTHING;


-- =============================================================
-- TASKS: Debugging
-- =============================================================

INSERT INTO tasks (id, skill_level_id, title, description, task_type, difficulty, instructions, expected_evidence)
VALUES
  -- Debugging Level 1
  (
    '00000000-0000-0000-0004-000000000001',
    '00000000-0000-0000-0002-000000000001',
    'Fix the Off-By-One Error',
    'A function that sums a list is returning an incorrect total. Identify and fix the bug.',
    'code_fix',
    'beginner',
    'Review the provided sum function. Identify the off-by-one error in the loop boundary and correct it. Explain what was wrong and why your fix resolves the issue.',
    '{"expected_behaviors": ["correct loop boundary identified", "fix applied", "explanation provided"], "evidence_types": ["code_change", "explanation"]}'
  ),
  -- Debugging Level 2
  (
    '00000000-0000-0000-0004-000000000002',
    '00000000-0000-0000-0002-000000000002',
    'Debug a Silent Data Corruption Issue',
    'A multi-module order processing system is producing incorrect totals with no visible error. Trace and fix the root cause.',
    'code_investigation',
    'intermediate',
    'Given the order processing modules, reproduce the incorrect total, trace the data flow to identify where corruption occurs, fix the issue, and describe your debugging approach.',
    '{"expected_behaviors": ["root cause identified", "data flow traced", "fix applied", "debugging strategy explained"], "evidence_types": ["code_change", "trace_output", "explanation"]}'
  ),
  -- Debugging Level 3
  (
    '00000000-0000-0000-0004-000000000003',
    '00000000-0000-0000-0003-000000000001',
    'Debug a Race Condition Under Load',
    'A concurrent job queue produces duplicate entries under high concurrency. Identify and resolve the race condition.',
    'code_investigation',
    'advanced',
    'Given the concurrent job queue implementation, reproduce the race condition, identify the shared resource and synchronisation failure, apply an appropriate fix, and explain the concurrency model changes made.',
    '{"expected_behaviors": ["race condition reproduced", "shared resource identified", "synchronisation fix applied", "explanation of fix"], "evidence_types": ["code_change", "concurrency_analysis", "test_output"]}'
  )
ON CONFLICT (id) DO NOTHING;


-- =============================================================
-- TASKS: Testing
-- =============================================================

INSERT INTO tasks (id, skill_level_id, title, description, task_type, difficulty, instructions, expected_evidence)
VALUES
  -- Testing Level 1
  (
    '00000000-0000-0000-0004-000000000004',
    '00000000-0000-0000-0002-000000000003',
    'Write Unit Tests for a Calculator',
    'Write unit tests for a basic calculator module covering add, subtract, multiply, and divide.',
    'test_writing',
    'beginner',
    'Given the calculator module, write unit tests for all four operations. Include at least one positive case, one negative case, and one edge case per operation. Use a standard testing framework.',
    '{"expected_behaviors": ["all operations tested", "edge cases included", "tests pass"], "evidence_types": ["test_code", "test_output"]}'
  ),
  -- Testing Level 2
  (
    '00000000-0000-0000-0004-000000000005',
    '00000000-0000-0000-0002-000000000004',
    'Integration Test an Order Processing Pipeline',
    'Write integration tests for an order processing pipeline covering the full order lifecycle with mocked external dependencies.',
    'test_writing',
    'intermediate',
    'Given the order pipeline, write integration tests covering order creation, validation, processing, and completion. Mock the payment gateway. Test failure paths and boundary conditions.',
    '{"expected_behaviors": ["lifecycle covered", "mocking applied", "failure paths tested", "boundary conditions tested"], "evidence_types": ["test_code", "test_output", "mock_usage"]}'
  ),
  -- Testing Level 3
  (
    '00000000-0000-0000-0004-000000000006',
    '00000000-0000-0000-0003-000000000002',
    'Design a Full Test Strategy for a REST API',
    'Design and implement a full test strategy for a REST API covering unit, integration, and end-to-end tests with coverage reporting.',
    'test_strategy',
    'advanced',
    'Given the REST API specification, produce a written test strategy, implement representative tests at each level (unit, integration, e2e), generate a coverage report, and explain trade-offs made.',
    '{"expected_behaviors": ["strategy document produced", "unit tests implemented", "integration tests implemented", "e2e tests implemented", "coverage report generated", "trade-offs explained"], "evidence_types": ["strategy_doc", "test_code", "coverage_report", "explanation"]}'
  )
ON CONFLICT (id) DO NOTHING;
