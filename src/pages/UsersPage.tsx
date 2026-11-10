import { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  Mail,
  Phone,
  MoreVertical,
  Edit2,
  Trash2,
  Eye,
  Download,
  ShieldCheck,
  Building2,
} from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import { ROLES, type UserRole } from '@/types/navigation';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  institution: string;
  status: 'active' | 'inactive' | 'pending';
  lastLogin: string;
}

const USERS: User[] = [
  { id: 1, name: 'Joseph Mbowe', email: 'j.mbowe@ccm.go.tz', phone: '0754-111-222', role: 'super_admin', institution: 'Ofisi ya Mkoa', status: 'active', lastLogin: 'Leo, 08:30' },
  { id: 2, name: 'Anna Mushi', email: 'a.mushi@ccm.go.tz', phone: '0754-222-333', role: 'regional_admin', institution: 'Ofisi ya Mkoa', status: 'active', lastLogin: 'Leo, 07:15' },
  { id: 3, name: 'Grace Kimaro', email: 'g.kimaro@ccm.go.tz', phone: '0754-333-444', role: 'institution_admin', institution: 'Ofisi ya Wilaya ya Mufindi', status: 'active', lastLogin: 'Jana, 16:42' },
  { id: 4, name: 'Peter Malley', email: 'p.malley@ccm.go.tz', phone: '0754-444-555', role: 'data_entry', institution: 'Ofisi ya Wilaya ya Kilolo', status: 'active', lastLogin: 'Jana, 14:20' },
  { id: 5, name: 'Sarah Joseph', email: 's.joseph@ccm.go.tz', phone: '0754-555-666', role: 'viewer', institution: 'Ofisi ya Wilaya ya Iringa Vijijini', status: 'active', lastLogin: '2 siku zilizopita' },
  { id: 6, name: 'David Mwakyeme', email: 'd.mwakyeme@ccm.go.tz', phone: '0754-666-777', role: 'data_entry', institution: 'Ofisi ya Wilaya ya Mufindi', status: 'pending', lastLogin: '—' },
  { id: 7, name: 'Neema Komba', email: 'n.komba@ccm.go.tz', phone: '0754-777-888', role: 'institution_admin', institution: 'Ofisi ya Kata ya Mlandege', status: 'inactive', lastLogin: 'Wiki 2 zilizopita' },
];

const roleBadgeVariant: Record<UserRole, 'green' | 'gold' | 'blue' | 'gray' | 'red'> = {
  super_admin: 'red',
  regional_admin: 'gold',
  institution_admin: 'green',
  data_entry: 'blue',
  viewer: 'gray',
};

