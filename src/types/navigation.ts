import {
  LayoutDashboard,
  GraduationCap,
  Users,
  ShieldCheck,
  CalendarDays,
  ClipboardCheck,
  FileBarChart,
  ScrollText,
  Settings,
  Bell,
} from 'lucide-react';

export type AppRole = 'super_admin' | 'university_admin' | 'university_leader' | 'member';

export interface RoleInfo {
  key: AppRole;
  label: string;
  description: string;
}

export const ROLES: Record<AppRole, RoleInfo> = {
  super_admin: {
    key: 'super_admin',
    label: 'Msimamizi Mkuu',
    description: 'Upenia kamili wa mfumo mzima',
  },
  university_admin: {
    key: 'university_admin',
    label: 'Msimamizi wa Chuo',
    description: 'Usimamizi wa chuo kimoja',
  },
  university_leader: {
    key: 'university_leader',
    label: 'Kiongozi wa Chuo',
    description: 'Kusajili na kuongeza wanachama wa chuo',
  },
  member: {
    key: 'member',
    label: 'Mwanachama',
    description: 'Kuona taarifa zake binafsi tu',
  },
};

export interface NavItem {
  id: string;
  label: string;
  icon: typeof LayoutDashboard;
  roles: AppRole[];
}

export const NAV_ITEMS: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashibodi',
    icon: LayoutDashboard,
    roles: ['super_admin', 'university_admin', 'university_leader', 'member'],
  },
  {
    id: 'universities',
    label: 'Vyuo',
    icon: GraduationCap,
    roles: ['super_admin'],
  },
  {
    id: 'members',
    label: 'Wanachama',
    icon: Users,
    roles: ['super_admin', 'university_admin', 'university_leader'],
  },
  {
    id: 'users',
    label: 'Watumiaji',
    icon: Users,
    roles: ['super_admin'],
  },
  {
    id: 'roles',
    label: 'Majukumu na Ruhusa',
    icon: ShieldCheck,
    roles: ['super_admin'],
  },
  {
    id: 'events',
    label: 'Matukio',
    icon: CalendarDays,
    roles: ['super_admin', 'university_admin', 'university_leader', 'member'],
  },
  {
    id: 'attendance',
    label: 'Mahudhurio',
    icon: ClipboardCheck,
    roles: ['super_admin', 'university_admin', 'university_leader'],
  },
  {
    id: 'reports',
    label: 'Riporti',
    icon: FileBarChart,
    roles: ['super_admin', 'university_admin', 'member'],
  },
  {
    id: 'audit',
    label: 'Kumbukumbu za Ukaguzi',
    icon: ScrollText,
    roles: ['super_admin'],
  },
  {
    id: 'settings',
    label: 'Mipangilio',
    icon: Settings,
    roles: ['super_admin', 'university_admin'],
  },
  {
    id: 'notifications',
    label: 'Arifa',
    icon: Bell,
    roles: ['super_admin', 'university_admin', 'university_leader', 'member'],
  },
];

export const APP_NAME = 'CCM Iringa';
export const APP_FULL_NAME = 'Mfumo wa Usimamizi';
export const APP_REGION = 'Mkoa wa Iringa';
