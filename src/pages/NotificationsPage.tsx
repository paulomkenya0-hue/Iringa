import { Bell, CheckCircle2, AlertCircle, Info, Calendar, Users, Settings, Trash2 } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import Badge from '@/components/ui/Badge';

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  type: 'success' | 'warning' | 'info' | 'event';
  read: boolean;
}

const NOTIFICATIONS: Notification[] = [
  { id: 1, title: 'Tukio Jipya Limeongezwa', message: 'Mkutano Mkuu wa Moka umepangwa kwa tarehe 15 Novemba 2026.', time: 'Dakika 30 zilizopita', type: 'event', read: false },
  { id: 2, title: 'Mtumiaji Mpya Anasubiri Idhini', message: 'David Mwakyeme amejiunga na anasubiri idhini yako.', time: 'Saa 2 zilizopita', type: 'warning', read: false },
  { id: 3, title: 'Riporti ya Mwezi Imekamilika', message: 'Riporti ya mahudhurio ya mwezi Novemba iko tayari kwa kupakua.', time: 'Saa 5 zilizopita', type: 'success', read: false },
  { id: 4, title: 'Mipangilio Imebadilishwa', message: 'Uthibitishaji wa hatua mbili umewashwa kwa watumiaji wote.', time: 'Jana, 16:45', type: 'info', read: true },
  { id: 5, title: 'Mahudhurio Yamewekwa', message: 'Washiriki 120 wamesajili mahudhurio kwa Mafunzo ya Kada.', time: 'Jana, 14:20', type: 'success', read: true },
  { id: 6, title: 'Taasisi Imesasishwa', message: 'Taarifa za Ofisi ya Wilaya ya Mufindi zimesasishwa.', time: '2 siku zilizopita', type: 'info', read: true },
];

const typeConfig = {
  success: { icon: CheckCircle2, bg: 'bg-ccm-green-50', color: 'text-ccm-green-600', badge: 'green' as const },
  warning: { icon: AlertCircle, bg: 'bg-ccm-gold-50', color: 'text-ccm-gold-600', badge: 'gold' as const },
  info: { icon: Info, bg: 'bg-info-50', color: 'text-info-600', badge: 'blue' as const },
  event: { icon: Calendar, bg: 'bg-ccm-green-50', color: 'text-ccm-green-600', badge: 'green' as const },
};

export default function NotificationsPage() {
  return (
    <div>
      <PageHeader
        title="Kituo cha Arifa"
        description="Pata arifa zote za mfumo mahali pamoja"
        action={
          <button className="btn-secondary">
            <CheckCircle2 size={16} /> Alama Zote Zimesomwa
          </button>
        }
      />

      {/* Filter tabs */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto no-scrollbar">
        <button className="px-4 py-2 rounded-lg text-sm font-medium bg-ccm-green-600 text-white whitespace-nowrap">
          Zote ({NOTIFICATIONS.length})
        </button>
        <button className="px-4 py-2 rounded-lg text-sm font-medium bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 whitespace-nowrap">
          Hazijasomwa ({NOTIFICATIONS.filter((n) => !n.read).length})
        </button>
        <button className="px-4 py-2 rounded-lg text-sm font-medium bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 whitespace-nowrap">
          Zimesomwa ({NOTIFICATIONS.filter((n) => n.read).length})
        </button>
      </div>

      {/* Notifications list */}
      <div className="space-y-3">
        {NOTIFICATIONS.map((notif) => {
          const config = typeConfig[notif.type];
          const Icon = config.icon;
          return (
            <div
              key={notif.id}
              className={`card p-4 flex items-start gap-4 hover:shadow-card-hover transition-shadow ${
                !notif.read ? 'border-l-4 border-l-ccm-green-500' : ''
              }`}
            >
              <div className={`w-10 h-10 rounded-xl ${config.bg} ${config.color} flex items-center justify-center flex-shrink-0`}>
                <Icon size={20} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-semibold text-gray-900">{notif.title}</h3>
                  {!notif.read && <span className="w-2 h-2 bg-ccm-green-500 rounded-full flex-shrink-0" />}
                </div>
                <p className="text-sm text-gray-600">{notif.message}</p>
                <p className="text-xs text-gray-400 mt-1.5">{notif.time}</p>
              </div>

              <button className="p-1.5 rounded-lg text-gray-300 hover:text-error-500 hover:bg-error-50 transition-colors flex-shrink-0">
                <Trash2 size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
