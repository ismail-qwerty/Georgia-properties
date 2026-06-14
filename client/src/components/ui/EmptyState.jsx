export default function EmptyState({ message = 'No data available', icon = '📋' }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <span className="text-6xl mb-4 opacity-50">{icon}</span>
      <p className="text-gray-500 text-lg">{message}</p>
    </div>
  );
}
