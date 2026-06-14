import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { LoadingSpinner, CurrencyDisplay, EmptyState } from '../../components/ui';
import api from '../../utils/api';

export default function ResetSingleOrder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [user, setUser] = useState(null);
  const [properties, setProperties] = useState([]);
  const [selectedProperties, setSelectedProperties] = useState([]);
  const [sequenceAfterOrderNo, setSequenceAfterOrderNo] = useState(0);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [userRes, propertiesRes] = await Promise.all([
        api.admin.getUserById(id),
        api.admin.getProperties(),
      ]);
      
      setUser(userRes.data);
      setProperties(propertiesRes.data.properties || []);
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = (propertyId) => {
    setSelectedProperties(prev => {
      if (prev.includes(propertyId)) {
        return prev.filter(id => id !== propertyId);
      } else {
        if (prev.length >= 3) {
          setError('You can only select exactly 3 properties');
          return prev;
        }
        return [...prev, propertyId];
      }
    });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (selectedProperties.length !== 3) {
      setError('You must select exactly 3 properties');
      return;
    }

    setSaving(true);

    try {
      await api.admin.assignOrders(id, {
        property_ids: selectedProperties,
        sequence_after_order_no: parseInt(sequenceAfterOrderNo),
      });
      setSuccess('Orders assigned successfully! Redirecting...');
      setTimeout(() => navigate('/administration'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to assign orders');
    } finally {
      setSaving(false);
    }
  };

  const getSelectedProperty = (propertyId) => {
    return properties.find(p => p.id === propertyId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <Link
            to="/administration"
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            ← Back to Users
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Task Allocation Control Center</h1>
        <p className="text-gray-600 mt-1">
          Assign exactly 3 properties to user: <span className="font-semibold text-gray-900">{user?.username}</span>
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* User Info Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">User Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Username</p>
              <p className="font-semibold text-gray-900">{user?.username}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Current Balance</p>
              <p className="font-semibold text-primary-600">
                <CurrencyDisplay amount={user?.wallet?.balance || 0} />
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Orders</p>
              <p className="font-semibold text-gray-900">{user?.total_orders || 0}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Membership</p>
              <p className="font-semibold text-gray-900">{user?.membership?.name || 'Silver'}</p>
            </div>
          </div>
        </div>

        {/* Sequence Gating Parameter */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Sequence Gating Configuration</h2>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-amber-900">
              <strong>⚠️ Important:</strong> The assigned properties will remain locked until the user's 
              Total Orders count exceeds the value specified below. This creates a sequential unlock mechanism.
            </p>
          </div>
          <div className="max-w-md">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              After Order Number
            </label>
            <input
              type="number"
              value={sequenceAfterOrderNo}
              onChange={(e) => setSequenceAfterOrderNo(e.target.value)}
              min="0"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="0"
              required
            />
            <p className="text-xs text-gray-500 mt-2">
              Properties will unlock after user completes <strong>{sequenceAfterOrderNo}</strong> orders
            </p>
          </div>
        </div>

        {/* Selection Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Property Selection</h2>
            <div className="flex items-center space-x-2">
              <span className={`text-lg font-bold ${selectedProperties.length === 3 ? 'text-green-600' : 'text-gray-900'}`}>
                {selectedProperties.length} / 3
              </span>
              <span className="text-sm text-gray-600">properties selected</span>
            </div>
          </div>
          
          {selectedProperties.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-sm font-semibold text-blue-900 mb-2">Selected Properties:</p>
              <div className="space-y-2">
                {selectedProperties.map((propId) => {
                  const prop = getSelectedProperty(propId);
                  return prop ? (
                    <div key={propId} className="flex items-center justify-between bg-white rounded px-3 py-2">
                      <span className="text-sm font-medium text-gray-900">{prop.title}</span>
                      <CurrencyDisplay amount={prop.price} className="text-primary-600 text-sm" />
                    </div>
                  ) : null;
                })}
              </div>
            </div>
          )}
        </div>

        {/* Properties Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Master Property Catalog</h2>
            <p className="text-sm text-gray-600 mt-1">Select exactly 3 properties to assign to this user</p>
          </div>
          
          {properties.length === 0 ? (
            <EmptyState message="No properties available" icon="🏢" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        disabled
                        className="w-4 h-4 rounded border-gray-300"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Image</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Commission</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {properties.filter(p => p.status === 'Active').map((property) => {
                    const isSelected = selectedProperties.includes(property.id);
                    const commission = (property.price * (user?.membership?.commission_rate || 0.5)) / 100;
                    
                    return (
                      <tr
                        key={property.id}
                        className={`hover:bg-gray-50 cursor-pointer ${isSelected ? 'bg-blue-50' : ''}`}
                        onClick={() => handleCheckboxChange(property.id)}
                      >
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleCheckboxChange(property.id)}
                            className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                          />
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{property.id}</td>
                        <td className="px-6 py-4">
                          <img
                            src={property.image_url}
                            alt={property.title}
                            className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                            onError={(e) => {
                              e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"%3E%3Crect fill="%23e5e7eb" width="64" height="64"/%3E%3Ctext x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%239ca3af" font-size="20"%3E🏢%3C/text%3E%3C/svg%3E';
                            }}
                          />
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-medium text-gray-900">{property.title}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-600 max-w-xs truncate">{property.description}</p>
                        </td>
                        <td className="px-6 py-4">
                          <CurrencyDisplay amount={property.price} className="text-primary-600 font-semibold" />
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                            {property.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <CurrencyDisplay amount={commission} className="text-green-600 font-semibold text-sm" />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => navigate('/administration')}
            className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving || selectedProperties.length !== 3}
            className="flex-1 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {saving ? (
              <>
                <LoadingSpinner size="sm" color="white" />
                <span>Assigning Orders...</span>
              </>
            ) : (
              <span>Assign {selectedProperties.length}/3 Properties</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
