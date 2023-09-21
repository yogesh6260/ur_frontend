import React from 'react'

const Header = ({title}) => {
  return (
    <div className='w-full bg-white p-3'>
        <h5 className='text-2xl font-bold text-black text-center'>{title}</h5>
    </div>
  )
}

export default Header