import { Settings, Globe, Lock, Bell, Database, ShieldCheck, Save, Building } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';

export default function SettingsPage() {
  return (
    <div>
      <PageHeader
        title="Mipangilio ya Mfumo"
        description="Badilisha mipangilio ya jumla ya mfumo wa usimamizi"
        action={
          <button className="btn-primary">
            <Save size={16} /> Hifadhi Mabadiliko
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: tab navigation */}
        <div className="card p-4 lg:sticky lg:top-20 h-fit">
          <p className="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Mipangilio</p>
          <ul className="space-y-1">
            {[
              { label: 'Mipangilio ya Jumla', icon: Settings, active: true },
              { label: 'Taarifa za Taasisi', icon: Building },
              { label: 'Usalama na Nenosiri', icon: Lock },
              { label: 'Arifa', icon: Bell },
              { label: 'Lugha na Eneo', icon: Globe },
              { label: 'Hifadhi Data', icon: Database },
              { label: 'Faragha na Ruhusa', icon: ShieldCheck },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <li key={tab.label}>
                  <button
                    className={`nav-link w-full ${tab.active ? 'nav-link-active' : ''}`}
                  >
                    <Icon size={18} className="flex-shrink-0" />
                    <span className="truncate">{tab.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Right: content */}
        <div className="lg:col-span-2 space-y-6">
          {/* General */}
          <div className="card p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Mipangilio ya Jumla</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="input-label">Jina la Mfumo</label>
                <input type="text" defaultValue="CCM Iringa" className="input" />
              </div>
              <div>
                <label className="input-label">Mkoa</label>
                <input type="text" defaultValue="Iringa" className="input" disabled />
              </div>
              <div>
                <label className="input-label">Barua Pepe ya Mfumo</label>
                <input type="email" defaultValue="admin@ccmiringa.go.tz" className="input" />
              </div>
              <div>
                <label className="input-label">Nambari ya Simu</label>
                <input type="tel" defaultValue="0754-123-456" className="input" />
              </div>
              <div className="sm:col-span-2">
                <label className="input-label">Maelezo ya Mfumo</label>
                <textarea defaultValue="Mfumo wa Usimamizi wa Taasisi za CCM Mkoa wa Iringa" className="input min-h-[70px] resize-y" />
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="card p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Usalama</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">Uthibitishaji wa Hatua Mbili</p>
                  <p className="text-xs text-gray-500 mt-0.5">Ongeza usalama kwa kuhitaji code ya pili</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-ccm-green-600 transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5" />
                </label>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">Muda wa Kikao</p>
                  <p className="text-xs text-gray-500 mt-0.5">Kikao kitaisha baada ya muda usiotumika</p>
                </div>
                <select className="input w-32 cursor-pointer">
                  <option>30 dakika</option>
                  <option>1 saa</option>
                  <option>2 saa</option>
                </select>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">Kukumbuka Nenosiri</p>
                  <p className="text-xs text-gray-500 mt-0.5">Watumiaji wahitajika kubadilisha nenosiri baada ya siku 90</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-ccm-green-600 transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5" />
                </label>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="card p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Arifa</h3>
            <div className="space-y-3">
              {[
                { label: 'Arifa za Barua Pepe', desc: 'Tuma arifa kupitia barua pepe' },
                { label: 'Arifa za SMS (Baaday)', desc: 'Tuma arifa za SMS kwa walioko tayari kuidhinisha' },
                { label: 'Arifa za Matukio Mapya', desc: 'Arifa watumiaji wote wakati tukio laongezwe' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-ccm-green-600 transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5" />
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
