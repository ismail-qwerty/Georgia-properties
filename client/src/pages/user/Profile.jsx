import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { TierBadge, CurrencyDisplay, ProgressBar, LoadingSpinner } from '../../components/ui';
import api from '../../utils/api';

export default function Profile() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await api.user.getProfile();
      setProfile(data);
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyReferralCode = () => {
    if (profile?.reference_code) {
      navigator.clipboard.writeText(profile.reference_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const quickAccessMenu = [
    { label: 'Profile', path: '/profile', icon: '👤' },
    { label: 'Lots Optimization', path: '/lots-optimization', icon: '⭐' },
    { label: 'History', path: '/history', icon: '📋' },
    { label: 'Bind Wallet', path: '/bind-wallet', icon: '🔗' },
    { label: 'Recharge History', path: '/recharge-history', icon: '💳' },
    { label: 'Redemption', path: '/redemption', icon: '💰' },
    { label: 'Redemption History', path: '/redemption-history', icon: '📊' },
    { label: 'Support', path: '/support', icon: '💬' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* User Identity Banner */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-6">
          <div className="flex justify-end mb-4 space-x-3">
            <button
              onClick={handleCopyReferralCode}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center space-x-1"
            >
              <span>🔗</span>
              <span>{copied ? 'Copied!' : 'Copy Invite Code'}</span>
            </button>
            <button
              onClick={logout}
              className="text-sm text-gray-600 hover:text-gray-700 font-medium flex items-center space-x-1"
            >
              <span>🚪</span>
              <span>Logout</span>
            </button>
          </div>

          <div className="text-center">
            {/* Avatar */}
            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl text-gray-500">
              {user?.username?.charAt(0).toUpperCase() || '👤'}
            </div>

            {/* Username */}
            <h2 className="text-3xl font-bold text-primary-600 mb-3">
              {profile?.username}
            </h2>

            {/* Tier Badge */}
            <TierBadge tier={profile?.membership?.name || 'Silver'} size="md" />
          </div>
        </div>

        {/* Wallet Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Account Balance */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <p className="text-sm text-gray-600 mb-2">Account Balance</p>
            <p className="text-4xl font-bold text-primary-600">
              <CurrencyDisplay amount={profile?.wallet?.balance || 0} />
            </p>
          </div>

          {/* Today's Earnings */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-start mb-2">
              <p className="text-sm text-gray-600">Today's Earnings</p>
              <span className="text-green-600 text-xl">↗️</span>
            </div>
            <p className="text-4xl font-bold text-green-600">
              <CurrencyDisplay amount={profile?.wallet?.today_earnings || 0} />
            </p>
          </div>
        </div>

        {/* Credibility Progress */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <ProgressBar
            value={profile?.credibility || 100}
            max={100}
            label="Credibility"
            showPercentage={true}
            color="green"
          />
        </div>

        {/* Quick Access Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {quickAccessMenu.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow border border-gray-200 text-center group"
            >
              <div className="text-3xl mb-2">{item.icon}</div>
              <p className="text-xs font-semibold text-gray-700 group-hover:text-primary-600">
                {item.label}
              </p>
            </Link>
          ))}
        </div>

        {/* Logout Button */}
        <button
          onClick={logout}
          className="w-full bg-[#2563EB] hover:bg-blue-700 text-white font-semibold py-4 rounded-xl transition-colors flex items-center justify-center space-x-2"
        >
          <span>→</span>
          <span>Logout</span>
        </button>

        {/* Additional Stats */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{profile?.total_orders || 0}</p>
            <p className="text-xs text-gray-600 mt-1">Total Orders</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{profile?.orders_today || 0}</p>
            <p className="text-xs text-gray-600 mt-1">Orders Today</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">
              {profile?.membership?.order_limit || 35}
            </p>
            <p className="text-xs text-gray-600 mt-1">Daily Limit</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">
              {profile?.membership?.commission_rate || 0.5}%
            </p>
            <p className="text-xs text-gray-600 mt-1">Commission Rate</p>
          </div>
        </div>
      </div>
    </div>
  );
}
