import React from 'react'
import Header from '../Header/Header';
import {Outlet} from 'react-router-dom'

function Layout() {
    return (
        <div className="flex flex-col overflow-hidden bg-white">
          {/* common header */}
          <Header />
          <main className="flex flex-col w-full">
            <Outlet />
          </main>
        </div>
      );
    };

export default Layout