export type MemberStatus = 'active' | 'inactive' | 'pending';
export type UserRoleType = 'super_admin' | 'university_admin' | 'university_leader' | 'member';
export type EventStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';

export interface University {
  id: string;
  name: string;
  code: string;
  district: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Member {
  id: string;
  university_id: string;
  full_name: string;
  registration_number: string | null;
  phone: string | null;
  email: string | null;
  year_of_study: number | null;
  consent_given: boolean;
  consent_date: string | null;
  status: MemberStatus;
  registered_by: string | null;
  created_at: string;
  updated_at: string;
  // Joined relations
  university?: University;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: UserRoleType;
  university_id: string | null;
  created_at: string;
  updated_at: string;
  // Joined relations
  university?: University;
}

export interface Event {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  event_time: string | null;
  location: string | null;
  university_id: string | null;
  expected_attendance: number | null;
  status: EventStatus;
  created_by: string;
  created_at: string;
  updated_at: string;
  // Joined relations
  university?: University;
}

export interface EventAttendance {
  id: string;
  event_id: string;
  member_id: string;
  checked_in: boolean;
  check_in_time: string | null;
  recorded_by: string | null;
  created_at: string;
  // Joined relations
  event?: Event;
  member?: Member;
}

export interface AuditLog {
  id: string;
  user_id: string | null;
  action: string;
  module: string;
  details: string | null;
  entity_type: string | null;
  entity_id: string | null;
  created_at: string;
}
