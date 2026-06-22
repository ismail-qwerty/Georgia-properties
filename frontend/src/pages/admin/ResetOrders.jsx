import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { LoadingSpinner } from '../../components/ui';
import api from '../../utils/api';

export default function ResetOrders() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [assignedLots, setAssignedLots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserOrders();
  }, [id]);

  const fetchUserOrders = async () => {
    setLoading(true);
    try {
      const userResponse = await api.admin.getUserById(id);
      setUser(userResponse.data.data);
      
      // Fetch assigned special lots
      const lotsResponse = await api.get(`/admin/users/${id}/special-lots`);
      setAssignedLots(lotsResponse.data.data || []);
    } catch (err) {
      console.error('Failed to fetch user orders:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Setup Orders</h1>
          <p className="text-sm text-gray-600 mt-1">
            <Link to="/administration" className="text-blue-600 hover:underline">Home</Link>
            <span className="mx-2">/</span>
            <span>Setup Orders</span>
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-blue-600 px-6 py-4">
          <h2 className="text-xl font-bold text-white">
            Setup Orders for {user?.username}
          </h2>
        </div>

        <div className="p-8">
          {assignedLots.length === 0 ? (
            <>
              <p className="text-gray-600 mb-6">No orders selected for this user.</p>
              <button
                onClick={() => navigate(`/administration/reset-single/${id}`)}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
              >
                Setup Order
              </button>
            </>
          ) : (
            <>
              <p className="text-green-600 font-semibold mb-4">
                {assignedLots.length} Special Lot(s) Assigned
              </p>
              
              <div className="space-y-4 mb-6">
                {assignedLots.map((lot) => (
                  <div key={lot.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-gray-900">{lot.properties?.name || lot.special_lots?.title || 'Special Lot'}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          Appears after order: <span className="font-semibold">{lot.trigger_after_order_no}</span>
                        </p>
                        <p className="text-sm text-gray-600">
                          Price: <span className="font-semibold text-red-600">VIEWS {lot.lot_value}</span>
                        </p>
                        <p className="text-sm text-gray-600">
                          Daily Commission: <span className="font-semibold text-green-600">VIEWS {lot.daily_commission} (2.5%)</span>
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        lot.status === 'Completed' ? 'bg-green-100 text-green-700' :
                        lot.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {lot.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => navigate(`/administration/reset-single/${id}`)}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
              >
                Add More Orders
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
