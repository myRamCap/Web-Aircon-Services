import React, { useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import Navbar from './navbar/Navbar'
import { useStateContext } from '../contexts/ContextProvider'


export default function DefaultLayout() {
  const {user, token, role} = useStateContext()

  if(!token) {
    return <Navigate to="/login" />
  }
    
  return (
    <div>
        <Navbar />
        <div className="home_content"> 
                <Outlet />
        </div>
    </div>
  )
}
