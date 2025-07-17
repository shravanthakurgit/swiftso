import React from 'react'

const Loading = ({message}) => {
  return (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-20 backdrop-blur-xs p-5 ">
      <div className=" max-w-sm bg-white monst p-2 shadow-lg overflow-hidden border border-gray-100 flex items-center gap-4 justify-center w-fit px-4 font-semibold text-sm rounded text-gray-600">
<p>{message}</p> <div className="animate-spin rounded-full h-4 w-4 border-t border-b border-r border-gray-800 "></div>
        
      </div>
    </div>
  )
}

export default Loading