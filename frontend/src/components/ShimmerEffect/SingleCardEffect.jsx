import React from 'react'

const SingleCardEffect = ({index}) => {
  return (
   
  <div key={index} className="relative w-[175px] sm:w-[190px] max-w-[200px] p-1 pb-3 mb-1 rounded-sm bg-white shadow-sm cursor-pointer">
    {/* Favorite Icon Placeholder */}
    <div className="absolute right-3 top-3 z-10 w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-lg  bg-gray-300 bg-opacity-80 animate-pulse">
     
    </div>

    {/* Image Shimmer */}
    <div className="w-full h-[230px] rounded bg-gray-300 relative overflow-hidden animate-pulse">
      <div className="absolute inset-0 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 animate-shimmer " />
    </div>

    <div className="mt-2 px-2 space-y-2">
    
      <div className="h-3 w-1/2 bg-gray-200 rounded animate-pulse" />

      <div className="flex space-x-2 mt-2 w-[98%] h-3 bg-gray-300 animate-pulse rounded">
      </div>

      <div className="h-3 w-[85%] bg-gray-200 rounded animate-pulse mt-2" />
    </div>
  </div>

  )
}

export default SingleCardEffect