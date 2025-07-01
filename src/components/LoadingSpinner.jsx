function LoadingSpinner() {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-600 rounded-full animate-spin border-t-transparent"></div>
          </div>
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">SympTrack AI</h2>
            <p className="text-gray-600">Loading your health dashboard...</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoadingSpinner;