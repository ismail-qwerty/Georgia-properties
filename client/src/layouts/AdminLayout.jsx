import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function AdminLayout() {
  const location = useLocation();
  const { user, logout } = useAuth();

  const navLinks = [
    { path: '/administration', label: 'Users', icon: '👥' },
    { path: '/administration/properties', label: 'Properties', icon: '🏢' },
    { path: '/administration/memberships', label: 'Memberships', icon: '⭐' },
    { path: '/administration/recharges', label: 'Recharges', icon: '💰' },
    { path: '/administration/redemptions', label: 'Redemptions', icon: '💸' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-sidebar-900 text-white fixed h-full overflow-y-auto">
        <div className="p-6">
          <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center text-2xl font-bold mb-6">
            P
          </div>
          
          <div className="bg-sidebar-800 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-600 rounded-full"></div>
              <div>
                <p className="font-semibold text-sm">{user?.username}</p>
                <p className="text-xs text-gray-400">Administrator</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <input
              type="search"
              placeholder="Search..."
              className="w-full bg-sidebar-800 text-white px-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <nav className="space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  location.pathname === link.path
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-300 hover:bg-sidebar-800'
                }`}
              >
                <span className="text-xl">{link.icon}</span>
                <span className="font-medium">{link.label}</span>
              </Link>
            ))}
          </nav>

          <div className="mt-8 pt-8 border-t border-sidebar-700">
            <button
              onClick={logout}
              className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-sidebar-800 rounded-lg w-full transition-colors"
            >
              <span className="text-xl">🚪</span>
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      <main className="ml-64 flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}
