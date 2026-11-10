import { useState, useEffect, useCallback } from 'react';
import {
  Plus,
  Search,
  Filter,
  User,
  Phone,
  Mail,
  GraduationCap,
  Hash,
  MoreVertical,
  Edit2,
  Trash2,
  Download,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import type { Member, University } from '@/types/database';

export default function MembersPage() {
  const { userRole, userUniversity } = useAuth();
  const [members, setMembers] = useState<Member[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [univFilter, setUnivFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    university_id: '',
    full_name: '',
    phone: '',
    email: '',
    year_of_study: '',
    consent_given: false,
    status: 'pending' as 'active' | 'inactive' | 'pending',
  });

  const fetchUniversities = useCallback(async () => {
    const { data } = await supabase.from('universities').select('*').order('name');
    if (data) setUniversities(data as University[]);
  }, []);

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    setError(null);

    let query = supabase
      .from('members')
      .select('*, university:universities(*)')
      .order('created_at', { ascending: false });

    // University leaders/admins only see their university's members
    if (userRole === 'university_admin' || userRole === 'university_leader') {
      if (userUniversity?.id) {
        query = query.eq('university_id', userUniversity.id);
      }
    }

    const { data, error } = await query;
    if (error) {
      setError(error.message);
    } else {
      setMembers(data as Member[]);
    }
    setLoading(false);
  }, [userRole, userUniversity]);

  useEffect(() => {
    fetchUniversities();
    fetchMembers();
  }, [fetchUniversities, fetchMembers]);

  // For university-scoped users, default to their university
  useEffect(() => {
    if (userUniversity && (userRole === 'university_admin' || userRole === 'university_leader')) {
      setFormData((prev) => ({ ...prev, university_id: userUniversity.id }));
    }
  }, [userUniversity, userRole]);

  const availableUniversities = userRole === 'super_admin' ? universities : universities.filter((u) => u.id === userUniversity?.id);

  const filtered = members.filter((m) => {
    const matchesSearch =
      m.full_name.toLowerCase().includes(search.toLowerCase()) ||
      (m.registration_number?.toLowerCase().includes(search.toLowerCase()) ?? false);
    const matchesUniv = univFilter === 'all' || m.university_id === univFilter;
    const matchesStatus = statusFilter === 'all' || m.status === statusFilter;
    return matchesSearch && matchesUniv && matchesStatus;
  });

  const resetForm = () => {
    setFormData({
      university_id: userUniversity?.id || '',
      full_name: '',
      phone: '',
      email: '',
      year_of_study: '',
      consent_given: false,
      status: 'pending',
    });
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    // Get university code for member number generation
    const univ = universities.find((u) => u.id === formData.university_id);
    if (!univ) {
      setError('Chagua chuo kwanza');
      setSaving(false);
      return;
    }

    // Generate member number via RPC
    const { data: regNumber, error: regError } = await supabase.rpc('generate_member_number', {
      uni_code: univ.code,
    });

    if (regError) {
      setError('Imeshindikana kuzalisha namba ya usajili: ' + regError.message);
      setSaving(false);
      return;
    }

    const { data: authData } = await supabase.auth.getUser();

    const { error: insertError } = await supabase.from('members').insert({
      university_id: formData.university_id,
      full_name: formData.full_name,
      registration_number: regNumber,
      phone: formData.phone || null,
      email: formData.email || null,
      year_of_study: formData.year_of_study ? parseInt(formData.year_of_study) : null,
      consent_given: formData.consent_given,
      consent_date: formData.consent_given ? new Date().toISOString() : null,
      status: formData.status,
      registered_by: authData.user?.id || null,
    });

    setSaving(false);
    if (insertError) {
      setError(insertError.message);
    } else {
      setShowAddModal(false);
      resetForm();
      setSuccess(`Mwanachama ameongezwa. Namba ya usajili: ${regNumber}`);
      setTimeout(() => setSuccess(null), 5000);
      fetchMembers();
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;
    setSaving(true);
    const { error } = await supabase
      .from('members')
      .update({
        full_name: formData.full_name,
        phone: formData.phone || null,
        email: formData.email || null,
        year_of_study: formData.year_of_study ? parseInt(formData.year_of_study) : null,
        consent_given: formData.consent_given,
        status: formData.status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', editingMember.id);
    setSaving(false);
    if (error) {
      setError(error.message);
    } else {
      setShowEditModal(false);
      setEditingMember(null);
      resetForm();
      fetchMembers();
    }
  };

  const openEdit = (member: Member) => {
    setEditingMember(member);
    setFormData({
      university_id: member.university_id,
      full_name: member.full_name,
      phone: member.phone || '',
      email: member.email || '',
      year_of_study: member.year_of_study?.toString() || '',
      consent_given: member.consent_given,
      status: member.status,
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
        title="Usimamizi wa Wanachama"
        description={userRole === 'super_admin' ? 'Sajili, hariri na simamia wanachama wote' : `Wanachama wa ${userUniversity?.name || 'chuo chako'}`}
        action={
          <button className="btn-primary" onClick={() => { resetForm(); setShowAddModal(true); }}>
            <Plus size={16} /> Ongeza Mwanachama
          </button>
        }
      />

      {error && (
        <div className="mb-4 p-3 bg-error-50 border border-error-100 rounded-lg flex items-start gap-2.5">
          <AlertCircle size={18} className="text-error-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-error-700">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-ccm-green-50 border border-ccm-green-100 rounded-lg flex items-start gap-2.5">
          <CheckCircle2 size={18} className="text-ccm-green-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-ccm-green-700">{success}</p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="card p-4">
          <p className="text-xs text-gray-500">Wanachama Wote</p>
          <p className="text-xl font-bold text-gray-900 mt-0.5">{members.length}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-gray-500">Wanaofanya Kazi</p>
          <p className="text-xl font-bold text-ccm-green-600 mt-0.5">{members.filter((m) => m.status === 'active').length}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-gray-500">Wanasubiri</p>
          <p className="text-xl font-bold text-ccm-gold-600 mt-0.5">{members.filter((m) => m.status === 'pending').length}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-gray-500">Wamezimwa</p>
          <p className="text-xl font-bold text-gray-500 mt-0.5">{members.filter((m) => m.status === 'inactive').length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tafuta kwa jina au namba ya usajili..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-10"
            />
          </div>
          {userRole === 'super_admin' && (
            <select
              value={univFilter}
              onChange={(e) => setUnivFilter(e.target.value)}
              className="input pr-8 appearance-none cursor-pointer min-w-[160px]"
            >
              <option value="all">Vyuo Vyote</option>
              {universities.map((u) => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
          )}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input pr-8 appearance-none cursor-pointer min-w-[140px]"
          >
            <option value="all">Hali Zote</option>
            <option value="active">Anafanya Kazi</option>
            <option value="pending">Anasubiri</option>
            <option value="inactive">Amezimwa</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Mwanachama</th>
                <th>Namba ya Usajili</th>
                {userRole === 'super_admin' && <th>Chuo</th>}
                <th>Mawasiliano</th>
                <th>Hali</th>
                <th>Ridhaa</th>
                <th className="text-right">Vitendo</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400">
                    Hakuna wanachama. Bofya "Ongeza Mwanachama" kuanza.
                  </td>
                </tr>
              ) : (
                filtered.map((member) => (
                  <tr key={member.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-ccm-green-600 to-ccm-green-800 text-white flex items-center justify-center text-sm font-semibold flex-shrink-0">
                          {member.full_name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 truncate">{member.full_name}</p>
                          {member.year_of_study && (
                            <p className="text-xs text-gray-500">Mwaka {member.year_of_study}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="flex items-center gap-1 font-mono text-sm text-gray-700">
                        <Hash size={12} className="text-gray-400" />
                        {member.registration_number || '—'}
                      </span>
                    </td>
                    {userRole === 'super_admin' && (
                      <td>
                        <span className="flex items-center gap-1 text-sm text-gray-600">
                          <GraduationCap size={14} className="text-gray-400" />
                          <span className="truncate max-w-[140px]">{member.university?.name || '—'}</span>
                        </span>
                      </td>
                    )}
                    <td>
                      <div className="text-sm text-gray-600">
                        {member.phone && (
                          <span className="flex items-center gap-1">
                            <Phone size={12} className="text-gray-400" /> {member.phone}
                          </span>
                        )}
                        {member.email && (
                          <span className="flex items-center gap-1 mt-0.5">
                            <Mail size={12} className="text-gray-400" /> <span className="truncate max-w-[140px]">{member.email}</span>
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <Badge variant={member.status === 'active' ? 'green' : member.status === 'pending' ? 'gold' : 'gray'}>
                        {member.status === 'active' ? 'Anafanya Kazi' : member.status === 'pending' ? 'Anasubiri' : 'Amezimwa'}
                      </Badge>
                    </td>
                    <td>
                      {member.consent_given ? (
                        <Badge variant="green">Amekubali</Badge>
                      ) : (
                        <Badge variant="gray">Hajakubali</Badge>
                      )}
                    </td>
                    <td>
                      <div className="flex items-center justify-end relative">
                        <button
                          onClick={() => setOpenMenuId(openMenuId === member.id ? null : member.id)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                        >
                          <MoreVertical size={18} />
                        </button>
                        {openMenuId === member.id && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setOpenMenuId(null)} />
                            <div className="absolute right-0 top-full mt-1 z-20 w-36 bg-white rounded-lg shadow-lg border border-gray-100 py-1 animate-fade-in">
                              <button
                                onClick={() => openEdit(member)}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 text-left"
                              >
                                <Edit2 size={15} /> Hariri
                              </button>
                              {userRole === 'super_admin' || userRole === 'university_admin' ? (
                                <button
                                  onClick={async () => {
                                    setOpenMenuId(null);
                                    if (confirm(`Unahakika unataka kufuta ${member.full_name}?`)) {
                                      await supabase.from('members').delete().eq('id', member.id);
                                      fetchMembers();
                                    }
                                  }}
                                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-error-600 hover:bg-error-50 text-left"
                                >
                                  <Trash2 size={15} /> Futa
                                </button>
                              ) : null}
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
            <span className="font-medium text-gray-700">{members.length}</span> wanachama
          </p>
        </div>
      </div>

      {/* Add modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Ongeza Mwanachama Mpya"
        size="lg"
        footer={
          <>
            <button className="btn-secondary" onClick={() => setShowAddModal(false)}>Ghairi</button>
            <button className="btn-primary" onClick={handleAdd} disabled={saving}>
              {saving ? <Loader2 size={16} className="animate-spin" /> : 'Hifadhi Mwanachama'}
            </button>
          </>
        }
      >
        <MemberForm
          formData={formData}
          setFormData={setFormData}
          universities={availableUniversities}
          isEdit={false}
          canChangeUniv={userRole === 'super_admin'}
        />
      </Modal>

      {/* Edit modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => { setShowEditModal(false); setEditingMember(null); }}
        title="Hariri Mwanachama"
        size="lg"
        footer={
          <>
            <button className="btn-secondary" onClick={() => { setShowEditModal(false); setEditingMember(null); }}>Ghairi</button>
            <button className="btn-primary" onClick={handleEdit} disabled={saving}>
              {saving ? <Loader2 size={16} className="animate-spin" /> : 'Hifadhi Mabadiliko'}
            </button>
          </>
        }
      >
        {editingMember && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500">Namba ya Usajili</p>
            <p className="font-mono font-semibold text-gray-900">{editingMember.registration_number}</p>
          </div>
        )}
        <MemberForm
          formData={formData}
          setFormData={setFormData}
          universities={availableUniversities}
          isEdit={true}
          canChangeUniv={false}
        />
      </Modal>
    </div>
  );
}

function MemberForm({
  formData,
  setFormData,
  universities,
  isEdit,
  canChangeUniv,
}: {
  formData: { university_id: string; full_name: string; phone: string; email: string; year_of_study: string; consent_given: boolean; status: 'active' | 'inactive' | 'pending' };
  setFormData: (d: { university_id: string; full_name: string; phone: string; email: string; year_of_study: string; consent_given: boolean; status: 'active' | 'inactive' | 'pending' }) => void;
  universities: University[];
  isEdit: boolean;
  canChangeUniv: boolean;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="sm:col-span-2">
        <label className="input-label">Chuo *</label>
        <select
          className="input cursor-pointer"
          value={formData.university_id}
          onChange={(e) => setFormData({ ...formData, university_id: e.target.value })}
          disabled={isEdit || !canChangeUniv}
        >
          <option value="">Chagua chuo...</option>
          {universities.map((u) => (
            <option key={u.id} value={u.id}>{u.name}</option>
          ))}
        </select>
      </div>
      <div className="sm:col-span-2">
        <label className="input-label">Jina Kamili *</label>
        <input
          type="text"
          placeholder="Mfano: Juma Hamisi"
          className="input"
          value={formData.full_name}
          onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
        />
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
          placeholder="jina@chuo.ac.tz"
          className="input"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </div>
      <div>
        <label className="input-label">Mwaka wa Masomo</label>
        <select
          className="input cursor-pointer"
          value={formData.year_of_study}
          onChange={(e) => setFormData({ ...formData, year_of_study: e.target.value })}
        >
          <option value="">Chagua...</option>
          <option value="1">Mwaka 1</option>
          <option value="2">Mwaka 2</option>
          <option value="3">Mwaka 3</option>
          <option value="4">Mwaka 4</option>
          <option value="5">Mwaka 5</option>
        </select>
      </div>
      <div>
        <label className="input-label">Hali</label>
        <select
          className="input cursor-pointer"
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' | 'pending' })}
        >
          <option value="pending">Anasubiri</option>
          <option value="active">Anafanya Kazi</option>
          <option value="inactive">Amezimwa</option>
        </select>
      </div>
      <div className="sm:col-span-2 p-3 bg-gray-50 rounded-lg border border-gray-100">
        <label className="flex items-start gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.consent_given}
            onChange={(e) => setFormData({ ...formData, consent_given: e.target.checked })}
            className="mt-0.5 w-4 h-4 rounded border-gray-300 text-ccm-green-600 focus:ring-ccm-green-500"
          />
          <span className="text-xs text-gray-600 leading-relaxed">
            Mwanachama amekubali kukusanywa kwa taarifa zake binafsi kwa madhumuni ya
            usimamizi wa CCM. Ridhaa hii inazingatia sheria za ulinzi wa data Tanzania.
          </span>
        </label>
      </div>
    </div>
  );
}
