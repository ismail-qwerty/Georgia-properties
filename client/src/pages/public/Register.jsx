export default function Register() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-2xl p-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">
          Create Account
        </h1>
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input type="text" className="input-field" placeholder="Username" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input type="text" className="input-field" placeholder="Full Name" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input type="email" className="input-field" placeholder="Email" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input type="tel" className="input-field" placeholder="Phone" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input type="password" className="input-field" placeholder="Password" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input type="password" className="input-field" placeholder="Confirm Password" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Wallet Password
            </label>
            <input type="password" className="input-field" placeholder="Wallet Password" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reference Code
            </label>
            <input type="text" className="input-field" placeholder="Enter invitation code" />
          </div>
          <button type="submit" className="btn-primary w-full">
            Register
          </button>
        </form>
        <p className="text-center mt-6 text-sm text-gray-600">
          Already have an account?{' '}
          <a href="/user-login" className="text-primary font-semibold hover:underline">
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
}
