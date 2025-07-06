import React from 'react'
import { PiMaskSad } from "react-icons/pi";
const Error = ({message}) => {
  return (
    <div className='flex opacity-50 justify-center items-center flex-col'>
        
        <PiMaskSad size={100} className='opacity-50'/>
        {message}</div>
  )
}

export default Error