// FullScreenError.js
const FullScreenError = () => (
  <div className="fixed inset-0 z-50 bg-white text-center flex flex-col items-center justify-center p-8">
    <img src="/assets/error.gif" alt="Error" className="w-28 h-auto mb-4" />
    <h1 className="text-4xl font-bold text-red-600 mb-4">Too Many Requests From You</h1>
    <p className="text-l text-gray-700 mb-6">
      Please wait up to 10 minutes before trying again.
    </p>
    <span className="text-sm text-gray-500 font-semibold">Error Code: 429</span>
  </div>
);

export default FullScreenError;
