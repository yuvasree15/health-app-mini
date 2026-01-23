import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Stethoscope, 
  CalendarDays, 
  TestTube2, 
  MessageSquare, 
  ShoppingCart, 
  FileText, 
  MapPin, 
  Bell, 
  User, 
  LogOut,
  Menu,
  X,
  Users,
  Settings,
  ShieldAlert,
  Grid
} from 'lucide-react';
import { MOCK_USER } from '../constants';
import { UserRole } from '../types';

export const Layout: React.FC<{ children: React.ReactNode, cartCount: number, onLogout: () => void, userRole: UserRole }> = ({ children, cartCount, onLogout, userRole }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Close mobile menu on route change
  React.useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const patientNavItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Find Doctor', icon: Stethoscope, path: '/doctors' },
    { name: 'My Appointments', icon: CalendarDays, path: '/appointments' },
    { name: 'Lab Tests', icon: TestTube2, path: '/labs' },
    { name: 'Online Consult', icon: MessageSquare, path: '/consult' },
    { name: 'Medicine Order', icon: ShoppingCart, path: '/pharmacy' },
    { name: 'Health Records', icon: FileText, path: '/records' },
    { name: 'Clinic Finder', icon: MapPin, path: '/clinics' },
    { name: 'Notifications', icon: Bell, path: '/notifications' },
    { name: 'My Profile', icon: User, path: '/profile' },
  ];

  const doctorNavItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'My Schedule', icon: CalendarDays, path: '/appointments' },
    { name: 'My Patients', icon: Users, path: '/patients' }, 
    { name: 'Consultations', icon: MessageSquare, path: '/consult' },
    { name: 'Health Records', icon: FileText, path: '/records' },
    { name: 'Notifications', icon: Bell, path: '/notifications' },
    { name: 'Profile & Settings', icon: User, path: '/profile' },
  ];

  const adminNavItems = [
    { name: 'Overview', icon: Grid, path: '/' },
    { name: 'User Management', icon: User, path: '/users' },
    { name: 'Settings', icon: Settings, path: '/settings' },
  ];

  let navItems = patientNavItems;
  let userName = MOCK_USER.name;
  let userLabel = "Patient";
  let userInitial = MOCK_USER.name.split(' ').map(n => n[0]).join('');

  if (userRole === 'doctor') {
    navItems = doctorNavItems;
    userName = "Dr. Aarav Patel";
    userLabel = "Cardiologist";
    userInitial = "DA";
  } else if (userRole === 'admin') {
    navItems = adminNavItems;
    userName = "System Admin";
    userLabel = "Admin";
    userInitial = "SA";
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white border-r border-gray-100">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600">
           {userRole === 'admin' ? (
             <ShieldAlert className="w-5 h-5" />
           ) : (
             <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
           )}
        </div>
        <span className="text-xl font-bold text-gray-800">
          {userRole === 'admin' ? 'MediConnect' : 'HealthPlus'}
        </span>
      </div>

      <div className="p-4 border-b border-gray-100">
         <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${userRole === 'admin' ? 'bg-gray-800' : userRole === 'doctor' ? 'bg-primary-600' : 'bg-blue-600'}`}>
              {userInitial}
            </div>
            <div className="flex-1 min-w-0">
               <p className="text-sm font-bold text-gray-900 truncate">{userName}</p>
               <p className="text-xs text-gray-500 truncate">{userLabel}</p>
            </div>
         </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'text-primary-600 bg-primary-50'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <item.icon size={18} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <button 
          onClick={onLogout}
          className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 w-full transition-colors"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 fixed inset-y-0 left-0 z-50">
        <SidebarContent />
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600">
             {userRole === 'admin' ? (
               <ShieldAlert className="w-5 h-5" />
             ) : (
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
             )}
           </div>
           <span className="font-bold text-gray-800">
            {userRole === 'admin' ? 'MediConnect' : 'HealthPlus'}
           </span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-gray-600">
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="absolute top-0 left-0 bottom-0 w-64 bg-white shadow-xl animate-in slide-in-from-left-64 duration-300">
            <SidebarContent />
            <button 
              onClick={() => setIsMobileMenuOpen(false)} 
              className="absolute top-4 right-4 p-1 text-gray-400"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 pt-20 md:pt-8 w-full max-w-[100vw] overflow-x-hidden">
        {/* Simple floating cart button for mobile if needed, or integrate into sidebar */}
        {cartCount > 0 && userRole === 'patient' && (
           <div className="fixed bottom-6 right-6 z-40 md:hidden">
              <button 
                onClick={() => navigate('/cart')}
                className="bg-primary-600 text-white p-4 rounded-full shadow-lg flex items-center justify-center relative"
              >
                <ShoppingCart size={24} />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full border-2 border-white">
                  {cartCount}
                </span>
              </button>
           </div>
        )}
        {children}
      </main>
    </div>
  );
};