-- =============================================================
-- ReProof — Knowledge Check Schema
-- Migration: 003_knowledge_check_tables.sql
-- =============================================================

-- Table 1: knowledge_questions
CREATE TABLE IF NOT EXISTS knowledge_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id),
  skill_id UUID REFERENCES skills(id),
  skill_level_id UUID REFERENCES skill_levels(id),
  level_number INTEGER NOT NULL,
  question_text TEXT NOT NULL,
  code_snippet TEXT,
  question_type TEXT NOT NULL DEFAULT 'multiple_choice',
  options JSONB NOT NULL,
  correct_answer TEXT NOT NULL,
  explanation TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table 2: knowledge_attempts
CREATE TABLE IF NOT EXISTS knowledge_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  course_id UUID REFERENCES courses(id),
  skill_id UUID REFERENCES skills(id),
  skill_level_id UUID REFERENCES skill_levels(id),
  domain_slug TEXT NOT NULL,
  skill_slug TEXT NOT NULL,
  level_number INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'in_progress', -- 'not_started', 'in_progress', 'submitted', 'evaluated'
  score NUMERIC(5,2),
  total_questions INTEGER NOT NULL,
  correct_answers INTEGER,
  percentage NUMERIC(5,2),
  answers JSONB,
  integrity_signals JSONB,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  submitted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_kq_skill_level ON knowledge_questions(skill_id, level_number);
CREATE INDEX IF NOT EXISTS idx_ka_user_status ON knowledge_attempts(user_id, status);
