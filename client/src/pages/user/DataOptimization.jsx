import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { CurrencyDisplay, LoadingSpinner } from '../../components/ui';
import api from '../../utils/api';

export default function DataOptimization() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    balance: 0,
    todayEarnings: 0,
    ordersToday: 0,
    orderLimit: 35,
    totalOrders: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await api.user.getProfile();
      setStats({
        balance: data.wallet?.balance || 0,
        todayEarnings: data.wallet?.today_earnings || 0,
        ordersToday: data.orders_today || 0,
        orderLimit: data.membership?.order_limit || 35,
        totalOrders: data.total_orders || 0,
      });
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const handleGenerateLots = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const { data } = await api.user.generateLots();
      setSuccess(
        `Task completed! Earned ${data.commission.toFixed(2)} VIEWS. Property: ${data.property_title}`
      );
      await fetchStats();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate lots. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Dark Gradient Container */}
      <div className="bg-gradient-to-b from-[#1A2E1A] to-black py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Stats Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Account Balance */}
            <div className="bg-[#1C1C1E] rounded-2xl p-6 text-white">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center text-2xl">
                  💰
                </div>
                <div className="flex-1">
                  <p className="text-gray-400 text-sm mb-1">Account Balance</p>
                  <p className="text-xl font-bold">
                    <CurrencyDisplay amount={stats.balance} className="text-white" />
                  </p>
                </div>
              </div>
            </div>

            {/* Today's Earnings */}
            <div className="bg-[#1C1C1E] rounded-2xl p-6 text-white">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center text-2xl">
                  📈
                </div>
                <div className="flex-1">
                  <p className="text-gray-400 text-sm mb-1">Today's Earnings</p>
                  <p className="text-xl font-bold">
                    <CurrencyDisplay amount={stats.todayEarnings} className="text-white" />
                  </p>
                </div>
              </div>
            </div>

            {/* Orders Today */}
            <div className="bg-[#1C1C1E] rounded-2xl p-6 text-white">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-2xl">
                  ✅
                </div>
                <div className="flex-1">
                  <p className="text-gray-400 text-sm mb-1">Orders Today</p>
                  <p className="text-xl font-bold">
                    {stats.ordersToday} / {stats.orderLimit}
                  </p>
                </div>
              </div>
            </div>

            {/* Total Orders */}
            <div className="bg-[#1C1C1E] rounded-2xl p-6 text-white">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-2xl">
                  📋
                </div>
                <div className="flex-1">
                  <p className="text-gray-400 text-sm mb-1">Total Orders</p>
                  <p className="text-xl font-bold">{stats.totalOrders}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Success/Error Messages */}
          {success && (
            <div className="mb-6 p-4 bg-green-900/50 border border-green-700 rounded-lg text-green-200 text-sm">
              {success}
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-200 text-sm">
              {error}
            </div>
          )}

          {/* Generate Lots Button */}
          <div className="flex justify-center">
            <button
              onClick={handleGenerateLots}
              disabled={loading || stats.ordersToday >= stats.orderLimit}
              className="bg-[#2563EB] hover:bg-blue-700 text-white font-bold px-16 py-5 rounded-full text-lg flex items-center space-x-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              <span className="text-2xl">⚙️</span>
              <span>{loading ? 'Processing...' : 'Generate Lots'}</span>
              {loading && <LoadingSpinner size="sm" color="white" />}
            </button>
          </div>

          {/* Daily Limit Warning */}
          {stats.ordersToday >= stats.orderLimit && (
            <div className="mt-6 text-center">
              <p className="text-yellow-400 text-sm">
                Daily limit reached ({stats.orderLimit} orders). Come back tomorrow!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
