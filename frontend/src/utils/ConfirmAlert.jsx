import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline'
import React, { useState } from 'react'

const ConfirmAlert = ({message,runFunction,hideAlert}) => {

    const[showAlert,setShowAlert] = useState(false)


  return (
                  <div className="  fixed text-center m-auto text-white font-semibold inset-0 z-50 bg-black bg-opacity-30 flex justify-center items-center text-xs  ">
                <div className="absolute zoom-once flex-col flex justify-center items-center gap-4 bg-white p-4 rounded py-16 px-10">
                  
                  <div className="flex item-center gap-3 text-black justify-center">{message}
  <QuestionMarkCircleIcon className='size-[20px]'/>

                  </div>
                 
                
                <div className="flex gap-4 ">
  <button className=' text-slate-200 p-3 border w-32 rounded bg-slate-800' onClick={runFunction} >Yes</button>
  <button className='p-3 w-32 rounded bg-red-200 text-red-600 ' onClick={hideAlert}>No</button>
</div>
                
                </div>

  
    </div>
  )
}

export default ConfirmAlert