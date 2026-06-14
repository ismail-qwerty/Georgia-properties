import { Outlet, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function UserLayout() {
  const location = useLocation();
  const { logout } = useAuth();
  
  const isDataOptimization = location.pathname === '/data-optimization';
  
  if (isDataOptimization) {
    return (
      <div className="min-h-screen bg-black">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <Link to="/dashboard" className="text-xl font-bold text-gray-900">
              BROOKFIELD PROPERTIES
            </Link>
            <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg">
              Contact Support
            </button>
          </div>
        </nav>
        <Outlet />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-primary-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link to="/dashboard" className="text-white text-xl font-bold">
              BROOKFIELD PROPERTIES
            </Link>
            
            <div className="flex items-center space-x-6">
              <Link to="/dashboard" className="text-white hover:text-primary-100">
                Dashboard
              </Link>
              <Link to="/data-optimization" className="text-white hover:text-primary-100">
                Data Optimization
              </Link>
              <Link to="/history" className="text-white hover:text-primary-100">
                History
              </Link>
              <Link to="/profile" className="text-white hover:text-primary-100">
                Profile
              </Link>
              <Link to="/wallet" className="text-white hover:text-primary-100">
                Wallet
              </Link>
              <Link to="/support" className="border-2 border-white text-white hover:bg-primary-700 px-4 py-2 rounded-lg">
                Support
              </Link>
            </div>
          </div>
        </div>
      </nav>
      
      <Outlet />
      
      <footer className="bg-primary-600 text-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">BROOKFIELD PROPERTIES</h3>
              <p className="text-primary-100">455 West Orchard Street</p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Helpful Links</h4>
              <ul className="space-y-2 text-primary-100">
                <li><Link to="/dashboard">Dashboard</Link></li>
                <li><Link to="/profile">Profile</Link></li>
                <li><Link to="/support">Support</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Account</h4>
              <ul className="space-y-2 text-primary-100">
                <li><Link to="/wallet">Wallet</Link></li>
                <li><Link to="/history">History</Link></li>
                <li><button onClick={logout}>Logout</button></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
