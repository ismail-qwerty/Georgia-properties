import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../utils/api';

export default function DataOptimization() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    balance: 0,
    todayEarnings: 0,
    ordersToday: 0,
    totalOrders: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAlert, setShowAlert] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchStats();
    
    // Check for success message from navigation
    if (location.state?.success && location.state?.message) {
      setSuccessMessage(location.state.message);
      // Clear the state
      navigate(location.pathname, { replace: true, state: {} });
      
      // Auto-hide after 5 seconds
      setTimeout(() => setSuccessMessage(''), 5000);
    }
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.user.getProfile();
      const profileData = response.data.data;
      
      const tierLimit = profileData?.membership?.order_limit || 35;
      
      setStats({
        balance: profileData?.wallet?.balance || 0,
        todayEarnings: profileData?.today_earnings || 0,
        ordersToday: profileData?.orders_today || 0,
        totalOrders: tierLimit,
      });
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const handleGenerateLots = async () => {
    setError('');
    setLoading(true);

    try {
      const response = await api.user.generateLots();
      const data = response.data.data;
      
      // Navigate to submit order page with order data
      navigate('/submit-order', { 
        state: { 
          orderData: data 
        } 
      });
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.response?.data?.message || 'Failed to generate lots';
      setError(errorMsg);
      console.error('Generate lots error:', err.response?.data);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#000000' }}>
      {/* Header with Navigation */}
      <header className="bg-white py-4 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold" style={{ letterSpacing: '0.5px' }}>
                BROOKFIELD<br/>PROPERTIES
              </h1>
            </div>
            <nav className="flex items-center gap-8">
              <Link to="/dashboard" className="text-gray-700 hover:text-gray-900 font-medium">Dashboard</Link>
              <Link to="/data-optimization" className="text-gray-700 hover:text-gray-900 font-medium">Generate Lots</Link>
              <Link to="/history" className="text-gray-700 hover:text-gray-900 font-medium">History</Link>
              <Link to="/profile" className="text-gray-700 hover:text-gray-900 font-medium">Profile</Link>
              <Link to="/wallet" className="text-gray-700 hover:text-gray-900 font-medium">Wallet</Link>
              <button onClick={() => window.dispatchEvent(new Event('open-chat-widget'))} className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 font-medium">
                Contact
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Alert Banner */}
      {showAlert && stats.balance < 0 && (
        <div className="container mx-auto px-4 mt-8">
          <div className="max-w-4xl mx-auto bg-yellow-100 border border-yellow-300 rounded-lg p-4 flex items-start justify-between">
            <div className="flex items-start gap-3">
              <i className="fa fa-exclamation-circle text-yellow-600 text-xl mt-1"></i>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Low Balance</h3>
                <p className="text-gray-800">Your account balance is negative ${Math.abs(stats.balance).toFixed(2)} for next lot. Please contact support.</p>
              </div>
            </div>
            <button onClick={() => setShowAlert(false)} className="text-gray-600 hover:text-gray-800 text-xl">
              ×
            </button>
          </div>
        </div>
      )}

      {/* Welcome Section */}
      <section className="py-16" style={{
        background: 'linear-gradient(135deg, #1a4d2e 0%, #0f2818 100%)'
      }}>
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-white mb-3">
            Welcome back, {user?.username}!
          </h2>
          <p className="text-xl text-gray-200">
            Monitor your funds, earnings, and orders at a glance.
          </p>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Account Balance */}
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center">
                  <i className="fa fa-dollar text-xl" style={{ color: '#FFD700' }}></i>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">
                    ${stats.balance.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-400">Account Balance</div>
                </div>
              </div>
            </div>

            {/* Today's Earnings */}
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center">
                  <i className="fa fa-line-chart text-blue-400 text-xl"></i>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">
                    ${stats.todayEarnings.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-400">Today's Earnings</div>
                </div>
              </div>
            </div>

            {/* Orders Today */}
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center">
                  <i className="fa fa-check-square-o text-yellow-500 text-xl"></i>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">
                    {stats.ordersToday}
                  </div>
                  <div className="text-sm text-gray-400">Orders Today</div>
                </div>
              </div>
            </div>

            {/* Total Orders */}
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center">
                  <i className="fa fa-list-ul text-blue-500 text-xl"></i>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">
                    {stats.totalOrders}
                  </div>
                  <div className="text-sm text-gray-400">Total Orders</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Generate Button Section */}
      <section className="py-8">
        <div className="container mx-auto px-4 text-center">
          <button
            onClick={handleGenerateLots}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-12 py-4 rounded-lg shadow-xl text-lg inline-flex items-center gap-3 disabled:opacity-50 transition-all"
          >
            <i className="fa fa-cogs text-xl"></i>
            <span>{loading ? 'Processing...' : 'Generate Lots'}</span>
          </button>
        </div>
      </section>

      {/* Messages */}
      {successMessage && (
        <div className="container mx-auto px-4 pb-4">
          <div className="max-w-2xl mx-auto bg-green-50 border border-green-200 rounded-lg p-4 text-center text-green-700">
            <i className="fa fa-check-circle mr-2"></i>
            {successMessage}
          </div>
        </div>
      )}
      
      {error && (
        <div className="container mx-auto px-4 pb-8">
          <div className="max-w-2xl mx-auto bg-red-50 border border-red-200 rounded-lg p-4 text-center text-red-700">
            <i className="fa fa-exclamation-circle mr-2"></i>
            {error}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-12 border-t border-gray-800">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">BROOKFIELD<br/>PROPERTIES</h3>
            <p className="text-sm text-gray-400">
              Brookfield Properties — trusted real estate & services. Manage your account, wallet and orders from your dashboard.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Helpful Links</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/recharge" className="hover:text-white">› Recharge</Link></li>
              <li><Link to="/redemption" className="hover:text-white">› Redeem</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Account</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/dashboard" className="hover:text-white">› Dashboard</Link></li>
              <li><Link to="/data-optimization" className="hover:text-white">› Generate Lots</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Contact</h4>
            <p className="text-sm text-gray-400">455 West Orchard Street<br/>Kings Mountain, NC 28086<br/>Phone: (272) 211-7370</p>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm text-gray-400 container mx-auto px-4">
          <p>© 2025 Brookfield Properties. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}
