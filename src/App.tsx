import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import LoginPage from '@/pages/LoginPage';
import SignupPage from '@/pages/SignupPage';
import DashboardPage from '@/pages/DashboardPage';
import UniversitiesPage from '@/pages/UniversitiesPage';
import MembersPage from '@/pages/MembersPage';
import UsersPage from '@/pages/UsersPage';
import RolesPage from '@/pages/RolesPage';
import EventsPage from '@/pages/EventsPage';
import AttendancePage from '@/pages/AttendancePage';
import ReportsPage from '@/pages/ReportsPage';
import AuditPage from '@/pages/AuditPage';
import SettingsPage from '@/pages/SettingsPage';
import NotificationsPage from '@/pages/NotificationsPage';
import { useAuth } from '@/context/AuthContext';
import type { AppRole } from '@/types/navigation';
import { NAV_ITEMS } from '@/types/navigation';

function App() {
  const { user, userRole, loading, signOut } = useAuth();
  const [authView, setAuthView] = useState<'login' | 'signup'>('login');
  const [activePage, setActivePage] = useState('dashboard');

  // Redirect to dashboard whenever user logs in
  useEffect(() => {
    if (user) {
      setActivePage('dashboard');
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 size={32} className="animate-spin text-ccm-green-600" />
      </div>
    );
  }

  if (!user) {
    return authView === 'login' ? (
      <LoginPage onSwitchToSignup={() => setAuthView('signup')} />
    ) : (
      <SignupPage onSwitchToLogin={() => setAuthView('login')} />
    );
  }

  // If user is logged in but has no role assigned yet
  if (!userRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="w-full max-w-md">
          <div className="card p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-ccm-gold-50 flex items-center justify-center mx-auto mb-4">
              <Loader2 size={28} className="text-ccm-gold-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Unasubiri Idhini</h2>
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">
              Akaunti yako imeundwa lakini bado msimamizi hajakupa jukumu.
              Tafadhali wasiliana na msimamizi wa mfumo ili akusanye jukumu na chuo chako.
            </p>
            <button onClick={signOut} className="btn-secondary w-full mt-6 py-3">
              Toka Mfumoni
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Check if current page is allowed for user's role
  const navItem = NAV_ITEMS.find((n) => n.id === activePage);
  if (navItem && !navItem.roles.includes(userRole)) {
    setActivePage('dashboard');
  }

  // Get display name from user metadata
  const userName = user.user_metadata?.full_name || user.email || 'Mtumiaji';

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <DashboardPage userName={userName} />;
      case 'universities':
        return <UniversitiesPage />;
      case 'members':
        return <MembersPage />;
      case 'users':
        return <UsersPage />;
      case 'roles':
        return <RolesPage />;
      case 'events':
        return <EventsPage />;
      case 'attendance':
        return <AttendancePage />;
      case 'reports':
        return <ReportsPage />;
      case 'audit':
        return <AuditPage />;
      case 'settings':
        return <SettingsPage />;
      case 'notifications':
        return <NotificationsPage />;
      default:
        return <DashboardPage userName={userName} />;
    }
  };

  return (
    <AppLayout
      activePage={activePage}
      onNavigate={setActivePage}
      userRole={userRole as AppRole}
      userName={userName}
      onSignOut={signOut}
    >
      {renderPage()}
    </AppLayout>
  );
}

export default App;
