import React from 'react'
import Navbar from '../components/Navbar';

const MainLayout = ({ children }) => {
  return (
    <>
      <div className='relative bg-background h-screen w-screen overflow-x-hidden font-sans'>
        <Navbar />
        <main className='p-4 md:p-8 max-w-7xl mx-auto'>
          {children}
        </main>
      </div>
    </>
  )
}

export default MainLayout;
