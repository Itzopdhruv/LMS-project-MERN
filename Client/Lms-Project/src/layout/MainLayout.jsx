import { Outlet } from 'react-router-dom'
import React from 'react'
import Navbar from '@/components/navbar'
function MainLayout() {
    return (
        <div className='w-full'>
            <Navbar />  
            <Outlet />
        </div>
    )
}

export default MainLayout
