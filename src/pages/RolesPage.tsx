import { ShieldCheck, Check, X } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import Badge from '@/components/ui/Badge';
import { ROLES, type UserRole } from '@/types/navigation';

const PERMISSIONS = [
  'Kuona Dashibodi',
  'Kusoma Taasisi',
  'Kuunda/Hariri Taasisi',
  'Kufuta Taasisi',
  'Kusoma Watumiaji',
  'Kuunda/Hariri Watumiaji',
  'Badilisha Majukumu',
  'Kuona Matukio',
  'Kuunda/Hariri Matukio',
  'Sajili Mahudhurio',
  'Pakua Riporti',
  'Kuona Kumbukumbu za Ukaguzi',
  'Badilisha Mipangilio ya Mfumo',
];

const PERMISSION_MATRIX: Record<UserRole, boolean[]> = {
  super_admin: Array(13).fill(true),
  regional_admin: [true, true, true, false, true, true, false, true, true, true, true, false, false],
  institution_admin: [true, true, false, false, true, true, false, true, true, true, true, false, false],
  data_entry: [true, true, false, false, false, false, false, true, true, true, false, false, false],
  viewer: [true, true, false, false, true, false, false, true, false, false, true, false, false],
};

const roleBadgeVariant: Record<UserRole, 'red' | 'gold' | 'green' | 'blue' | 'gray'> = {
  super_admin: 'red',
  regional_admin: 'gold',
  institution_admin: 'green',
  data_entry: 'blue',
  viewer: 'gray',
};

export default function RolesPage() {
  return (
    <div>
      <PageHeader
        title="Majukumu na Ruhusa"
        description="Simamiza majukumu ya watumiaji na ruhusa zinazohusiana na kila jukumu"
      />

      {/* Role cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
        {Object.values(ROLES).map((role) => (
          <div key={role.key} className="card p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-ccm-green-50 text-ccm-green-600 flex items-center justify-center">
                <ShieldCheck size={16} />
              </div>
              <Badge variant={roleBadgeVariant[role.key]}>{role.label}</Badge>
            </div>
            <p className="text-xs text-gray-500">{role.description}</p>
          </div>
        ))}
      </div>

      {/* Permission matrix */}
      <div className="card overflow-hidden">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Ruhusa</th>
                {Object.values(ROLES).map((role) => (
                  <th key={role.key} className="text-center min-w-[100px]">{role.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PERMISSIONS.map((perm, pIdx) => (
                <tr key={perm}>
                  <td className="font-medium text-gray-700">{perm}</td>
                  {Object.values(ROLES).map((role) => {
                    const allowed = PERMISSION_MATRIX[role.key][pIdx];
                    return (
                      <td key={role.key} className="text-center">
                        {allowed ? (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-ccm-green-50 text-ccm-green-600">
                            <Check size={14} />
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-50 text-gray-300">
                            <X size={14} />
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
