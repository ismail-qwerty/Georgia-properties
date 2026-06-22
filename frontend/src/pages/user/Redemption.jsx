import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../utils/api';

export default function Redemption() {
  const { user } = useAuth();
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState('');
  const [walletPassword, setWalletPassword] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const quickAmounts = [100, 150, 200, 1000, 1500, 2000];

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

  const handleAllAmount = () => {
    setAmount(balance.toString());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const numAmount = parseFloat(amount);

      if (numAmount < (user?.min_withdrawal || 50)) {
        throw new Error(`Minimum withdrawal is VIEWS ${(user?.min_withdrawal || 50).toFixed(2)}`);
      }

      if (numAmount > (user?.max_withdrawal || 500)) {
        throw new Error(`Maximum withdrawal is VIEWS ${(user?.max_withdrawal || 500).toFixed(2)}`);
      }

      if (numAmount > balance) {
        throw new Error('Insufficient balance');
      }

      await api.user.requestRedemption({
        amount: numAmount,
        wallet_address: walletAddress,
        wallet_password: walletPassword,
      });

      setMessage({
        type: 'success',
        text: 'Withdrawal request submitted successfully. Pending admin approval.',
      });

      setAmount('');
      setWalletPassword('');
      setWalletAddress('');
      fetchWallet();
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.error || error.message || 'Failed to submit withdrawal request',
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
          <h1 className="text-4xl font-bold text-white text-center mb-4">Redemption</h1>
          <div className="flex items-center justify-center gap-2 text-white text-sm">
            <Link to="/dashboard" className="hover:underline">Dashboard</Link>
            <span>|</span>
            <span>Redemption</span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-lg shadow-sm p-10">
          {/* Balance Display */}
          <div className="mb-8">
            <h2 className="text-xl text-gray-700 font-normal mb-2">
              {user?.username} - Account Balance (VIEWS)
            </h2>
            <div className="text-3xl font-bold text-gray-900">{balance.toFixed(2)}</div>
          </div>

          {/* Set Amount Section */}
          <div className="mb-8">
            <h3 className="text-lg text-gray-700 mb-4">Set Amount</h3>
            <div className="grid grid-cols-3 gap-4">
              {quickAmounts.map((val) => (
                <button
                  key={val}
                  onClick={() => handleQuickSelect(val)}
                  className="py-3 px-4 border-2 border-blue-500 text-blue-500 rounded hover:bg-blue-50 font-medium transition-colors"
                >
                  {val}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Amount Input */}
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Amount other than above stated?</label>
              <div className="flex gap-3">
                <input
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter amount (Views)"
                  required
                />
                <button
                  type="button"
                  onClick={handleAllAmount}
                  className="px-8 py-3 border-2 border-blue-500 text-blue-500 rounded hover:bg-blue-50 font-medium"
                >
                  All
                </button>
              </div>
            </div>

            {/* Redemption Password */}
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Redemption Password</label>
              <input
                type="password"
                value={walletPassword}
                onChange={(e) => setWalletPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter redemption password"
                required
              />
            </div>

            {/* Wallet Address */}
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Wallet Address</label>
              <input
                type="text"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter wallet address"
                required
              />
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
              className="w-full py-3 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Submit Withdrawal Request'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
