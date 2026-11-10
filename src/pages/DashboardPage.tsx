import { useState, useEffect, useCallback } from 'react';
import {
  GraduationCap,
  Users,
  CalendarDays,
  ClipboardCheck,
  TrendingUp,
  MapPin,
  Clock,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import StatCard from '@/components/ui/StatCard';
import Badge from '@/components/ui/Badge';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import type { Event, AuditLog } from '@/types/database';

interface DashboardPageProps {
  userName: string;
}

export default function DashboardPage({ userName }: DashboardPageProps) {
  const { userRole, userUniversity } = useAuth();
  const [stats, setStats] = useState({
    universities: 0,
    members: 0,
    upcomingEvents: 0,
    attendance: 0,
  });
  const [recentEvents, setRecentEvents] = useState<Event[]>([]);
  const [recentLogs, setRecentLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);

    // Fetch universities count
    const { count: univCount } = await supabase
      .from('universities')
      .select('*', { count: 'exact', head: true });

    // Fetch members count (scoped for university users)
    let membersQuery = supabase.from('members').select('*', { count: 'exact', head: true });
    if (userRole !== 'super_admin' && userUniversity?.id) {
      membersQuery = membersQuery.eq('university_id', userUniversity.id);
    }
    const { count: memberCount } = await membersQuery;

    // Fetch upcoming events
    let eventsQuery = supabase
      .from('events')
      .select('*')
      .eq('status', 'upcoming')
      .order('event_date', { ascending: true })
      .limit(5);
    if (userRole !== 'super_admin' && userUniversity?.id) {
      eventsQuery = eventsQuery.eq('university_id', userUniversity.id);
    }
    const { data: events } = await eventsQuery;

    // Fetch upcoming events count
    let eventsCountQuery = supabase
      .from('events')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'upcoming');
    if (userRole !== 'super_admin' && userUniversity?.id) {
      eventsCountQuery = eventsCountQuery.eq('university_id', userUniversity.id);
    }
    const { count: upcomingCount } = await eventsCountQuery;

    // Fetch recent audit logs (super_admin only)
    let logs: AuditLog[] = [];
    if (userRole === 'super_admin') {
      const { data: logData } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      logs = (logData as AuditLog[]) || [];
    }

    setStats({
      universities: univCount || 0,
      members: memberCount || 0,
      upcomingEvents: upcomingCount || 0,
      attendance: 0,
    });
    setRecentEvents((events as Event[]) || []);
    setRecentLogs(logs);
    setLoading(false);
  }, [userRole, userUniversity]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={28} className="animate-spin text-ccm-green-600" />
      </div>
    );
  }

  const today = new Date().toLocaleDateString('sw-TZ', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="card p-6 bg-gradient-to-r from-ccm-green-700 to-ccm-green-800 border-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-ccm-green-100 text-sm">Karibu tena,</p>
            <h2 className="text-2xl font-bold text-white mt-1">{userName}</h2>
            <p className="text-ccm-green-100 text-sm mt-2">
              {userRole === 'super_admin'
                ? 'Hapa kuna muhtasari wa mfumo mzima wa CCM Iringa.'
                : `Hapa kuna muhtasari wa ${userUniversity?.name || 'chuo chako'}.`}
            </p>
          </div>
          <div className="flex items-center gap-2 text-ccm-green-50 text-sm">
            <Clock size={16} />
            <span>{today}</span>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {userRole === 'super_admin' && (
          <StatCard
            label="Vyuo Vilivyosajiliwa"
            value={stats.universities}
            icon={GraduationCap}
            iconColor="green"
          />
        )}
        <StatCard
          label="Wanachama Wote"
          value={stats.members}
          icon={Users}
          iconColor="blue"
        />
        <StatCard
          label="Matukio Yanayokuja"
          value={stats.upcomingEvents}
          icon={CalendarDays}
          iconColor="gold"
        />
        <StatCard
          label="Mahudhurio ya Mwezi"
          value={stats.attendance}
          icon={ClipboardCheck}
          iconColor="green"
        />
      </div>

      {/* Recent events */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-gray-900">Matukio Yanayokuja</h3>
        </div>

        {recentEvents.length === 0 ? (
          <p className="text-sm text-gray-400 py-8 text-center">
            Hakuna matukio yanayokuja kwa sasa.
          </p>
        ) : (
          <div className="space-y-3">
            {recentEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="w-11 h-11 rounded-xl flex flex-col items-center justify-center flex-shrink-0 bg-ccm-green-50 text-ccm-green-700">
                  <CalendarDays size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{event.title}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    {event.location && (
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <MapPin size={12} /> {event.location}
                      </span>
                    )}
                    <span className="text-xs text-gray-400">{event.event_date}</span>
                  </div>
                </div>
                <Badge variant="green">Kinafuata</Badge>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent activity (super_admin only) */}
      {userRole === 'super_admin' && (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-gray-900">Shughuli za Karibuni</h3>
            <TrendingUp size={20} className="text-gray-400" />
          </div>

          {recentLogs.length === 0 ? (
            <p className="text-sm text-gray-400 py-8 text-center">
              Hakuna shughuli za hivi karibuni.
            </p>
          ) : (
            <div className="space-y-1">
              {recentLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-3 py-2.5">
                  <div className="w-8 h-8 rounded-full bg-ccm-green-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-semibold text-ccm-green-700">
                      {log.module.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700">{log.action}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(log.created_at).toLocaleString('sw-TZ')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
