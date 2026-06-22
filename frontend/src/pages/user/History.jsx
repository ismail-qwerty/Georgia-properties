import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../utils/api';

export default function History() {
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState('All');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const filters = ['All', 'Pending', 'Completed', 'Undone'];

  useEffect(() => {
    fetchOrders();
  }, [activeFilter]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await api.user.getOrderHistory(
        activeFilter === 'All' ? undefined : activeFilter
      );
      setOrders(data.data?.orders || data.orders || []);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      console.error('Error response:', err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar - Same as Dashboard */}
      <nav className="bg-white shadow-sm py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <img src="/BR logo.webp" alt="BR Logo" className="h-12" />
          <button onClick={() => window.dispatchEvent(new Event('open-chat-widget'))} className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
            Contact Support
          </button>
        </div>
      </nav>

      {/* Filter Tabs */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`py-4 px-8 font-medium transition-colors relative ${
                  activeFilter === filter
                    ? 'text-blue-600'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {filter}
                {activeFilter === filter && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No tasks found</div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white border-b border-gray-100 pb-6 flex items-start gap-4"
              >
                {/* Date */}
                <div className="text-sm text-gray-400 w-24 pt-2">
                  {formatDate(order.created_at)}
                </div>

                {/* Property Image */}
                <img
                  src={order.properties?.image_url || '/placeholder.jpg'}
                  alt={order.properties?.name}
                  className="w-16 h-16 rounded object-cover"
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="64" height="64"%3E%3Crect fill="%23e5e7eb" width="64" height="64"/%3E%3C/svg%3E';
                  }}
                />

                {/* Property Details */}
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {order.properties?.name || 'Property'}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    VIEWS {parseFloat(order.properties?.value || 0).toFixed(2)}
                  </p>
                  <div className="flex text-yellow-400 text-sm">
                    {'★★★★★'}
                  </div>
                  <div className="mt-3 flex gap-16">
                    <div>
                      <p className="text-xs text-gray-400">Total Amount</p>
                      <p className="text-sm font-semibold text-blue-600">
                        VIEWS {parseFloat(order.properties?.value || 0).toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Commission</p>
                      <p className="text-sm font-semibold text-blue-600">
                        VIEWS {parseFloat(order.commission || 0).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="pt-2">
                  <span
                    className={`inline-block px-4 py-1 rounded-full text-xs font-semibold ${
                      order.status === 'Completed'
                        ? 'bg-green-500 text-white'
                        : order.status === 'Pending'
                        ? 'bg-yellow-500 text-white'
                        : 'bg-red-500 text-white'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
