import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';

export default function RedemptionHistory() {
  const { user } = useAuth();
  const [redemptions, setRedemptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRedemptions();
  }, []);

  const fetchRedemptions = async () => {
    try {
      const response = await api.user.getRedemptions();
      setRedemptions(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch redemption history:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-b from-[#5DBDAE] to-[#7DCCC4] py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl font-bold text-white text-center mb-4">Redemption History</h1>
          <div className="flex items-center justify-center gap-2 text-white text-sm">
            <Link to="/dashboard" className="hover:underline">Dashboard</Link>
            <span>|</span>
            <span>Redemption History</span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">
          Recent Redemptions - {user?.username}
        </h2>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : redemptions.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <p className="text-gray-500">No redemption records found</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">#</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Amount (VIEWS)</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Wallet Address</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {redemptions.map((redemption, index) => (
                  <tr key={redemption.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="px-6 py-4 text-sm text-gray-900">{index + 1}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {new Date(redemption.created_at).toISOString().split('T')[0]}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {parseFloat(redemption.amount).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {redemption.wallet_address}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          redemption.status === 'Approved'
                            ? 'bg-green-100 text-green-800'
                            : redemption.status === 'Pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {redemption.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-[#5DBDAE] mt-20 py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-3 gap-8 text-white">
            <div>
              <h3 className="text-xl font-bold mb-4">BROOKFIELD<br/>PROPERTIES</h3>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Helpful Links</h4>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Account</h4>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Contact</h4>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
