import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline'

const ConfirmAlert = ({ message, runFunction, hideAlert }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-20 backdrop-blur-sm p-5 ">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div className="p-8 text-center space-y-6">
          <div className="flex flex-col items-center space-y-3">
            <div className="p-3 bg-blue-50 rounded-full">
              <QuestionMarkCircleIcon className="w-6 h-6 text-blue-500" />
            </div>
            <p className="text-gray-700 font-medium poppins text-sm">{message}</p>
          </div>
          
          <div className="flex justify-center space-x-4">
            <button
              onClick={hideAlert}
              className="px-10 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200"
            >
              No
            </button>
            <button
              onClick={runFunction}
              className="px-10 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg hover:from-blue-600 hover:to-blue-700 shadow-sm transition-all duration-200"
            >
              Yes
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmAlert