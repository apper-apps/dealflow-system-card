const SkeletonLoader = ({ count = 3, type = 'card' }) => {
  const skeletons = Array.from({ length: count }, (_, index) => index)

  if (type === 'card') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skeletons.map((index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden animate-pulse">
            <div className="h-48 bg-gray-200" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded" />
                <div className="h-3 bg-gray-200 rounded w-5/6" />
              </div>
              <div className="flex justify-between items-center pt-2">
                <div className="h-6 bg-gray-200 rounded w-20" />
                <div className="h-6 bg-gray-200 rounded w-16" />
              </div>
              <div className="h-10 bg-gray-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (type === 'list') {
    return (
      <div className="space-y-4">
        {skeletons.map((index) => (
          <div key={index} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 animate-pulse">
            <div className="flex space-x-4">
              <div className="w-16 h-16 bg-gray-200 rounded-lg" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
                <div className="h-3 bg-gray-200 rounded w-2/3" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (type === 'banner') {
    return (
      <div className="h-96 bg-gray-200 rounded-2xl animate-pulse" />
    )
  }

  return (
    <div className="space-y-4">
      {skeletons.map((index) => (
        <div key={index} className="h-20 bg-gray-200 rounded-lg animate-pulse" />
      ))}
    </div>
  )
}

export default SkeletonLoader