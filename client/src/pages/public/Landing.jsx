export default function Landing() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-6 text-primary">
            BROOKFIELD PROPERTIES
          </h1>
          <h2 className="text-3xl mb-8">Building Your Future</h2>
          <p className="text-lg mb-12 max-w-2xl mx-auto text-gray-300">
            Leading real estate platform for property investment and management. 
            Join thousands of users maximizing their returns through our innovative system.
          </p>
          <a
            href="/user-login"
            className="btn-primary inline-block"
          >
            Sign In to Account
          </a>
        </div>
      </div>
    </div>
  );
}
