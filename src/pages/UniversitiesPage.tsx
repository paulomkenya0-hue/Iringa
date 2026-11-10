import { useState, useEffect, useCallback } from 'react';
import {
  Plus,
  Search,
  Filter,
  GraduationCap,
  MapPin,
  Phone,
  Users,
  MoreVertical,
  Edit2,
  Trash2,
  Eye,
  Download,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import { supabase } from '@/lib/supabase';
import type { University } from '@/types/database';

export default function UniversitiesPage() {
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [districtFilter, setDistrictFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUniv, setEditingUniv] = useState<University | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    district: '',
    phone: '',
    email: '',
    address: '',
  });

  const fetchUniversities = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('universities')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setUniversities(data as University[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchUniversities();
  }, [fetchUniversities]);

  const districts = ['all', ...Array.from(new Set(universities.map((u) => u.district)))];

  const filtered = universities.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.code.toLowerCase().includes(search.toLowerCase());
    const matchesDistrict = districtFilter === 'all' || u.district === districtFilter;
    return matchesSearch && matchesDistrict;
  });

  const resetForm = () => {
    setFormData({ name: '', code: '', district: '', phone: '', email: '', address: '' });
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase.from('universities').insert({
      name: formData.name,
      code: formData.code,
      district: formData.district,
      phone: formData.phone || null,
      email: formData.email || null,
      address: formData.address || null,
    });
    setSaving(false);
    if (error) {
      setError(error.message);
    } else {
      setShowAddModal(false);
      resetForm();
      fetchUniversities();
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUniv) return;
    setSaving(true);
    const { error } = await supabase
      .from('universities')
      .update({
        name: formData.name,
        code: formData.code,
        district: formData.district,
        phone: formData.phone || null,
        email: formData.email || null,
        address: formData.address || null,
      })
      .eq('id', editingUniv.id);
    setSaving(false);
    if (error) {
      setError(error.message);
    } else {
      setShowEditModal(false);
      setEditingUniv(null);
      resetForm();
      fetchUniversities();
    }
  };

  const openEdit = (univ: University) => {
    setEditingUniv(univ);
    setFormData({
      name: univ.name,
      code: univ.code,
      district: univ.district,
      phone: univ.phone || '',
      email: univ.email || '',
      address: univ.address || '',
    });
    setShowEditModal(true);
    setOpenMenuId(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={28} className="animate-spin text-ccm-green-600" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Usimamizi wa Vyuo"
        description="Sajili, hariri na simamia vyuo vyote vya CCM Mkoa wa Iringa"
        action={
          <button className="btn-primary" onClick={() => { resetForm(); setShowAddModal(true); }}>
            <Plus size={16} /> Ongeza Chuo
          </button>
        }
      />

      {error && (
        <div className="mb-4 p-3 bg-error-50 border border-error-100 rounded-lg flex items-start gap-2.5">
          <AlertCircle size={18} className="text-error-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-error-700">{error}</p>
        </div>
      )}

      {/* Filters */}
      <div className="card p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tafuta chuo..."
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
                <th>Jina la Chuo</th>
                <th>Kodi</th>
                <th>Wilaya</th>
                <th>Simu</th>
                <th>Hali</th>
                <th className="text-right">Vitendo</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400">
                    Hakuna vyuo viliyosajiliwa. Bofya "Ongeza Chuo" kuanza.
                  </td>
                </tr>
              ) : (
                filtered.map((univ) => (
                  <tr key={univ.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-ccm-green-50 text-ccm-green-600 flex items-center justify-center flex-shrink-0">
                          <GraduationCap size={18} />
                        </div>
                        <span className="font-medium text-gray-900">{univ.name}</span>
                      </div>
                    </td>
                    <td><span className="font-mono text-sm text-gray-700">{univ.code}</span></td>
                    <td>
                      <span className="flex items-center gap-1 text-gray-600">
                        <MapPin size={14} className="text-gray-400" /> {univ.district}
                      </span>
                    </td>
                    <td>
                      <span className="flex items-center gap-1 text-gray-600">
                        <Phone size={14} className="text-gray-400" /> {univ.phone || '—'}
                      </span>
                    </td>
                    <td>
                      <Badge variant={univ.is_active ? 'green' : 'gray'}>
                        {univ.is_active ? 'Inafanya Kazi' : 'Imezimwa'}
                      </Badge>
                    </td>
                    <td>
                      <div className="flex items-center justify-end relative">
                        <button
                          onClick={() => setOpenMenuId(openMenuId === univ.id ? null : univ.id)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                        >
                          <MoreVertical size={18} />
                        </button>
                        {openMenuId === univ.id && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setOpenMenuId(null)} />
                            <div className="absolute right-0 top-full mt-1 z-20 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 animate-fade-in">
                              <button
                                onClick={() => openEdit(univ)}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 text-left"
                              >
                                <Edit2 size={15} /> Hariri
                              </button>
                              <button
                                onClick={async () => {
                                  setOpenMenuId(null);
                                  if (confirm(`Unahakika unataka kufuta ${univ.name}?`)) {
                                    await supabase.from('universities').delete().eq('id', univ.id);
                                    fetchUniversities();
                                  }
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-error-600 hover:bg-error-50 text-left"
                              >
                                <Trash2 size={15} /> Futa
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            Inaonyesha <span className="font-medium text-gray-700">{filtered.length}</span> kati ya{' '}
            <span className="font-medium text-gray-700">{universities.length}</span> vyuo
          </p>
        </div>
      </div>

      {/* Add modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Ongeza Chuo Kipya"
        size="lg"
        footer={
          <>
            <button className="btn-secondary" onClick={() => setShowAddModal(false)}>Ghairi</button>
            <button className="btn-primary" onClick={handleAdd} disabled={saving}>
              {saving ? <Loader2 size={16} className="animate-spin" /> : 'Hifadhi Chuo'}
            </button>
          </>
        }
      >
        <UniversityForm formData={formData} setFormData={setFormData} />
      </Modal>

      {/* Edit modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => { setShowEditModal(false); setEditingUniv(null); }}
        title="Hariri Chuo"
        size="lg"
        footer={
          <>
            <button className="btn-secondary" onClick={() => { setShowEditModal(false); setEditingUniv(null); }}>Ghairi</button>
            <button className="btn-primary" onClick={handleEdit} disabled={saving}>
              {saving ? <Loader2 size={16} className="animate-spin" /> : 'Hifadhi Mabadiliko'}
            </button>
          </>
        }
      >
        <UniversityForm formData={formData} setFormData={setFormData} />
      </Modal>
    </div>
  );
}

function UniversityForm({
  formData,
  setFormData,
}: {
  formData: { name: string; code: string; district: string; phone: string; email: string; address: string };
  setFormData: (d: { name: string; code: string; district: string; phone: string; email: string; address: string }) => void;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="sm:col-span-2">
        <label className="input-label">Jina la Chuo *</label>
        <input
          type="text"
          placeholder="Mfano: Chuo Kikuu wa Dodoma"
          className="input"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>
      <div>
        <label className="input-label">Kodi ya Chuo *</label>
        <input
          type="text"
          placeholder="Mfano: UDOM"
          className="input font-mono"
          value={formData.code}
          onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
        />
        <p className="text-xs text-gray-400 mt-1">Kodi itatumika kuzalisha namba ya wanachama</p>
      </div>
      <div>
        <label className="input-label">Wilaya *</label>
        <select
          className="input cursor-pointer"
          value={formData.district}
          onChange={(e) => setFormData({ ...formData, district: e.target.value })}
        >
          <option value="">Chagua wilaya...</option>
          <option>Iringa Mjini</option>
          <option>Iringa Vijijini</option>
          <option>Mufindi</option>
          <option>Kilolo</option>
          <option>Mufindi Kusini</option>
        </select>
      </div>
      <div>
        <label className="input-label">Simu</label>
        <input
          type="tel"
          placeholder="07XX-XXX-XXX"
          className="input"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
      </div>
      <div>
        <label className="input-label">Barua Pepe</label>
        <input
          type="email"
          placeholder="chuo@example.ac.tz"
          className="input"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </div>
      <div className="sm:col-span-2">
        <label className="input-label">Anwani</label>
        <textarea
          placeholder="Anwani kamili ya chuo..."
          className="input min-h-[60px] resize-y"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
        />
      </div>
    </div>
  );
}
