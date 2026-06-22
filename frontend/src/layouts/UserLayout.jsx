import { Outlet, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function UserLayout() {
  const location = useLocation();
  const { logout } = useAuth();
  
  const isDataOptimization = location.pathname === '/data-optimization';
  
  if (isDataOptimization) {
    return <Outlet />;
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="backdrop-blur-lg bg-blue-900/80 relative z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link to="/dashboard" className="flex items-center">
              <img src="/BR logo.webp" alt="Brookfield Properties" className="h-10" />
            </Link>
            
            <div className="flex items-center space-x-6">
              <Link to="/dashboard" className="text-white hover:text-white/80">
                Dashboard
              </Link>
              <Link to="/data-optimization" className="text-white hover:text-white/80">
                Data Optimization
              </Link>
              <Link to="/history" className="text-white hover:text-white/80">
                History
              </Link>
              <Link to="/profile" className="text-white hover:text-white/80">
                Profile
              </Link>
              <Link to="/wallet" className="text-white hover:text-white/80">
                Wallet
              </Link>
              <Link to="/support" className="border-2 border-white text-white hover:bg-white/20 px-4 py-2 rounded-lg">
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
