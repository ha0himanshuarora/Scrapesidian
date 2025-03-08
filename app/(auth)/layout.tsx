import Logo from '@/components/Logo'
import React,{ReactNode} from 'react'

function layout({children}:{children:ReactNode}) {
  return (
    <div className='flex flex-col items-center justify-content h-screen gap-4'>
        <Logo />    
        {children}
    </div>
  )
}

export default layout
