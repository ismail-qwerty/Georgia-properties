export default function StatusBadge({ status }) {
  const getStatusStyles = () => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Undone':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'Active':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'Deactivate':
      case 'Inactive':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'Approved':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'Rejected':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusStyles()}`}
    >
      {status}
    </span>
  );
}
