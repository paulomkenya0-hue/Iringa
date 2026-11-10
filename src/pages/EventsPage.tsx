import { useState, useEffect, useCallback } from 'react';
import {
  Plus,
  Search,
  CalendarDays,
  MapPin,
  Users,
  Clock,
  MoreVertical,
  Edit2,
  Trash2,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import type { Event, EventStatus, University } from '@/types/database';

const statusVariant: Record<EventStatus, 'green' | 'blue' | 'gray' | 'red'> = {
  upcoming: 'green',
  ongoing: 'blue',
  completed: 'gray',
  cancelled: 'red',
};

const statusLabel: Record<EventStatus, string> = {
  upcoming: 'Kinafuata',
  ongoing: 'Inaendelea',
  completed: 'Kimekamilika',
  cancelled: 'Imefutwa',
};

export default function EventsPage() {
  const { userRole, userUniversity } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_date: '',
    event_time: '',
    location: '',
    university_id: '',
    expected_attendance: '',
    status: 'upcoming' as EventStatus,
  });

  const fetchUniversities = useCallback(async () => {
    const { data } = await supabase.from('universities').select('*').order('name');
    if (data) setUniversities(data as University[]);
  }, []);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from('events')
      .select('*, university:universities(*)')
      .order('event_date', { ascending: false });

    if (userRole !== 'super_admin' && userUniversity?.id) {
      query = query.eq('university_id', userUniversity.id);
    }

    const { data, error } = await query;
    if (error) {
      setError(error.message);
    } else {
      setEvents(data as Event[]);
    }
    setLoading(false);
  }, [userRole, userUniversity]);

  useEffect(() => {
    fetchUniversities();
    fetchEvents();
  }, [fetchUniversities, fetchEvents]);

  useEffect(() => {
    if (userUniversity && userRole !== 'super_admin') {
      setFormData((prev) => ({ ...prev, university_id: userUniversity.id }));
    }
  }, [userUniversity, userRole]);

  const filtered = events.filter((ev) => {
    const matchesSearch = ev.title.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ev.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      event_date: '',
      event_time: '',
      location: '',
      university_id: userUniversity?.id || '',
      expected_attendance: '',
      status: 'upcoming',
    });
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase.from('events').insert({
      title: formData.title,
      description: formData.description || null,
      event_date: formData.event_date,
      event_time: formData.event_time || null,
      location: formData.location || null,
      university_id: formData.university_id || null,
      expected_attendance: formData.expected_attendance ? parseInt(formData.expected_attendance) : null,
      status: formData.status,
    });
    setSaving(false);
    if (error) {
      setError(error.message);
    } else {
      setShowAddModal(false);
      resetForm();
      fetchEvents();
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;
    setSaving(true);
    const { error } = await supabase
      .from('events')
      .update({
        title: formData.title,
        description: formData.description || null,
        event_date: formData.event_date,
        event_time: formData.event_time || null,
        location: formData.location || null,
        university_id: formData.university_id || null,
        expected_attendance: formData.expected_attendance ? parseInt(formData.expected_attendance) : null,
        status: formData.status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', editingEvent.id);
    setSaving(false);
    if (error) {
      setError(error.message);
    } else {
      setShowEditModal(false);
      setEditingEvent(null);
      resetForm();
      fetchEvents();
    }
  };

  const openEdit = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description || '',
      event_date: event.event_date,
      event_time: event.event_time || '',
      location: event.location || '',
      university_id: event.university_id || '',
      expected_attendance: event.expected_attendance?.toString() || '',
      status: event.status,
    });
    setShowEditModal(true);
    setOpenMenuId(null);
  };

  const canChangeUniv = userRole === 'super_admin';

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
        title="Usimamizi wa Matukio"
        description="Panga, hariri na fuatilia matukio yote ya CCM"
        action={
          <button className="btn-primary" onClick={() => { resetForm(); setShowAddModal(true); }}>
            <Plus size={16} /> Ongeza Tukio
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
              placeholder="Tafuta tukio..."
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
            <option value="upcoming">Kinafuata</option>
            <option value="ongoing">Inaendelea</option>
            <option value="completed">Kimekamilika</option>
            <option value="cancelled">Imefutwa</option>
          </select>
        </div>
      </div>

      {/* Events grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-full card p-12 text-center text-gray-400">
            Hakuna matukio. Bofya "Ongeza Tukio" kuanza.
          </div>
        ) : (
          filtered.map((event) => (
            <div key={event.id} className="card p-5 hover:shadow-card-hover transition-shadow group">
              <div className="flex items-start justify-between mb-3">
                <Badge variant={statusVariant[event.status]}>
                  {statusLabel[event.status]}
                </Badge>
                <div className="relative">
                  <button
                    onClick={() => setOpenMenuId(openMenuId === event.id ? null : event.id)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <MoreVertical size={18} />
                  </button>
                  {openMenuId === event.id && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setOpenMenuId(null)} />
                      <div className="absolute right-0 top-full mt-1 z-20 w-36 bg-white rounded-lg shadow-lg border border-gray-100 py-1 animate-fade-in">
                        <button
                          onClick={() => openEdit(event)}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 text-left"
                        >
                          <Edit2 size={15} /> Hariri
                        </button>
                        {(userRole === 'super_admin' || userRole === 'university_admin') && (
                          <button
                            onClick={async () => {
                              setOpenMenuId(null);
                              if (confirm(`Unahakika unataka kufuta "${event.title}"?`)) {
                                await supabase.from('events').delete().eq('id', event.id);
                                fetchEvents();
                              }
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-error-600 hover:bg-error-50 text-left"
                          >
                            <Trash2 size={15} /> Futa
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3 mb-4">
                <div className="w-14 h-14 rounded-xl flex flex-col items-center justify-center flex-shrink-0 bg-ccm-green-50 text-ccm-green-700">
                  <CalendarDays size={20} />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-900 leading-snug">{event.title}</h3>
                  {event.university && (
                    <p className="text-xs text-gray-500 mt-0.5">{event.university.name}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock size={14} className="text-gray-400" />
                  <span>{event.event_date}{event.event_time ? ` • ${event.event_time}` : ''}</span>
                </div>
                {event.location && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin size={14} className="text-gray-400" />
                    <span className="truncate">{event.location}</span>
                  </div>
                )}
                {event.expected_attendance && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users size={14} className="text-gray-400" />
                    <span>Watarajiwa: {event.expected_attendance}</span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Ongeza Tukio Jipya"
        size="lg"
        footer={
          <>
            <button className="btn-secondary" onClick={() => setShowAddModal(false)}>Ghairi</button>
            <button className="btn-primary" onClick={handleAdd} disabled={saving}>
              {saving ? <Loader2 size={16} className="animate-spin" /> : 'Hifadhi Tukio'}
            </button>
          </>
        }
      >
        <EventForm
          formData={formData}
          setFormData={setFormData}
          universities={canChangeUniv ? universities : []}
          canChangeUniv={canChangeUniv}
        />
      </Modal>

      {/* Edit modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => { setShowEditModal(false); setEditingEvent(null); }}
        title="Hariri Tukio"
        size="lg"
        footer={
          <>
            <button className="btn-secondary" onClick={() => { setShowEditModal(false); setEditingEvent(null); }}>Ghairi</button>
            <button className="btn-primary" onClick={handleEdit} disabled={saving}>
              {saving ? <Loader2 size={16} className="animate-spin" /> : 'Hifadhi Mabadiliko'}
            </button>
          </>
        }
      >
        <EventForm
          formData={formData}
          setFormData={setFormData}
          universities={canChangeUniv ? universities : []}
          canChangeUniv={canChangeUniv}
        />
      </Modal>
    </div>
  );
}

function EventForm({
  formData,
  setFormData,
  universities,
  canChangeUniv,
}: {
  formData: { title: string; description: string; event_date: string; event_time: string; location: string; university_id: string; expected_attendance: string; status: EventStatus };
  setFormData: (d: { title: string; description: string; event_date: string; event_time: string; location: string; university_id: string; expected_attendance: string; status: EventStatus }) => void;
  universities: University[];
  canChangeUniv: boolean;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="sm:col-span-2">
        <label className="input-label">Jina la Tukio *</label>
        <input
          type="text"
          placeholder="Mfano: Mkutano Mkuu wa Chuo"
          className="input"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
      </div>
      {canChangeUniv && (
        <div className="sm:col-span-2">
          <label className="input-label">Chuo (acha wazi kwa tukio la mkoa)</label>
          <select
            className="input cursor-pointer"
            value={formData.university_id}
            onChange={(e) => setFormData({ ...formData, university_id: e.target.value })}
          >
            <option value="">Tukio la Mkoa (Vyuo Vyote)</option>
            {universities.map((u) => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
        </div>
      )}
      <div>
        <label className="input-label">Tarehe *</label>
        <input
          type="date"
          className="input"
          value={formData.event_date}
          onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
        />
      </div>
      <div>
        <label className="input-label">Saa</label>
        <input
          type="time"
          className="input"
          value={formData.event_time}
          onChange={(e) => setFormData({ ...formData, event_time: e.target.value })}
        />
      </div>
      <div className="sm:col-span-2">
        <label className="input-label">Eneo / Mahali</label>
        <input
          type="text"
          placeholder="Mfano: Uwanja wa Samora"
          className="input"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
        />
      </div>
      <div>
        <label className="input-label">Idadi ya Watarajiwa</label>
        <input
          type="number"
          placeholder="500"
          className="input"
          value={formData.expected_attendance}
          onChange={(e) => setFormData({ ...formData, expected_attendance: e.target.value })}
        />
      </div>
      <div>
        <label className="input-label">Hali</label>
        <select
          className="input cursor-pointer"
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value as EventStatus })}
        >
          <option value="upcoming">Kinafuata</option>
          <option value="ongoing">Inaendelea</option>
          <option value="completed">Kimekamilika</option>
          <option value="cancelled">Imefutwa</option>
        </select>
      </div>
      <div className="sm:col-span-2">
        <label className="input-label">Maelezo ya Ziada</label>
        <textarea
          placeholder="Maelezo kuhusu tukio..."
          className="input min-h-[70px] resize-y"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>
    </div>
  );
}
