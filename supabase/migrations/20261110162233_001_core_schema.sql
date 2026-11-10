/*
# CCM Iringa Management Portal — Core Schema

## Overview
Creates the foundational database schema for the CCM Iringa Management Portal.
Multi-user, role-based system where:
- Super admins manage universities (vyuo) and oversee everything.
- University leaders (m/kiti, etc.) manage members within their university.
- Members can self-register, select their university, and receive a unique member number.

## New Tables (in dependency order)
1. universities — Higher education institutions
2. user_roles — Maps auth users to role + university (FK → universities, auth.users)
3. members — Registered CCM members (FK → universities, auth.users)
4. events — CCM events (FK → universities, auth.users)
5. event_attendance — Attendance records (FK → events, members, auth.users)
6. audit_logs — Administrative action tracking (FK → auth.users)

## Security
- All tables have RLS enabled with role-based policies.
- Tables created first, then RLS + policies applied (avoids FK ordering issues).
- generate_member_number() is SECURITY DEFINER.
*/

-- ============================================================================
-- ENUM TYPES
-- ============================================================================

DO $$ BEGIN
  CREATE TYPE member_status AS ENUM ('active', 'inactive', 'pending');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE user_role_type AS ENUM ('super_admin', 'university_admin', 'university_leader', 'member');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE event_status AS ENUM ('upcoming', 'ongoing', 'completed', 'cancelled');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ============================================================================
-- TABLE CREATION (in FK dependency order)
-- ============================================================================

-- 1. universities (no FK deps)
CREATE TABLE IF NOT EXISTS universities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  code text NOT NULL UNIQUE,
  district text NOT NULL,
  phone text,
  email text,
  address text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 2. user_roles (FK → universities, auth.users)
CREATE TABLE IF NOT EXISTS user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role_type NOT NULL DEFAULT 'member',
  university_id uuid REFERENCES universities(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 3. members (FK → universities, auth.users)
CREATE TABLE IF NOT EXISTS members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  university_id uuid NOT NULL REFERENCES universities(id) ON DELETE RESTRICT,
  full_name text NOT NULL,
  registration_number text UNIQUE,
  phone text,
  email text,
  year_of_study int,
  consent_given boolean NOT NULL DEFAULT false,
  consent_date timestamptz,
  status member_status NOT NULL DEFAULT 'pending',
  registered_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 4. events (FK → universities, auth.users)
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  event_date date NOT NULL,
  event_time time,
  location text,
  university_id uuid REFERENCES universities(id) ON DELETE SET NULL,
  expected_attendance int,
  status event_status NOT NULL DEFAULT 'upcoming',
  created_by uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 5. event_attendance (FK → events, members, auth.users)
CREATE TABLE IF NOT EXISTS event_attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  member_id uuid NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  checked_in boolean NOT NULL DEFAULT false,
  check_in_time timestamptz,
  recorded_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(event_id, member_id)
);

-- 6. audit_logs (FK → auth.users)
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action text NOT NULL,
  module text NOT NULL,
  details text,
  entity_type text,
  entity_id uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_members_university ON members(university_id);
CREATE INDEX IF NOT EXISTS idx_members_status ON members(status);
CREATE INDEX IF NOT EXISTS idx_members_registration_number ON members(registration_number);
CREATE INDEX IF NOT EXISTS idx_user_roles_user ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_university ON user_roles(university_id);
CREATE INDEX IF NOT EXISTS idx_events_university ON events(university_id);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_event_attendance_event ON event_attendance(event_id);
CREATE INDEX IF NOT EXISTS idx_event_attendance_member ON event_attendance(member_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_universities_code ON universities(code);
CREATE INDEX IF NOT EXISTS idx_universities_active ON universities(is_active);

-- ============================================================================
-- RLS + GRANTS + POLICIES
-- ============================================================================

-- universities
ALTER TABLE universities ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON universities TO authenticated;

DROP POLICY IF EXISTS "read_universities" ON universities;
CREATE POLICY "read_universities" ON universities FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "insert_universities" ON universities;
CREATE POLICY "insert_universities" ON universities FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'super_admin')
  );

DROP POLICY IF EXISTS "update_universities" ON universities;
CREATE POLICY "update_universities" ON universities FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'super_admin')
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'super_admin')
  );

DROP POLICY IF EXISTS "delete_universities" ON universities;
CREATE POLICY "delete_universities" ON universities FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'super_admin')
  );

-- user_roles
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON user_roles TO authenticated;

DROP POLICY IF EXISTS "read_user_roles" ON user_roles;
CREATE POLICY "read_user_roles" ON user_roles FOR SELECT
  TO authenticated USING (
    user_id = auth.uid()
    OR
    EXISTS (SELECT 1 FROM user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'super_admin')
  );

DROP POLICY IF EXISTS "insert_user_roles" ON user_roles;
CREATE POLICY "insert_user_roles" ON user_roles FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'super_admin')
  );

DROP POLICY IF EXISTS "update_user_roles" ON user_roles;
CREATE POLICY "update_user_roles" ON user_roles FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'super_admin')
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'super_admin')
  );

DROP POLICY IF EXISTS "delete_user_roles" ON user_roles;
CREATE POLICY "delete_user_roles" ON user_roles FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'super_admin')
  );

