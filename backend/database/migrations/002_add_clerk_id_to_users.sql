-- =============================================================
-- ReProof — Add Clerk User ID to Users Table
-- Migration: 002_add_clerk_id_to_users.sql
-- =============================================================
-- Run this file in the Supabase SQL editor.
-- Idempotent: adds clerk_id column to users table if not exists.
-- =============================================================

ALTER TABLE users
ADD COLUMN IF NOT EXISTS clerk_id TEXT UNIQUE;
