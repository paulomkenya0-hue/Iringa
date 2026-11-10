import { ScrollText, Search, Download, CheckCircle2, Edit2, Trash2, LogIn, Settings, Plus } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import Badge from '@/components/ui/Badge';

interface AuditLog {
  id: number;
  user: string;
  action: string;
  module: string;
  details: string;
  timestamp: string;
  type: 'create' | 'update' | 'delete' | 'login' | 'settings';
}

const LOGS: AuditLog[] = [
  { id: 1, user: 'Joseph Mbowe', action: 'Alibadilisha mipangilio ya mfumo', module: 'Mipangilio', details: 'Aliwasha uthibitishaji wa hatua mbili', timestamp: '2026-11-10 08:45:22', type: 'settings' },
  { id: 2, user: 'Anna Mushi', action: 'Aliingia kwenye mfumo', module: 'Uthibitishaji', details: 'Kifaa: Chrome / Windows', timestamp: '2026-11-10 07:15:03', type: 'login' },
  { id: 3, user: 'Grace Kimaro', action: 'Aliunda taasisi mpya', module: 'Taasisi', details: 'Ofisi ya Kata ya Mlandege', timestamp: '2026-11-10 06:30:11', type: 'create' },
  { id: 4, user: 'Peter Malley', action: 'Alihariri mtumiaji', module: 'Watumiaji', details: 'Alibadilisha jukumu la Sarah Joseph', timestamp: '2026-11-09 16:22:45', type: 'update' },
  { id: 5, user: 'Joseph Mbowe', action: 'Alifuta tukio', module: 'Matukio', details: 'Mkutano wa Dodoso wa Wilaya', timestamp: '2026-11-09 14:10:30', type: 'delete' },
  { id: 6, user: 'Anna Mushi', action: 'Aliunda mtumiaji mpya', module: 'Watumiaji', details: 'David Mwakyeme', timestamp: '2026-11-09 11:05:18', type: 'create' },
  { id: 7, user: 'Grace Kimaro', action: 'Alihariri taasisi', module: 'Taasisi', details: 'Ofisi ya Wilaya ya Mufindi', timestamp: '2026-11-08 15:40:22', type: 'update' },
  { id: 8, user: 'Peter Malley', action: 'Aliingia kwenye mfumo', module: 'Uthibitishaji', details: 'Kifaa: Safari / iPhone', timestamp: '2026-11-08 09:20:55', type: 'login' },
];

const typeConfig = {
  create: { variant: 'green' as const, icon: Plus, label: 'Uundaji' },
  update: { variant: 'blue' as const, icon: Edit2, label: 'Uharibifu' },
  delete: { variant: 'red' as const, icon: Trash2, label: 'Ufutaji' },
  login: { variant: 'gold' as const, icon: LogIn, label: 'Kuingia' },
  settings: { variant: 'gray' as const, icon: Settings, label: 'Mipangilio' },
};

export default function AuditPage() {
  return (
    <div>
      <PageHeader
        title="Kumbukumbu za Ukaguzi"
        description="Fuata kila kitendo kinachofanywa kwenye mfumo kwa ajili ya uwazi na usalama"
        action={
          <button className="btn-secondary">
            <Download size={16} /> Pakua Kumbukumbu
          </button>
        }
      />

      {/* Filter */}
      <div className="card p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tafuta kumbukumbu..."
              className="input pl-10"
            />
          </div>
          <select className="input pr-8 appearance-none cursor-pointer min-w-[160px]">
            <option>Aina Zote</option>
            <option>Uundaji</option>
            <option>Uharibifu</option>
            <option>Ufutaji</option>
            <option>Kuingia</option>
            <option>Mipangilio</option>
          </select>
          <select className="input pr-8 appearance-none cursor-pointer min-w-[140px]">
            <option>Leo</option>
            <option>Wiki Hii</option>
            <option>Mwezi Huu</option>
            <option>Kila Wakati</option>
          </select>
        </div>
      </div>

      {/* Logs timeline */}
      <div className="card p-6">
        <div className="space-y-1">
          {LOGS.map((log, idx) => {
            const config = typeConfig[log.type];
            const Icon = config.icon;
            return (
              <div key={log.id} className="flex gap-4">
                {/* Timeline */}
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center ${
                    log.type === 'delete' ? 'bg-error-50 text-error-600' :
                    log.type === 'create' ? 'bg-ccm-green-50 text-ccm-green-600' :
                    log.type === 'login' ? 'bg-ccm-gold-50 text-ccm-gold-600' :
                    log.type === 'update' ? 'bg-info-50 text-info-600' :
                    'bg-gray-100 text-gray-500'
                  }`}>
                    <Icon size={16} />
                  </div>
                  {idx < LOGS.length - 1 && <div className="w-px flex-1 bg-gray-200 my-1" />}
                </div>

                {/* Content */}
                <div className="flex-1 pb-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900 text-sm">{log.user}</span>
                      <Badge variant={config.variant}>{config.label}</Badge>
                    </div>
                    <span className="text-xs text-gray-400">{log.timestamp}</span>
                  </div>
                  <p className="text-sm text-gray-600">{log.action}</p>
                  <div className="mt-1.5 flex items-center gap-2 text-xs text-gray-400">
                    <span className="px-2 py-0.5 bg-gray-50 rounded font-medium text-gray-500">{log.module}</span>
                    <span>{log.details}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
