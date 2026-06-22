export default function StatCard({ icon, label, value, bgColor = 'bg-white', iconColor = 'text-primary-600' }) {
  return (
    <div className={`${bgColor} rounded-2xl p-6 shadow-sm border border-gray-200`}>
      <div className="flex items-center space-x-4">
        <div className={`w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center ${iconColor}`}>
          <span className="text-2xl">{icon}</span>
        </div>
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-1">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
}
