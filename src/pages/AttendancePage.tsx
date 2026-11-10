import { useState } from 'react';
import { Search, ClipboardCheck, Check, X, Clock, Users, Download } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import Badge from '@/components/ui/Badge';

interface AttendanceRecord {
  id: number;
  eventName: string;
  eventDate: string;
  name: string;
  phone: string;
  district: string;
  checkedIn: boolean;
  checkTime: string | null;
  consent: boolean;
}

const RECORDS: AttendanceRecord[] = [
  { id: 1, eventName: 'Mkutano Mkuu wa Mkoa', eventDate: '2026-11-15', name: 'Juma Hamisi', phone: '0754-111-222', district: 'Iringa Mjini', checkedIn: true, checkTime: '10:05', consent: true },
  { id: 2, eventName: 'Mkutano Mkuu wa Mkoa', eventDate: '2026-11-15', name: 'Anna Mushi', phone: '0754-222-333', district: 'Kilolo', checkedIn: true, checkTime: '10:12', consent: true },
  { id: 3, eventName: 'Mkutano Mkuu wa Mkoa', eventDate: '2026-11-15', name: 'Peter Malley', phone: '0754-333-444', district: 'Mufindi', checkedIn: false, checkTime: null, consent: true },
  { id: 4, eventName: 'Mkutano Mkuu wa Mkoa', eventDate: '2026-11-15', name: 'Grace Kimaro', phone: '0754-444-555', district: 'Iringa Vijijini', checkedIn: true, checkTime: '09:58', consent: false },
  { id: 5, eventName: 'Mkutano Mkuu wa Mkoa', eventDate: '2026-11-15', name: 'Neema Komba', phone: '0754-555-666', district: 'Iringa Mjini', checkedIn: false, checkTime: null, consent: true },
  { id: 6, eventName: 'Mafunzo ya Kada', eventDate: '2026-11-12', name: 'David Mwakyeme', phone: '0754-666-777', district: 'Kilolo', checkedIn: true, checkTime: '08:15', consent: true },
];

export default function AttendancePage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = RECORDS.filter((r) => {
    const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'checked' && r.checkedIn) ||
      (statusFilter === 'pending' && !r.checkedIn);
    return matchesSearch && matchesStatus;
  });

  const checkedIn = RECORDS.filter((r) => r.checkedIn).length;
  const pending = RECORDS.filter((r) => !r.checkedIn).length;

  return (
    <div>
      <PageHeader
        title="Mahudhurio ya Matukio"
        description="Sajili na fuatilia mahudhurio ya washiriki kwenye matukio"
        action={
          <button className="btn-secondary">
            <Download size={16} /> Pakua Orodha
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-ccm-green-50 text-ccm-green-600 flex items-center justify-center">
            <Users size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-500">Waliohudhuria</p>
            <p className="text-xl font-bold text-gray-900">{checkedIn}</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-ccm-gold-50 text-ccm-gold-600 flex items-center justify-center">
            <Clock size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-500">Wanasubiri</p>
            <p className="text-xl font-bold text-gray-900">{pending}</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-info-50 text-info-600 flex items-center justify-center">
            <ClipboardCheck size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-500">Jumla ya Sahihi</p>
            <p className="text-xl font-bold text-gray-900">{RECORDS.length}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tafuta mshiriki..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-10"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input pr-8 appearance-none cursor-pointer min-w-[160px]"
          >
            <option value="all">Hali Zote</option>
            <option value="checked">Amehudhuria</option>
            <option value="pending">Anasubiri</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Mshiriki</th>
                <th>Tukio</th>
                <th>Wilaya</th>
                <th>Ridhaa</th>
                <th>Hali</th>
                <th>Saa ya Kuwasili</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id}>
                  <td>
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 truncate">{r.name}</p>
                      <p className="text-xs text-gray-500">{r.phone}</p>
                    </div>
                  </td>
                  <td>
                    <div className="min-w-0">
                      <p className="text-sm text-gray-700 truncate">{r.eventName}</p>
                      <p className="text-xs text-gray-400">{r.eventDate}</p>
                    </div>
                  </td>
                  <td><span className="text-sm text-gray-600">{r.district}</span></td>
                  <td>
                    {r.consent ? (
                      <Badge variant="green">Amekubali</Badge>
                    ) : (
                      <Badge variant="gray">Hajakubali</Badge>
                    )}
                  </td>
                  <td>
                    {r.checkedIn ? (
                      <span className="inline-flex items-center gap-1.5 text-sm text-ccm-green-600 font-medium">
                        <Check size={16} /> Amehudhuria
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-sm text-gray-400">
                        <X size={16} /> Anasubiri
                      </span>
                    )}
                  </td>
                  <td><span className="text-sm text-gray-500">{r.checkTime || '—'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
