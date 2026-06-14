import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();

  const quickAccessMenu = [
    { label: 'Profile', path: '/profile', icon: '👤' },
    { label: 'Lots Optimization', path: '/lots-optimization', icon: '⭐' },
    { label: 'History', path: '/history', icon: '📋' },
    { label: 'Bind Wallet', path: '/bind-wallet', icon: '🔗' },
    { label: 'Recharge History', path: '/recharge-history', icon: '💳' },
    { label: 'Redemption', path: '/redemption', icon: '💰' },
    { label: 'Redemption History', path: '/redemption-history', icon: '📊' },
    { label: 'Support', path: '/support', icon: '💬' },
  ];

  return (
    <div>
      {/* Hero Banner - Teal to Mint Gradient */}
      <div className="bg-gradient-to-r from-primary-700 to-primary-300 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-8">
            Welcome, {user?.username}!
          </h1>
          <Link
            to="/data-optimization"
            className="inline-block bg-transparent border-2 border-white text-white font-bold px-12 py-4 rounded-lg text-lg tracking-[0.2em] uppercase hover:bg-white hover:text-primary-700 transition-all"
          >
            Generate Lots
          </Link>
        </div>
      </div>

      {/* Quick Access Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {quickAccessMenu.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow border border-gray-100 text-center group"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-primary-50 rounded-full flex items-center justify-center text-3xl group-hover:bg-primary-100 transition-colors">
                {item.icon}
              </div>
              <p className="text-primary-600 font-semibold text-sm">{item.label}</p>
            </Link>
          ))}
        </div>

        {/* Services Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div>
            <button className="border-2 border-primary-600 text-primary-600 font-semibold px-6 py-2 rounded-lg mb-4">
              OUR SERVICES
            </button>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Comprehensive Real Estate Solutions
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Discover our full range of professional property services designed to maximize your investment potential and streamline your real estate operations.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { title: 'Property Sales & Leasing', icon: '🏢' },
              { title: 'Property Management', icon: '🔧' },
              { title: 'Investment Advisory', icon: '📈' },
              { title: 'Tenant Representation', icon: '🤝' },
            ].map((service) => (
              <div key={service.title} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="text-4xl mb-3">{service.icon}</div>
                <h3 className="font-semibold text-gray-900 text-sm">{service.title}</h3>
              </div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Our Team</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { name: 'Fletch Skinner', role: 'Product Strategist', bio: 'Driving innovation and strategic vision' },
              { name: 'Lance Bogrol', role: 'Visual Designer', bio: 'Crafting exceptional user experiences' },
              { name: 'Valent Morose', role: 'Android Developer', bio: 'Building powerful mobile solutions' },
              { name: 'Giles Posture', role: 'iOS Developer', bio: 'Creating seamless iOS applications' },
            ].map((member) => (
              <div key={member.name} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
                <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <h3 className="font-bold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-primary-600 text-sm font-semibold mb-2">{member.role}</p>
                <p className="text-gray-600 text-xs mb-4">{member.bio}</p>
                <div className="flex justify-center space-x-3">
                  <button className="text-gray-400 hover:text-primary-600">🔗</button>
                  <button className="text-gray-400 hover:text-primary-600">📧</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Metrics Counter Ribbon */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-400 rounded-2xl p-8 mb-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
            <div>
              <div className="text-4xl font-bold mb-2">126</div>
              <div className="text-sm opacity-90">Mobile App Complete</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">98</div>
              <div className="text-sm opacity-90">Happy Customer</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">176</div>
              <div className="text-sm opacity-90">App Version</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">16</div>
              <div className="text-sm opacity-90">Award Win</div>
            </div>
          </div>
        </div>

        {/* Blog Section */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Latest Updates</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: '5 steps to becoming GDPR compliant on mobile apps', date: 'APR 09' },
              { title: 'Measuring app success through mobile analytics', date: 'APR 09' },
              { title: 'How accessibility will influence your app dev', date: 'APR 09' },
            ].map((post, idx) => (
              <div key={idx} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
                <div className="relative">
                  <div className="w-full h-48 bg-gray-200"></div>
                  <div className="absolute top-4 left-4 bg-primary-600 text-white px-3 py-1 rounded text-sm font-semibold">
                    {post.date}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-gray-900 mb-2">{post.title}</h3>
                  <button className="text-primary-600 text-sm font-semibold hover:underline">
                    Read More →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
