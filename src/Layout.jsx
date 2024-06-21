import React from 'react'
import { Outlet } from 'react-router-dom'
import { Header, Footer  } from './COMPONENTS/Index';
import './Layout.css';



function Layout() {
  return (
    <div>
        <Header></Header>
        <div className="Main">
          <Outlet />
        </div>
        <Footer></Footer>
    </div>
  )
}

export default Layout