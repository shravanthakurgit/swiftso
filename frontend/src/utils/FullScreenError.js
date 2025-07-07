// FullScreenError.js
const FullScreenError = () => (
  <div className="fixed inset-0 z-50 bg-white text-center flex flex-col items-center justify-center p-8">
    <h1 className="text-4xl font-bold text-red-600 mb-4">Too Many Requests</h1>
    <p className="text-lg text-gray-700 mb-6">
      You’ve hit the rate limit. Please wait a minute before trying again.
    </p>
    <span className="text-sm text-gray-500">Error Code: 429</span>
  </div>
);

export default FullScreenError;
