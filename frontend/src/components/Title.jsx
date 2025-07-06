import React from 'react'

const Title = ({title1, title2}) => {
  return (
    <div className='flex items-center gap-2 justify-center rubik'>
      <p className='w-12 lg:w-20 h-[2px] bg-[var(--secondary)]'></p>
        <p className='mx-4 text-xl font-bold py-6 text-[var(--secondary)] '> <span className='bg-[var(--primary)] p-2 rounded-full px-6 '>{title1}</span><span className='text-[var(--secondary)] pl-2'>{title2}</span></p>
        <p className='w-12 lg:w-20 h-[2px] bg-[var(--primary)]'></p>
        </div>
  )
}

export default Title