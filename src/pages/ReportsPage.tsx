import { Download, FileBarChart, Users, Building2, CalendarDays, ClipboardCheck, TrendingUp, Filter } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import Badge from '@/components/ui/Badge';

export default function ReportsPage() {
  const reports = [
    { id: 1, title: 'Riporti ya Taasisi', description: 'Muhtasari wa taasisi zote zilizosajiliwa', icon: Building2, count: '40 taasisi', date: 'Nov 2026', format: 'PDF' },
    { id: 2, title: 'Riporti ya Watumiaji', description: 'Orodha ya watumiaji na majukumu yao', icon: Users, count: '156 watumiaji', date: 'Nov 2026', format: 'Excel' },
    { id: 3, title: 'Riporti ya Matukio', description: 'Matukio yote ya mwezi na hali yao', icon: CalendarDays, count: '25 matukio', date: 'Nov 2026', format: 'PDF' },
    { id: 4, title: 'Riporti ya Mahudhurio', description: 'Takwimu za mahudhurio ya matukio', icon: ClipboardCheck, count: '1,983 mahudhuria', date: 'Nov 2026', format: 'Excel' },
    { id: 5, title: 'Riporti ya Wilaya', description: 'Uchambuzi wa shughuli kwa kila wilaya', icon: FileBarChart, count: '5 wilaya', date: 'Nov 2026', format: 'PDF' },
    { id: 6, title: 'Riporti ya Mwezi Mzima', description: 'Muhtasari kamili wa mwezi mzima', icon: TrendingUp, count: 'Nov 2026', date: 'Nov 2026', format: 'PDF' },
  ];

  return (
    <div>
      <PageHeader
        title="Riporti za Kiutawala"
        description="Pakua riporti mbalimbali za kiutawala za CCM Mkoa wa Iringa"
        action={
          <button className="btn-secondary">
            <Filter size={16} /> Chuja kwa Tarehe
          </button>
        }
      />

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="card p-4 text-center">
          <p className="text-3xl font-bold text-ccm-green-700">40</p>
          <p className="text-xs text-gray-500 mt-1">Taasisi</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-3xl font-bold text-info-600">156</p>
          <p className="text-xs text-gray-500 mt-1">Watumiaji</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-3xl font-bold text-ccm-gold-600">25</p>
          <p className="text-xs text-gray-500 mt-1">Matukio</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-3xl font-bold text-gray-700">1,983</p>
          <p className="text-xs text-gray-500 mt-1">Mahudhurio</p>
        </div>
      </div>

      {/* Report cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reports.map((report) => {
          const Icon = report.icon;
          return (
            <div key={report.id} className="card p-5 hover:shadow-card-hover transition-shadow">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-ccm-green-50 text-ccm-green-600 flex items-center justify-center flex-shrink-0">
                  <Icon size={24} />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-900">{report.title}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{report.description}</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                <span>{report.count}</span>
                <span>{report.date}</span>
                <Badge variant={report.format === 'Excel' ? 'green' : 'blue'}>{report.format}</Badge>
              </div>
              <button className="btn-secondary w-full">
                <Download size={16} /> Pakua Riporti
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