export default function UsersPage() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const filtered = USERS.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div>
      <PageHeader
        title="Usimamizi wa Watumiaji"
        description="Sajili, hariri na simamia akaunti za watumiaji wa mfumo"
        action={
          <div className="flex items-center gap-2">
            <button className="btn-secondary">
              <Download size={16} /> Pakua
            </button>
            <button className="btn-primary" onClick={() => setShowAddModal(true)}>
              <Plus size={16} /> Ongeza Mtumiaji
            </button>
          </div>
        }
      />

      {/* Stats summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-ccm-green-50 text-ccm-green-600 flex items-center justify-center">
            <ShieldCheck size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-500">Watumiaji Wote</p>
            <p className="text-xl font-bold text-gray-900">{USERS.length}</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-ccm-green-50 text-ccm-green-600 flex items-center justify-center">
            <ShieldCheck size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-500">Wanaofanya Kazi</p>
            <p className="text-xl font-bold text-gray-900">{USERS.filter((u) => u.status === 'active').length}</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-ccm-gold-50 text-ccm-gold-600 flex items-center justify-center">
            <ShieldCheck size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-500">Wanasubiri Idhini</p>
            <p className="text-xl font-bold text-gray-900">{USERS.filter((u) => u.status === 'pending').length}</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gray-100 text-gray-500 flex items-center justify-center">
            <ShieldCheck size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-500">Wamezimwa</p>
            <p className="text-xl font-bold text-gray-900">{USERS.filter((u) => u.status === 'inactive').length}</p>
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
              placeholder="Tafuta kwa jina au barua pepe..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-10"
            />
          </div>
          <div className="relative">
            <Filter size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="input pl-10 pr-8 appearance-none cursor-pointer min-w-[180px]"
            >
              <option value="all">Majukumu Yote</option>
              {Object.values(ROLES).map((r) => (
                <option key={r.key} value={r.key}>{r.label}</option>
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
                <th>Mtumiaji</th>
                <th>Mjukumu</th>
                <th>Taasisi</th>
                <th>Mawasiliano</th>
                <th>Hali</th>
                <th>Marudio ya Mwisho</th>
                <th className="text-right">Vitendo</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-ccm-green-600 to-ccm-green-800 text-white flex items-center justify-center text-sm font-semibold flex-shrink-0">
                        {user.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 truncate">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <Badge variant={roleBadgeVariant[user.role]}>
                      {ROLES[user.role].label}
                    </Badge>
                  </td>
                  <td>
                    <span className="flex items-center gap-1 text-gray-600 text-sm">
                      <Building2 size={14} className="text-gray-400 flex-shrink-0" />
                      <span className="truncate max-w-[160px]">{user.institution}</span>
                    </span>
                  </td>
                  <td>
                    <span className="flex items-center gap-1 text-sm text-gray-600">
                      <Phone size={14} className="text-gray-400" /> {user.phone}
                    </span>
                  </td>
                  <td>
                    <Badge variant={user.status === 'active' ? 'green' : user.status === 'pending' ? 'gold' : 'gray'}>
                      {user.status === 'active' ? 'Anafanya Kazi' : user.status === 'pending' ? 'Anasubiri' : 'Amezimwa'}
                    </Badge>
                  </td>
                  <td><span className="text-sm text-gray-500">{user.lastLogin}</span></td>
                  <td>
                    <div className="flex items-center justify-end relative">
                      <button
                        onClick={() => setOpenMenuId(openMenuId === user.id ? null : user.id)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                      >
                        <MoreVertical size={18} />
                      </button>
                      {openMenuId === user.id && (
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

        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            Inaonyesha <span className="font-medium text-gray-700">{filtered.length}</span> kati ya{' '}
            <span className="font-medium text-gray-700">{USERS.length}</span> watumiaji
          </p>
        </div>
      </div>

      {/* Add modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Ongeza Mtumiaji Mpya"
        size="lg"
        footer={
          <>
            <button className="btn-secondary" onClick={() => setShowAddModal(false)}>Ghairi</button>
            <button className="btn-primary" onClick={() => setShowAddModal(false)}>Hifadhi Mtumiaji</button>
          </>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="input-label">Jina Kamili *</label>
            <input type="text" placeholder="Mfano: Juma Hamisi" className="input" />
          </div>
          <div>
            <label className="input-label">Barua Pepe *</label>
            <input type="email" placeholder="juma@ccm.go.tz" className="input" />
          </div>
          <div>
            <label className="input-label">Nambari ya Simu</label>
            <input type="tel" placeholder="07XX-XXX-XXX" className="input" />
          </div>
          <div>
            <label className="input-label">Mjukumu *</label>
            <select className="input cursor-pointer">
              <option>Chagua jukumu...</option>
              {Object.values(ROLES).map((r) => (
                <option key={r.key} value={r.key}>{r.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="input-label">Taasisi *</label>
            <select className="input cursor-pointer">
              <option>Chagua taasisi...</option>
              <option>Ofisi ya Mkoa wa Iringa</option>
              <option>Ofisi ya Wilaya ya Mufindi</option>
              <option>Ofisi ya Wilaya ya Kilolo</option>
              <option>Ofisi ya Wilaya ya Iringa Vijijini</option>
            </select>
          </div>
          <div>
            <label className="input-label">Nenosiri la Awali *</label>
            <input type="password" placeholder="••••••••" className="input" />
          </div>
          <div className="sm:col-span-2 p-3 bg-ccm-green-50 rounded-lg border border-ccm-green-100">
            <div className="flex items-start gap-2.5">
              <Mail size={16} className="text-ccm-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-ccm-green-700">
                Mtumiaji atapokea barua pepe ya kumjulisha akaunti yake imeundwa. Atahitaji kubadilisha
                nenosiri kwenye kuingia kwa mara ya kwanza.
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
