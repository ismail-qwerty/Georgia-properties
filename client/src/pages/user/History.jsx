import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { StatusBadge, StarRating, CurrencyDisplay, EmptyState, LoadingSpinner } from '../../components/ui';
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
      setOrders(data.orders || []);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // YYYY-MM-DD format
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Minimal Navbar */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">BROOKFIELD PROPERTIES</h1>
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-600">
            {user?.username?.charAt(0).toUpperCase() || '👤'}
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filter Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="flex border-b border-gray-200">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`flex-1 py-4 px-6 font-semibold transition-colors ${
                  activeFilter === filter
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : orders.length === 0 ? (
            <EmptyState
              message="No tasks found"
              icon="📋"
            />
          ) : (
            <div className="divide-y divide-gray-200">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center space-x-4 p-6 hover:bg-gray-50 transition-colors"
                >
                  {/* Timeline */}
                  <div className="flex-shrink-0 w-24">
                    <p className="text-sm text-gray-600 font-medium">
                      {formatDate(order.created_at)}
                    </p>
                  </div>

                  {/* Property Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={order.property?.image_url || '/placeholder-property.jpg'}
                      alt={order.property?.title}
                      className="w-20 h-20 rounded-lg object-cover border border-gray-200"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80"%3E%3Crect fill="%23e5e7eb" width="80" height="80"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%239ca3af" font-size="24"%3E🏢%3C/text%3E%3C/svg%3E';
                      }}
                    />
                  </div>

                  {/* Property Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg text-gray-900 mb-1 truncate">
                      {order.property?.title || 'Property'}
                    </h3>
                    <StarRating rating={5} size="sm" />
                  </div>

                  {/* Accounting Fields */}
                  <div className="flex-shrink-0 text-right">
                    <div className="mb-2">
                      <p className="text-xs text-gray-500 mb-1">Total Amount</p>
                      <p className="font-semibold text-primary-600">
                        <CurrencyDisplay amount={order.task_value} />
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Commission</p>
                      <p className="font-semibold text-primary-600">
                        <CurrencyDisplay amount={order.commission} />
                      </p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex-shrink-0">
                    <StatusBadge status={order.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
