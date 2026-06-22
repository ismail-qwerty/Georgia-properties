import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../utils/api';

export default function Recharge() {
  const { user } = useAuth();
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const quickAmounts = [50, 100, 200, 1000, 3000, 5000];

  useEffect(() => {
    fetchWallet();
  }, []);

  const fetchWallet = async () => {
    try {
      const response = await api.user.getWallet();
      setBalance(response.data.data.balance || 0);
    } catch (error) {
      console.error('Failed to fetch wallet:', error);
    }
  };

  const handleQuickSelect = (value) => {
    setAmount(value.toString());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const numAmount = parseFloat(amount);

      await api.user.requestRecharge({
        amount: numAmount,
      });

      setMessage({
        type: 'success',
        text: 'Recharge request submitted successfully. Pending admin approval.',
      });

      setAmount('');
      fetchWallet();
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.error || error.message || 'Failed to submit recharge request',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-b from-[#5DBDAE] to-[#7DCCC4] py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl font-bold text-white text-center mb-4">Add Funds</h1>
          <div className="flex items-center justify-center gap-2 text-white text-sm">
            <Link to="/dashboard" className="hover:underline">Dashboard</Link>
            <span>|</span>
            <span>Recharge</span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-lg shadow-sm p-10">
          {/* Balance Display */}
          <div className="mb-8">
            <h2 className="text-xl text-gray-700 font-normal mb-2">
              Account Balance - {user?.username}
            </h2>
            <div className="text-lg text-gray-600">{balance.toFixed(2)} VIEWS</div>
          </div>

          {/* Add Funds Amount Section */}
          <form onSubmit={handleSubmit}>
            <div className="mb-8">
              <h3 className="text-lg text-gray-700 mb-4">Add Funds Amount</h3>
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6"
                placeholder="Enter amount"
                required
              />
              
              <div className="grid grid-cols-3 gap-4">
                {quickAmounts.map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => handleQuickSelect(val)}
                    className="py-3 px-4 border-2 border-blue-500 text-blue-500 rounded hover:bg-blue-50 font-medium transition-colors"
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>

            {message.text && (
              <div
                className={`mb-6 p-4 rounded ${
                  message.type === 'success'
                    ? 'bg-green-50 text-green-800 border border-green-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}
              >
                {message.text}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Add Funds'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
