import { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  Building2,
  MapPin,
  Phone,
  Users,
  MoreVertical,
  Edit2,
  Trash2,
  Eye,
  Download,
} from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';

interface Institution {
  id: number;
  name: string;
  type: string;
  district: string;
  phone: string;
  members: number;
  status: 'active' | 'inactive';
}

const INSTITUTIONS: Institution[] = [
  { id: 1, name: 'Ofisi ya Mkoa wa Iringa', type: 'Ofisi ya Mkoa', district: 'Iringa Mjini', phone: '0754-123-456', members: 45, status: 'active' },
  { id: 2, name: 'Ofisi ya Wilaya ya Mufindi', type: 'Ofisi ya Wilaya', district: 'Mufindi', phone: '0754-234-567', members: 38, status: 'active' },
  { id: 3, name: 'Ofisi ya Wilaya ya Kilolo', type: 'Ofisi ya Wilaya', district: 'Kilolo', phone: '0754-345-678', members: 31, status: 'active' },
  { id: 4, name: 'Ofisi ya Wilaya ya Iringa Vijijini', type: 'Ofisi ya Wilaya', district: 'Iringa Vijijini', phone: '0754-456-789', members: 27, status: 'active' },
  { id: 5, name: 'Ofisi ya Wilaya ya Mufindi Kusini', type: 'Ofisi ya Wilaya', district: 'Mufindi Kusini', phone: '0754-567-890', members: 22, status: 'inactive' },
  { id: 6, name: 'Ofisi ya Kata ya Mlandege', type: 'Ofisi ya Kata', district: 'Iringa Mjini', phone: '0754-678-901', members: 15, status: 'active' },
  { id: 7, name: 'Ofisi ya Kata ya Kihesa', type: 'Ofisi ya Kata', district: 'Iringa Mjini', phone: '0754-789-012', members: 12, status: 'active' },
];