-- members
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON members TO authenticated;

DROP POLICY IF EXISTS "read_members" ON members;
CREATE POLICY "read_members" ON members FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'super_admin')
    OR
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid()
        AND ur.university_id = members.university_id
        AND ur.role IN ('university_admin', 'university_leader')
    )
  );

DROP POLICY IF EXISTS "insert_members" ON members;
CREATE POLICY "insert_members" ON members FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'super_admin')
    OR
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid()
        AND ur.university_id = members.university_id
        AND ur.role IN ('university_admin', 'university_leader')
    )
  );

DROP POLICY IF EXISTS "update_members" ON members;
CREATE POLICY "update_members" ON members FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'super_admin')
    OR
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid()
        AND ur.university_id = members.university_id
        AND ur.role IN ('university_admin', 'university_leader')
    )
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'super_admin')
    OR
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid()
        AND ur.university_id = members.university_id
        AND ur.role IN ('university_admin', 'university_leader')
    )
  );

DROP POLICY IF EXISTS "delete_members" ON members;
CREATE POLICY "delete_members" ON members FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'super_admin')
    OR
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid()
        AND ur.university_id = members.university_id
        AND ur.role = 'university_admin'
    )
  );

-- events
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON events TO authenticated;

DROP POLICY IF EXISTS "read_events" ON events;
CREATE POLICY "read_events" ON events FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "insert_events" ON events;
CREATE POLICY "insert_events" ON events FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'super_admin')
    OR
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid()
        AND ur.university_id = events.university_id
        AND ur.role IN ('university_admin', 'university_leader')
    )
  );

DROP POLICY IF EXISTS "update_events" ON events;
CREATE POLICY "update_events" ON events FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'super_admin')
    OR
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid()
        AND ur.university_id = events.university_id
        AND ur.role = 'university_admin'
    )
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'super_admin')
    OR
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid()
        AND ur.university_id = events.university_id
        AND ur.role = 'university_admin'
    )
  );

DROP POLICY IF EXISTS "delete_events" ON events;
CREATE POLICY "delete_events" ON events FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'super_admin')
    OR
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid()
        AND ur.university_id = events.university_id
        AND ur.role = 'university_admin'
    )
  );

-- event_attendance
ALTER TABLE event_attendance ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON event_attendance TO authenticated;

DROP POLICY IF EXISTS "read_event_attendance" ON event_attendance;
CREATE POLICY "read_event_attendance" ON event_attendance FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'super_admin')
    OR
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN events e ON e.id = event_attendance.event_id
      WHERE ur.user_id = auth.uid()
        AND ur.university_id = e.university_id
        AND ur.role IN ('university_admin', 'university_leader')
    )
  );

DROP POLICY IF EXISTS "insert_event_attendance" ON event_attendance;
CREATE POLICY "insert_event_attendance" ON event_attendance FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'super_admin')
    OR
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN events e ON e.id = event_attendance.event_id
      WHERE ur.user_id = auth.uid()
        AND ur.university_id = e.university_id
        AND ur.role IN ('university_admin', 'university_leader')
    )
  );

DROP POLICY IF EXISTS "update_event_attendance" ON event_attendance;
CREATE POLICY "update_event_attendance" ON event_attendance FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'super_admin')
    OR
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN events e ON e.id = event_attendance.event_id
      WHERE ur.user_id = auth.uid()
        AND ur.university_id = e.university_id
        AND ur.role IN ('university_admin', 'university_leader')
    )
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'super_admin')
    OR
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN events e ON e.id = event_attendance.event_id
      WHERE ur.user_id = auth.uid()
        AND ur.university_id = e.university_id
        AND ur.role IN ('university_admin', 'university_leader')
    )
  );

DROP POLICY IF EXISTS "delete_event_attendance" ON event_attendance;
CREATE POLICY "delete_event_attendance" ON event_attendance FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'super_admin')
    OR
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN events e ON e.id = event_attendance.event_id
      WHERE ur.user_id = auth.uid()
        AND ur.university_id = e.university_id
        AND ur.role = 'university_admin'
    )
  );

-- audit_logs
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT ON audit_logs TO authenticated;

DROP POLICY IF EXISTS "read_audit_logs" ON audit_logs;
CREATE POLICY "read_audit_logs" ON audit_logs FOR SELECT
  TO authenticated USING (
    user_id = auth.uid()
    OR
    EXISTS (SELECT 1 FROM user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'super_admin')
  );

DROP POLICY IF EXISTS "insert_audit_logs" ON audit_logs;
CREATE POLICY "insert_audit_logs" ON audit_logs FOR INSERT
  TO authenticated WITH CHECK (true);

-- ============================================================================
-- MEMBER NUMBER GENERATION (SECURITY DEFINER)
-- ============================================================================

CREATE SEQUENCE IF NOT EXISTS member_number_seq START 1;

CREATE OR REPLACE FUNCTION generate_member_number(uni_code text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  next_val bigint;
  member_no text;
BEGIN
  next_val := nextval('member_number_seq');
  member_no := 'CCM-' || UPPER(uni_code) || '-' || lpad(next_val::text, 4, '0');
  RETURN member_no;
END;
$$;

REVOKE EXECUTE ON FUNCTION generate_member_number(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION generate_member_number(text) TO authenticated;
