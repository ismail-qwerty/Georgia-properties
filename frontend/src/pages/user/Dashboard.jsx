import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();

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

  const services = [
    { icon: 'fa-building', title: 'Property Sales & Leasing', desc: 'Buy, sell, or lease residential and commercial properties with expert negotiation and guidance.' },
    { icon: 'fa-key', title: 'Property Management', desc: 'End‑to‑end management to protect your investment and maximize returns.' },
    { icon: 'fa-line-chart', title: 'Investment Advisory', desc: 'Market research and advisory for investors seeking long‑term value.' },
    { icon: 'fa-handshake-o', title: 'Tenant Representation', desc: 'Find the right space and secure favorable terms for your business.' },
  ];

  const features = [
    { icon: 'fa-map', title: 'Local market expertise nationwide', desc: 'From neighborhood trends to national outlooks, our advisors help you make confident decisions.' },
    { icon: 'fa-building-o', title: 'Diverse portfolio', desc: 'Access residential, retail, office, and mixed‑use opportunities across major U.S. markets.' },
    { icon: 'fa-check', title: 'Transparent process', desc: 'Clear communication, streamlined steps, and support from first viewing to closing.' },
    { icon: 'fa-users', title: 'Client‑first approach', desc: 'We align every recommendation with your goals, timeline, and budget.' },
  ];

  const team = [
    { name: 'Fletch Skinner', role: 'Product Strategist', img: 'team1.jpg' },
    { name: 'Lance Bogrol', role: 'Visual Designer', img: 'team2.jpg' },
    { name: 'Valent Morose', role: 'Android Developer', img: 'team3.jpg' },
    { name: 'Giles Posture', role: 'iOS Developer', img: 'team4.jpg' },
  ];

  const blogs = [
    { title: '5 steps to becoming GDPR compliant on mobile apps', desc: 'Mauris tellus sem, ultrices varius nisl at, convallis iaculis mauris. Sed eget sem vitae purus tempus dignissim.', img: 'blog1.jpg' },
    { title: 'Measuring app success through mobile analytics', desc: 'Cras imperdiet faucibus sem, a dignissim urna feugiat sed. Interdum et malesuada fames ac ante ipsum primis.', img: 'blog2.jpg' },
    { title: 'How accessibility will influence your app dev', desc: 'Quisque euismod nec lacus sit amet maximus. Ut convallis sagittis lorem auctor malesuada. Morbi auctor.', img: 'blog3.jpg' },
  ];

  return (
    <div className="min-h-screen bg-[#f7f9fc]">
      {/* Hero Section */}
      <section className="relative min-h-[500px] flex items-center justify-center" style={{backgroundImage: 'url(/bgdashboard.jpg)', backgroundSize: 'cover', backgroundPosition: 'center'}}>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/20"></div>
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-5xl font-bold text-white mb-4">Welcome, {user?.username}!</h1>
            <p className="text-white text-lg mb-8">Brookfield Properties is a trusted real estate agency in the United States, helping clients buy, sell, lease, and manage properties with confidence.</p>
            <Link to="/data-optimization" className="inline-block border-2 border-white text-white px-8 py-3 rounded hover:bg-white hover:text-[#28a745] transition uppercase tracking-wider font-medium">GENERATE LOTS</Link>
          </div>
        </div>
      </section>

      {/* Quick Access */}
      <div className="container mx-auto px-4 -mt-20 relative z-20">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800"><i className="fa fa-th-large mr-2"></i>Quick Access</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
            {quickAccessMenu.map((item, i) => (
              <Link key={i} to={item.path} className="text-center group">
                <div className="w-16 h-16 mx-auto mb-2">
                  <img src={`/${item.icon}`} alt={item.label} className="w-full h-full object-contain" />
                </div>
                <small className="text-xs text-gray-600">{item.label}</small>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Services Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4 text-gray-800">Full‑service real estate agency</h2>
              <p className="text-gray-700 mb-4">We specialize in residential and commercial properties across the U.S., offering expert guidance from discovery to closing.</p>
              <p className="text-gray-600 mb-6">Whether you're investing, relocating, or expanding your portfolio, our team provides market insights, transparent processes, and dedicated support.</p>
              <a href="#" className="inline-block border-2 border-[#28a745] text-[#28a745] px-6 py-2 rounded hover:bg-[#28a745] hover:text-white transition uppercase text-sm font-medium">OUR SERVICES</a>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {services.map((s, i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
                  <i className={`fa ${s.icon} text-3xl text-[#28a745] mb-3`}></i>
                  <h5 className="font-bold text-sm mb-2">{s.title}</h5>
                  <p className="text-xs text-gray-600">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gradient-to-r from-[#28a745] to-[#20c997]">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=500&h=600&fit=crop" alt="Modern Property" className="mx-auto rounded-lg shadow-xl" />
            </div>
            <div className="order-1 md:order-2">
              <ul className="space-y-6">
                {features.map((f, i) => (
                  <li key={i} className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-white rounded-full flex items-center justify-center">
                      <i className={`fa ${f.icon} text-[#28a745]`}></i>
                    </div>
                    <div className="text-white">
                      <h5 className="font-bold mb-1">{f.title}</h5>
                      <p className="text-sm opacity-90">{f.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-3">Our Team</h2>
          <p className="text-gray-600 mb-12">Fusce placerat pretium mauris, vel sollicitudin elit lacinia vitae. Quisque sit amet nisi erat.</p>
          <div className="grid md:grid-cols-4 gap-6">
            {team.map((t, i) => (
              <div key={i} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="h-48 bg-gray-300 overflow-hidden">
                  <img 
                    src={`https://images.unsplash.com/photo-${['1507003211169-0a1dd7228f2d', '1500648767791-00dcc994a43e', '1506794778202-cad84cf45f1d', '1472099645785-5658abf4ff4e'][i]}?w=400&h=400&fit=crop&auto=format`} 
                    alt={t.name} 
                    className="w-full h-full object-cover object-center"
                  />
                </div>
                <div className="p-4">
                  <h4 className="font-bold">{t.name}</h4>
                  <p className="text-sm text-gray-600 mb-3">{t.role}</p>
                  <div className="flex justify-center gap-2">
                    <a href="#" className="w-8 h-8 bg-[#28a745] text-white rounded flex items-center justify-center"><i className="fa fa-facebook"></i></a>
                    <a href="#" className="w-8 h-8 bg-[#28a745] text-white rounded flex items-center justify-center"><i className="fa fa-twitter"></i></a>
                  </div>
                  <p className="text-xs text-gray-600 mt-3">Proin arcu ligula, malesuada id tincidunt laoreet, facilisis at justo.</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-gray-800 to-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div><h3 className="text-4xl font-bold">126</h3><p>Mobile App Complete</p></div>
            <div><h3 className="text-4xl font-bold">98</h3><p>Happy Customer</p></div>
            <div><h3 className="text-4xl font-bold">176</h3><p>App Version</p></div>
            <div><h3 className="text-4xl font-bold">16</h3><p>Award Win</p></div>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-3">Latest Blog Posts</h2>
          <p className="text-gray-600 mb-12">Fusce placerat pretium mauris, vel sollicitudin elit lacinia vitae. Quisque sit amet nisi erat.</p>
          <div className="grid md:grid-cols-3 gap-6">
            {blogs.map((b, i) => (
              <div key={i} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="h-48 bg-gray-300 relative overflow-hidden">
                  <img 
                    src={`https://images.unsplash.com/photo-${['1551434678-e076c223a692', '1460925895917-afdab827c52f', '1484417894907-623942c8ee29'][i]}?w=400&h=300&fit=crop&auto=format`} 
                    alt={b.title} 
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-4 left-4 bg-[#28a745] text-white px-3 py-1 rounded text-xs font-bold">APR 09</span>
                </div>
                <div className="p-6 text-left">
                  <h3 className="font-bold mb-3 text-lg">{b.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{b.desc}</p>
                  <a href="#" className="text-[#28a745] border-b-2 border-[#28a745] inline-block font-medium text-sm">Read More</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#28a745] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Brookfield Properties</h3>
              <p className="text-sm opacity-90">Trusted real estate & services. Manage your account, wallet and orders from your dashboard.</p>
            </div>
            <div>
              <h5 className="font-bold mb-3">Helpful Links</h5>
              <ul className="space-y-2 text-sm">
                <li><Link to="/recharge" className="hover:underline">Recharge</Link></li>
                <li><Link to="/redemption" className="hover:underline">Redeem</Link></li>
                <li><Link to="/recharge-history" className="hover:underline">Recharge History</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-3">Account</h5>
              <ul className="space-y-2 text-sm">
                <li><Link to="/dashboard" className="hover:underline">Dashboard</Link></li>
                <li><Link to="/data-optimization" className="hover:underline">Generate Lots</Link></li>
                <li><Link to="/profile" className="hover:underline">Profile</Link></li>
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
