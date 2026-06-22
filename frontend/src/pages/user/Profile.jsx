import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../utils/api';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.user.getProfile();
      setProfile(response.data.data);
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/user-login');
  };

  const copyInviteCode = () => {
    const text = profile?.reference_code || '';
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(() => {
        alert('Invitation code copied to clipboard!');
      });
    } else {
      const tempInput = document.createElement('input');
      tempInput.value = text;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand('copy');
      document.body.removeChild(tempInput);
      alert('Invitation code copied to clipboard!');
    }
  };

  const quickAccessMenu = [
    { label: 'Profile', path: '/profile', icon: '1.webp' },
    { label: 'Lots Optimization', path: '/data-optimization', icon: '2.webp' },
    { label: 'History', path: '/history', icon: '3.webp' },
    { label: 'Bind Wallet', path: '/bind-wallet', icon: '4.webp' },
    { label: 'Recharge History', path: '/recharge-history', icon: '5.webp' },
    { label: 'Redemption', path: '/redemption', icon: '6.webp' },
    { label: 'Redemption History', path: '/redemption-history', icon: '7.webp' },
    { label: 'Support', path: '/support', icon: '8.webp' },
  ];

  if (loading) {
    return <div className="min-h-screen bg-[#f7f9fc] flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-[#f7f9fc] pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="bg-transparent mb-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6">
              <div className="flex items-center gap-4">
                <i className="fa fa-user-circle text-blue-600 text-6xl"></i>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{profile?.username || user?.username}</h2>
                  <span className="inline-block mt-1 px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded">
                    {profile?.membership?.name || 'Silver'}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 flex items-center gap-2"
                >
                  <i className="fa fa-qrcode"></i>
                  Invitation Code
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700 flex items-center gap-2"
                >
                  <i className="fa fa-sign-out"></i>
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white rounded shadow p-6">
              <div className="flex items-center gap-4">
                <div className="text-blue-600"><i className="fa fa-wallet text-4xl"></i></div>
                <div>
                  <div className="text-gray-500 text-sm mb-1">Account Balance</div>
                  <div className="text-2xl font-bold">${(profile?.wallet?.balance || 0).toFixed(2)}</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded shadow p-6">
              <div className="flex items-center gap-4">
                <div className="text-blue-500"><i className="fa fa-line-chart text-4xl"></i></div>
                <div>
                  <div className="text-gray-500 text-sm mb-1">Today's Earnings</div>
                  <div className="text-2xl font-bold">${(profile?.today_earnings || 0).toFixed(2)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Credibility Progress */}
          <div className="bg-white rounded shadow p-6 mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Credibility</span>
              <span className="text-gray-600">{profile?.credibility || 100}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${profile?.credibility || 100}%` }}></div>
            </div>
          </div>

          {/* Quick Access */}
          <div className="bg-white rounded shadow p-6 mb-6">
            <h5 className="font-bold mb-4"><i className="fa fa-th-large mr-2"></i>Quick Access</h5>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickAccessMenu.map((item, i) => (
                <Link key={i} to={item.path} className="text-center block p-4 border rounded hover:bg-gray-50 transition">
                  <div className="mb-2">
                    <img src={`/${item.icon}`} alt={item.label} className="w-12 h-12 mx-auto object-contain" />
                  </div>
                  <small className="text-xs">{item.label}</small>
                </Link>
              ))}
            </div>
          </div>

          {/* Logout Button */}
          <div className="flex justify-center">
            <div className="w-11/12">
              <button
                onClick={handleLogout}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded transition flex items-center justify-center gap-2"
              >
                <i className="fa fa-sign-out"></i>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-lg max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center p-4 border-b">
              <h5 className="font-bold">Your Invitation Code</h5>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                <i className="fa fa-times"></i>
              </button>
            </div>
            <div className="p-6 text-center">
              <div className="w-48 h-48 mx-auto mb-4 bg-gray-200 rounded flex items-center justify-center">
                <i className="fa fa-qrcode text-6xl text-gray-400"></i>
              </div>
              <h6 className="mb-2 font-semibold">Invitation Code</h6>
              <p className="text-xl font-bold mb-4">{profile?.reference_code}</p>
              <button
                onClick={copyInviteCode}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
              >
                <i className="fa fa-copy mr-2"></i>Copy Invitation Code
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-blue-600 text-white py-12 mt-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Brookfield Properties</h3>
              <p className="text-sm opacity-90">Trusted real estate & services. Manage your account, wallet and orders from your dashboard.</p>
            </div>
            <div>
              <h5 className="font-bold mb-3">Helpful Links</h5>
              <ul className="space-y-2 text-sm">
                <li><Link to="/recharge" className="hover:underline"><i className="fa fa-angle-right mr-1"></i>Recharge</Link></li>
                <li><Link to="/redemption" className="hover:underline"><i className="fa fa-angle-right mr-1"></i>Redeem</Link></li>
                <li><Link to="/recharge-history" className="hover:underline"><i className="fa fa-angle-right mr-1"></i>Recharge History</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-3">Account</h5>
              <ul className="space-y-2 text-sm">
                <li><Link to="/dashboard" className="hover:underline"><i className="fa fa-angle-right mr-1"></i>Dashboard</Link></li>
                <li><Link to="/data-optimization" className="hover:underline"><i className="fa fa-angle-right mr-1"></i>Generate Lots</Link></li>
                <li><Link to="/profile" className="hover:underline"><i className="fa fa-angle-right mr-1"></i>Profile</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-3">Contact</h5>
              <p className="text-sm">455 West Orchard Street<br />Kings Mountain, NC 28086<br />Phone: (272) 211-7370</p>
            </div>
          </div>
          <div className="border-t border-white/20 mt-8 pt-6 text-center text-sm">
            <p>© 2025 Brookfield Properties. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
