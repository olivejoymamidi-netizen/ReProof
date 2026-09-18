-- =============================================================
-- ReProof — Initial Database Schema
-- Migration: 001_initial_schema.sql
-- =============================================================
-- Run this file in the Supabase SQL editor or via the CLI.
-- Idempotent: uses IF NOT EXISTS where supported.
-- =============================================================

-- Enable pgcrypto for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pgcrypto";


-- =============================================================
-- TABLE 1 — users
-- =============================================================
-- Authentication is handled externally (e.g. Clerk / Supabase Auth).
-- This table stores application-level user records.
-- =============================================================

CREATE TABLE IF NOT EXISTS users (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  email       TEXT NOT NULL UNIQUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- =============================================================
-- TABLE 2 — courses
-- =============================================================

CREATE TABLE IF NOT EXISTS courses (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- =============================================================
-- TABLE 3 — skills
-- =============================================================

CREATE TABLE IF NOT EXISTS skills (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id   UUID NOT NULL REFERENCES courses(id) ON DELETE RESTRICT,
  name        TEXT NOT NULL,
  description TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(course_id, name)
);


-- =============================================================
-- TABLE 4 — skill_levels
-- =============================================================
-- level_number: 1, 2, or 3 only.
-- Each skill can have exactly one record per level number.
-- =============================================================

CREATE TABLE IF NOT EXISTS skill_levels (
  id           UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_id     UUID    NOT NULL REFERENCES skills(id) ON DELETE RESTRICT,
  level_number INTEGER NOT NULL,
  title        TEXT    NOT NULL,
  description  TEXT,
  difficulty   TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT skill_levels_level_number_check CHECK (level_number IN (1, 2, 3)),
  UNIQUE(skill_id, level_number)
);


-- =============================================================
-- TABLE 5 — tasks
-- =============================================================
-- expected_evidence uses JSONB to allow structured evidence
-- definitions that may evolve over time.
-- =============================================================

CREATE TABLE IF NOT EXISTS tasks (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_level_id    UUID NOT NULL REFERENCES skill_levels(id) ON DELETE RESTRICT,
  title             TEXT NOT NULL,
  description       TEXT,
  task_type         TEXT NOT NULL,
  difficulty        TEXT,
  instructions      TEXT,
  expected_evidence JSONB,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- =============================================================
-- TABLE 6 — attempts
-- =============================================================
-- An attempt = one learner attempting one task.
-- Multiple attempts are allowed per task per user.
-- status: 'in_progress' | 'submitted' | 'completed' | 'abandoned'
-- =============================================================

CREATE TABLE IF NOT EXISTS attempts (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  task_id        UUID NOT NULL REFERENCES tasks(id) ON DELETE RESTRICT,
  attempt_number INTEGER NOT NULL DEFAULT 1,
  status         TEXT    NOT NULL DEFAULT 'in_progress',
  started_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  submitted_at   TIMESTAMPTZ,
  completed_at   TIMESTAMPTZ,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT attempts_status_check
    CHECK (status IN ('in_progress', 'submitted', 'completed', 'abandoned')),
  CONSTRAINT attempts_number_positive CHECK (attempt_number >= 1)
);


-- =============================================================
-- TABLE 7 — submissions
-- =============================================================
-- content stores the primary submitted content (code, text, etc.).
-- metadata (JSONB) holds supplementary structured info such as
-- execution output, language, runtime, file info, etc.
-- submission_type: 'code' | 'text' | 'structured' | 'other'
-- =============================================================

CREATE TABLE IF NOT EXISTS submissions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id      UUID NOT NULL REFERENCES attempts(id) ON DELETE RESTRICT,
  submission_type TEXT NOT NULL,
  content         TEXT,
  metadata        JSONB,
  submitted_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT submissions_type_check
    CHECK (submission_type IN ('code', 'text', 'structured', 'other'))
);


-- =============================================================
-- TABLE 8 — evaluations
-- =============================================================
-- An evaluation belongs to an attempt.
-- Historical evaluations MUST NOT be overwritten.
-- A new evaluation record is inserted for each evaluation event.
-- evaluation_status: 'pending' | 'completed' | 'failed'
-- =============================================================

CREATE TABLE IF NOT EXISTS evaluations (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id        UUID    NOT NULL REFERENCES attempts(id) ON DELETE RESTRICT,
  overall_score     NUMERIC(5,2),
  summary           TEXT,
  evaluation_status TEXT    NOT NULL DEFAULT 'pending',
  evaluated_at      TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT evaluations_status_check
    CHECK (evaluation_status IN ('pending', 'completed', 'failed')),
  CONSTRAINT evaluations_score_range
    CHECK (overall_score IS NULL OR (overall_score >= 0 AND overall_score <= 100))
);


-- =============================================================
-- TABLE 9 — evaluation_criteria
-- =============================================================
-- Stores criterion-level scores and explanations per evaluation.
-- Examples: Root Cause Analysis, Implementation, Testing,
--           Edge Case Handling.
-- =============================================================

CREATE TABLE IF NOT EXISTS evaluation_criteria (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  evaluation_id  UUID NOT NULL REFERENCES evaluations(id) ON DELETE RESTRICT,
  criterion_name TEXT NOT NULL,
  level          TEXT,
  score          NUMERIC(5,2),
  explanation    TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT evaluation_criteria_score_range
    CHECK (score IS NULL OR (score >= 0 AND score <= 100))
);


-- =============================================================
-- TABLE 10 — evidence
-- =============================================================
-- Traceable to both an evaluation AND a specific criterion.
-- evidence_type: observed behavior, execution result, test result,
--               missing edge case, performance observation, etc.
-- =============================================================

CREATE TABLE IF NOT EXISTS evidence (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  evaluation_id     UUID NOT NULL REFERENCES evaluations(id) ON DELETE RESTRICT,
  criterion_id      UUID NOT NULL REFERENCES evaluation_criteria(id) ON DELETE RESTRICT,
  evidence_type     TEXT NOT NULL,
  observed_evidence TEXT,
  expected_evidence TEXT,
  source            TEXT,
  metadata          JSONB,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- =============================================================
-- TABLE 11 — skill_gaps
-- =============================================================
-- Traceable to the evaluation and criterion that produced it.
-- severity: 'low' | 'medium' | 'high' | 'critical'
-- =============================================================

CREATE TABLE IF NOT EXISTS skill_gaps (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  evaluation_id  UUID NOT NULL REFERENCES evaluations(id) ON DELETE RESTRICT,
  criterion_id   UUID NOT NULL REFERENCES evaluation_criteria(id) ON DELETE RESTRICT,
  gap_name       TEXT NOT NULL,
  description    TEXT,
  severity       TEXT NOT NULL DEFAULT 'medium',
  recommendation TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT skill_gaps_severity_check
    CHECK (severity IN ('low', 'medium', 'high', 'critical'))
);


-- =============================================================
-- TABLE 12 — practice_tasks
-- =============================================================
-- Connected to the skill gap that generated it.
-- status: 'assigned' | 'in_progress' | 'completed' | 'skipped'
-- =============================================================

CREATE TABLE IF NOT EXISTS practice_tasks (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_gap_id     UUID NOT NULL REFERENCES skill_gaps(id) ON DELETE RESTRICT,
  title            TEXT NOT NULL,
  description      TEXT,
  instructions     TEXT,
  expected_outcome TEXT,
  status           TEXT NOT NULL DEFAULT 'assigned',
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at     TIMESTAMPTZ,
  CONSTRAINT practice_tasks_status_check
    CHECK (status IN ('assigned', 'in_progress', 'completed', 'skipped'))
);


-- =============================================================
-- TABLE 13 — skill_profiles
-- =============================================================
-- Aggregated learner profile for a skill after completing levels.
-- =============================================================

CREATE TABLE IF NOT EXISTS skill_profiles (
  id            UUID     PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID     NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  skill_id      UUID     NOT NULL REFERENCES skills(id) ON DELETE RESTRICT,
  overall_level INTEGER,
  overall_score NUMERIC(5,2),
  summary       TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, skill_id),
  CONSTRAINT skill_profiles_level_check
    CHECK (overall_level IS NULL OR overall_level IN (1, 2, 3)),
  CONSTRAINT skill_profiles_score_range
    CHECK (overall_score IS NULL OR (overall_score >= 0 AND overall_score <= 100))
);


-- =============================================================
-- TABLE 14 — skill_gap_profiles
-- =============================================================
-- Aggregated skill-gap profile for a user's skill.
-- severity: 'low' | 'medium' | 'high' | 'critical'
-- =============================================================

CREATE TABLE IF NOT EXISTS skill_gap_profiles (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id              UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  skill_id             UUID NOT NULL REFERENCES skills(id) ON DELETE RESTRICT,
  gap_name             TEXT NOT NULL,
  description          TEXT,
  severity             TEXT NOT NULL DEFAULT 'medium',
  evidence_summary     TEXT,
  recommended_practice TEXT,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT skill_gap_profiles_severity_check
    CHECK (severity IN ('low', 'medium', 'high', 'critical'))
);


-- =============================================================
-- TABLE 15 — score_appeals
-- =============================================================
-- An appeal belongs to a specific evaluation for a specific user.
-- The original evaluation MUST NOT be modified when an appeal exists.
-- status: 'pending' | 'under_review' | 'accepted' | 'rejected'
-- =============================================================

CREATE TABLE IF NOT EXISTS score_appeals (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  evaluation_id UUID NOT NULL REFERENCES evaluations(id) ON DELETE RESTRICT,
  reason        TEXT NOT NULL,
  status        TEXT NOT NULL DEFAULT 'pending',
  response      TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT score_appeals_status_check
    CHECK (status IN ('pending', 'under_review', 'accepted', 'rejected'))
);


-- =============================================================
-- UPDATED_AT TRIGGER FUNCTION
-- =============================================================
-- Automatically updates the updated_at column on row changes.
-- =============================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply the trigger to all tables that have updated_at
DO $$
DECLARE
  t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'users',
    'courses',
    'skills',
    'skill_levels',
    'tasks',
    'skill_gaps',
    'skill_profiles',
    'skill_gap_profiles',
    'score_appeals'
  ]
  LOOP
    EXECUTE format(
      'DROP TRIGGER IF EXISTS set_updated_at ON %I;
       CREATE TRIGGER set_updated_at
       BEFORE UPDATE ON %I
       FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();',
      t, t
    );
  END LOOP;
END;
$$;


-- =============================================================
-- ROW LEVEL SECURITY
-- =============================================================
-- RLS is ENABLED on all tables.
--
-- NOTE: Authentication (Clerk / Supabase Auth) is NOT yet
-- implemented. User-specific RLS policies that reference
-- auth.uid() cannot be safely applied yet.
--
-- Approach:
-- - RLS is enabled so the tables are secured by default.
-- - A permissive service-role bypass exists (Supabase default).
-- - Per-user policies will be added in a later backend part
--   once authentication is integrated.
-- =============================================================

ALTER TABLE users               ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses             ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills              ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_levels        ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks               ENABLE ROW LEVEL SECURITY;
ALTER TABLE attempts            ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions         ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluations         ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluation_criteria ENABLE ROW LEVEL SECURITY;
ALTER TABLE evidence            ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_gaps          ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_tasks      ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_profiles      ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_gap_profiles  ENABLE ROW LEVEL SECURITY;
ALTER TABLE score_appeals       ENABLE ROW LEVEL SECURITY;

-- Public read access for reference/catalogue tables
-- (courses, skills, skill_levels, tasks are not user-specific)
DROP POLICY IF EXISTS "Public read courses" ON courses;
CREATE POLICY "Public read courses"
  ON courses FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read skills" ON skills;
CREATE POLICY "Public read skills"
  ON skills FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read skill_levels" ON skill_levels;
CREATE POLICY "Public read skill_levels"
  ON skill_levels FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read tasks" ON tasks;
CREATE POLICY "Public read tasks"
  ON tasks FOR SELECT USING (true);

-- NOTE: Row-level policies for user-specific tables (attempts,
-- submissions, evaluations, evidence, skill_gaps, practice_tasks,
-- skill_profiles, skill_gap_profiles, score_appeals, users)
-- will be added in the authentication backend part.
-- The service role key (used server-side only) bypasses RLS,
-- so the backend will use the service role key for all
-- write operations until per-user policies are in place.
