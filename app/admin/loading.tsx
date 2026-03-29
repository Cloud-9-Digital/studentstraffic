function SkeletonRow() {
  return (
    <tr className="border-t border-gray-100">
      <td className="px-4 py-3">
        <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
      </td>
      <td className="px-4 py-3">
        <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
        <div className="mt-2 h-3 w-20 animate-pulse rounded bg-gray-100" />
      </td>
      <td className="px-4 py-3">
        <div className="h-5 w-14 animate-pulse rounded-full bg-gray-100" />
      </td>
      <td className="px-4 py-3">
        <div className="h-4 w-10 animate-pulse rounded bg-gray-200" />
      </td>
      <td className="px-4 py-3">
        <div className="h-4 w-48 animate-pulse rounded bg-gray-200" />
      </td>
      <td className="px-4 py-3">
        <div className="h-5 w-16 animate-pulse rounded-full bg-gray-100" />
      </td>
      <td className="px-4 py-3">
        <div className="h-4 w-18 animate-pulse rounded bg-gray-200" />
      </td>
      <td className="px-4 py-3">
        <div className="flex gap-2">
          <div className="h-7 w-16 animate-pulse rounded-lg bg-gray-100" />
          <div className="h-7 w-20 animate-pulse rounded-lg bg-gray-100" />
        </div>
      </td>
    </tr>
  );
}

export default function AdminLoading() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <div className="h-8 w-32 animate-pulse rounded bg-gray-200" />
          <div className="mt-2 h-4 w-28 animate-pulse rounded bg-gray-100" />
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-400">University</th>
                <th className="px-4 py-3 text-left font-medium text-gray-400">Reviewer</th>
                <th className="px-4 py-3 text-left font-medium text-gray-400">Type</th>
                <th className="px-4 py-3 text-left font-medium text-gray-400">Rating</th>
                <th className="px-4 py-3 text-left font-medium text-gray-400">Content</th>
                <th className="px-4 py-3 text-left font-medium text-gray-400">Status</th>
                <th className="px-4 py-3 text-left font-medium text-gray-400">Date</th>
                <th className="px-4 py-3 text-left font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
