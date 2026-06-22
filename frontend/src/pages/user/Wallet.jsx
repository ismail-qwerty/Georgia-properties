import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { CurrencyDisplay, LoadingSpinner } from '../../components/ui';

export default function Wallet() {
  const navigate = useNavigate();
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWallet();
  }, []);

  const fetchWallet = async () => {
    try {
      const response = await api.user.getWallet();
      setWallet(response.data.data);
    } catch (error) {
      console.error('Failed to fetch wallet:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-teal-600 to-teal-400 text-white p-6">
        <h1 className="text-2xl font-bold">My Wallet</h1>
        <p className="text-teal-50 mt-1">Manage your account balance</p>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <div className="grid gap-6">
          {/* Current Balance */}
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <h2 className="text-gray-500 text-sm uppercase tracking-wide mb-2">
              Current Balance
            </h2>
            <div className="text-4xl font-bold text-teal-600">
              <CurrencyDisplay amount={wallet?.balance || 0} />
            </div>
          </div>

          {/* Wallet Statistics */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-gray-500 text-sm mb-2">Total Recharged</div>
              <div className="text-2xl font-bold text-blue-600">
                <CurrencyDisplay amount={wallet?.total_recharged || 0} />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-gray-500 text-sm mb-2">Total Earned</div>
              <div className="text-2xl font-bold text-green-600">
                <CurrencyDisplay amount={wallet?.total_earned || 0} />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-gray-500 text-sm mb-2">Total Withdrawn</div>
              <div className="text-2xl font-bold text-orange-600">
                <CurrencyDisplay amount={wallet?.total_withdrawn || 0} />
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Quick Actions</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <button
                onClick={() => navigate('/recharge-history')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                View Deposit History
              </button>
              <button
                onClick={() => navigate('/redemption')}
                className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium"
              >
                Request Withdrawal
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
