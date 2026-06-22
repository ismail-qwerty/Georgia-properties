import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';

export default function RechargeHistory() {
  const { user } = useAuth();
  const [recharges, setRecharges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecharges();
  }, []);

  const fetchRecharges = async () => {
    try {
      const response = await api.user.getRecharges();
      setRecharges(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch recharge history:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-b from-[#5DBDAE] to-[#7DCCC4] py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl font-bold text-white text-center mb-4">Recharge History</h1>
          <div className="flex items-center justify-center gap-2 text-white text-sm">
            <Link to="/dashboard" className="hover:underline">Dashboard</Link>
            <span>|</span>
            <span>Recharge History</span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">
          Recent Recharges - {user?.username}
        </h2>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : recharges.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <p className="text-gray-500">No recharge records found</p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">#</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Amount (VIEWS)</th>
                  </tr>
                </thead>
                <tbody>
                  {recharges.map((recharge, index) => (
                    <tr key={recharge.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="px-6 py-4 text-sm text-gray-900">{index + 1}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {new Date(recharge.created_at).toISOString().split('T')[0]}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {parseFloat(recharge.amount).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-6">
              <Link
                to="/recharge"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
              >
                Recharge
              </Link>
            </div>
          </>
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
