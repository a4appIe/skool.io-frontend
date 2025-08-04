import Header from '@/components/public/navigation/header/Header'
import React from 'react'
import { Outlet } from 'react-router-dom'

const PublicLayout = () => {
  return (
    <div>
      <Header />
      <Outlet />
    </div>
  )
}

export default PublicLayout