export default function InstitutionsPage() {
  const [search, setSearch] = useState('');
  const [districtFilter, setDistrictFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const districts = ['all', ...Array.from(new Set(INSTITUTIONS.map((i) => i.district)))];

  const filtered = INSTITUTIONS.filter((inst) => {
    const matchesSearch = inst.name.toLowerCase().includes(search.toLowerCase());
    const matchesDistrict = districtFilter === 'all' || inst.district === districtFilter;
    return matchesSearch && matchesDistrict;
  });

  return (
    <div>
      <PageHeader
        title="Usimamizi wa Taasisi"
        description="Sajili, hariri na simamia taasisi zote za CCM Mkoa wa Iringa"
        action={
          <div className="flex items-center gap-2">
            <button className="btn-secondary">
              <Download size={16} /> Pakua
            </button>
            <button className="btn-primary" onClick={() => setShowAddModal(true)}>
              <Plus size={16} /> Ongeza Taasisi
            </button>
          </div>
        }
      />

      {/* Filters */}
      <div className="card p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tafuta taasisi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-10"
            />
          </div>
          <div className="relative">
            <Filter size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <select
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              className="input pl-10 pr-8 appearance-none cursor-pointer min-w-[180px]"
            >
              {districts.map((d) => (
                <option key={d} value={d}>
                  {d === 'all' ? 'Wilaya Zote' : d}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Jina la Taasisi</th>
                <th>Aina</th>
                <th>Wilaya</th>
                <th>Simu</th>
                <th>Wanachama</th>
                <th>Hali</th>
                <th className="text-right">Vitendo</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((inst) => (
                <tr key={inst.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-ccm-green-50 text-ccm-green-600 flex items-center justify-center flex-shrink-0">
                        <Building2 size={18} />
                      </div>
                      <span className="font-medium text-gray-900">{inst.name}</span>
                    </div>
                  </td>
                  <td><span className="text-gray-600">{inst.type}</span></td>
                  <td>
                    <span className="flex items-center gap-1 text-gray-600">
                      <MapPin size={14} className="text-gray-400" /> {inst.district}
                    </span>
                  </td>
                  <td>
                    <span className="flex items-center gap-1 text-gray-600">
                      <Phone size={14} className="text-gray-400" /> {inst.phone}
                    </span>
                  </td>
                  <td>
                    <span className="flex items-center gap-1 text-gray-600">
                      <Users size={14} className="text-gray-400" /> {inst.members}
                    </span>
                  </td>
                  <td>
                    <Badge variant={inst.status === 'active' ? 'green' : 'gray'}>
                      {inst.status === 'active' ? 'Inafanya Kazi' : 'Imezimwa'}
                    </Badge>
                  </td>
                  <td>
                    <div className="flex items-center justify-end relative">
                      <button
                        onClick={() => setOpenMenuId(openMenuId === inst.id ? null : inst.id)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                      >
                        <MoreVertical size={18} />
                      </button>
                      {openMenuId === inst.id && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setOpenMenuId(null)} />
                          <div className="absolute right-0 top-full mt-1 z-20 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 animate-fade-in">
                            <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 text-left">
                              <Eye size={15} /> Angalia
                            </button>
                            <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 text-left">
                              <Edit2 size={15} /> Hariri
                            </button>
                            <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-error-600 hover:bg-error-50 text-left">
                              <Trash2 size={15} /> Futa
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            Inaonyesha <span className="font-medium text-gray-700">{filtered.length}</span> kati ya{' '}
            <span className="font-medium text-gray-700">{INSTITUTIONS.length}</span> taasisi
          </p>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1.5 text-sm text-gray-500 rounded-lg hover:bg-gray-50 disabled:opacity-50" disabled>
              Iliyotangulia
            </button>
            <button className="px-3 py-1.5 text-sm font-medium bg-ccm-green-50 text-ccm-green-700 rounded-lg">1</button>
            <button className="px-3 py-1.5 text-sm text-gray-500 rounded-lg hover:bg-gray-50">2</button>
            <button className="px-3 py-1.5 text-sm text-gray-500 rounded-lg hover:bg-gray-50">
              Inayofuata
            </button>
          </div>
        </div>
      </div>

      {/* Add modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Ongeza Taasisi Mpya"
        size="lg"
        footer={
          <>
            <button className="btn-secondary" onClick={() => setShowAddModal(false)}>
              Ghairi
            </button>
            <button className="btn-primary" onClick={() => setShowAddModal(false)}>
              Hifadhi Taasisi
            </button>
          </>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="input-label">Jina la Taasisi *</label>
            <input type="text" placeholder="Mfano: Ofisi ya Wilaya ya..." className="input" />
          </div>
          <div>
            <label className="input-label">Aina ya Taasisi *</label>
            <select className="input cursor-pointer">
              <option>Chagua aina...</option>
              <option>Ofisi ya Mkoa</option>
              <option>Ofisi ya Wilaya</option>
              <option>Ofisi ya Kata</option>
              <option>Ofisi ya Kitongoji</option>
            </select>
          </div>
          <div>
            <label className="input-label">Wilaya *</label>
            <select className="input cursor-pointer">
              <option>Chagua wilaya...</option>
              <option>Iringa Mjini</option>
              <option>Iringa Vijijini</option>
              <option>Mufindi</option>
              <option>Kilolo</option>
              <option>Mufindi Kusini</option>
            </select>
          </div>
          <div>
            <label className="input-label">Nambari ya Simu</label>
            <input type="tel" placeholder="07XX-XXX-XXX" className="input" />
          </div>
          <div>
            <label className="input-label">Barua Pepe</label>
            <input type="email" placeholder="taasisi@ccm.go.tz" className="input" />
          </div>
          <div className="sm:col-span-2">
            <label className="input-label">Anwani</label>
            <textarea
              placeholder="Anwani kamili ya taasisi..."
              className="input min-h-[80px] resize-y"
            />
          </div>
          <div className="sm:col-span-2 p-3 bg-info-50 rounded-lg border border-info-100">
            <p className="text-xs text-info-700">
              Taarifa za taasisi zitahifadhiwa kwa usalama na zitatumika kwa madhumuni ya kiutawala tu.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
}
