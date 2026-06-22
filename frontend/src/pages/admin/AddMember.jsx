import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LoadingSpinner } from '../../components/ui';
import api from '../../utils/api';

export default function AddMember() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [memberships, setMemberships] = useState([]);
  const [formData, setFormData] = useState({
    username: '',
    full_name: '',
    parent_id: '',
    phone: '',
    email: '',
    password: '',
    wallet_password: '',
    credibility: '100',
    opening_balance: '0',
    min_withdrawal: '50',
    max_withdrawal: '500',
    user_type: 'User',
    tier_id: '1',
  });

  useEffect(() => {
    fetchMemberships();
  }, []);

  const fetchMemberships = async () => {
    try {
      const response = await api.admin.getMemberships();
      setMemberships(response.data.data.memberships || []);
    } catch (err) {
      console.error('Failed to fetch memberships:', err);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.username || !formData.full_name || !formData.email || !formData.phone || !formData.password || !formData.wallet_password) {
      setError('Username, Full Name, Email, Phone, Password, and Wallet Password are required');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (!/[A-Za-z]/.test(formData.password)) {
      setError('Password must contain at least one letter');
      return;
    }

    if (!/[0-9]/.test(formData.password)) {
      setError('Password must contain at least one number');
      return;
    }

    if (!/[0-9]/.test(formData.wallet_password)) {
      setError('Wallet password must contain at least one number');
      return;
    }

    if (parseInt(formData.credibility) < 0 || parseInt(formData.credibility) > 100) {
      setError('Credibility must be between 0 and 100');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        username: formData.username,
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        confirm_password: formData.password,
        wallet_password: formData.wallet_password,
      };

      const registerResponse = await api.auth.register(payload);
      const newUserId = registerResponse.data.data.user.id;

      const updatePayload = {
        tier_id: parseInt(formData.tier_id),
        credibility: parseInt(formData.credibility),
        min_withdrawal: parseFloat(formData.min_withdrawal),
        max_withdrawal: parseFloat(formData.max_withdrawal),
        user_type: formData.user_type,
      };

      if (formData.parent_id) {
        updatePayload.referrer_id = parseInt(formData.parent_id);
      }

      if (formData.opening_balance && parseFloat(formData.opening_balance) !== 0) {
        updatePayload.balance_adjustment = parseFloat(formData.opening_balance);
      }

      await api.admin.updateUser(newUserId, updatePayload);

      alert('Member registered successfully!');
      navigate('/administration');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to register member');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Add Member</h1>
        <p className="text-sm text-gray-600 mt-1">
          <Link to="/administration" className="text-blue-600 hover:underline">Home</Link>
          <span className="mx-2">/</span>
          <span>Add Member</span>
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-blue-600 px-6 py-4">
          <h2 className="text-xl font-bold text-white">Member Data</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter Username"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Complete Name
              </label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter Complete Name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                ParentID
              </label>
              <input
                type="number"
                name="parent_id"
                value={formData.parent_id}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter ParentID"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter Phone Number"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter Email Address"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="*********"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Wallet Password
              </label>
              <input
                type="password"
                name="wallet_password"
                value={formData.wallet_password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="*********"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Credibility
              </label>
              <input
                type="number"
                name="credibility"
                value={formData.credibility}
                onChange={handleChange}
                min="0"
                max="100"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter Credibility"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Opening Balance
              </label>
              <input
                type="number"
                name="opening_balance"
                value={formData.opening_balance}
                onChange={handleChange}
                step="0.01"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter Opening Balance"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Minimum Withdraw
              </label>
              <input
                type="number"
                name="min_withdrawal"
                value={formData.min_withdrawal}
                onChange={handleChange}
                step="0.01"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Set Minimum Withdraw Amount"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Maximum Withdraw
              </label>
              <input
                type="number"
                name="max_withdrawal"
                value={formData.max_withdrawal}
                onChange={handleChange}
                step="0.01"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Set Maximum Withdraw Amount"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                User Type
              </label>
              <select
                name="user_type"
                value={formData.user_type}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="User">User</option>
                <option value="Admin">Admin</option>
                <option value="ChatSupport">Chat Support</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Membership Level
              </label>
              <select
                name="tier_id"
                value={formData.tier_id}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {memberships.map((tier) => (
                  <option key={tier.id} value={tier.id}>
                    {tier.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/administration')}
              className="px-8 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" color="white" />
                  <span>Registering...</span>
                </>
              ) : (
                <span>Register Member</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
