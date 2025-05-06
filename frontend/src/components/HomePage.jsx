import React, { useState } from 'react'
import Sidebar from './Sidebar'
import MessageContainer from './MessageContainer'
import { FaBars, FaTimes } from 'react-icons/fa'

const HomePage = () => {
  const [showSidebar, setShowSidebar] = useState(false)

  return (
    <div className='sm:h-[450px] md:h-[550px] lg:h-[650px] h-[100vh] flex relative rounded-xl overflow-hidden bg-white/10 backdrop-filter backdrop-blur-md bg-opacity-20 border border-white/20 shadow-xl max-w-full'>
      {/* Hamburger menu button - only visible on mobile */}
      <button 
        onClick={() => setShowSidebar(!showSidebar)}
        className="md:hidden absolute top-4 left-4 z-50 bg-gray-800 text-white p-2 rounded-md"
      >
        {showSidebar ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>
      
      {/* Sidebar - hidden by default on mobile, shown when hamburger is clicked */}
      <div className={`${showSidebar ? 'flex' : 'hidden'} md:flex absolute md:relative inset-0 z-40 md:z-auto bg-gray-900/90 md:bg-transparent`}>
        <Sidebar />
      </div>
      
      {/* Message container - always visible and centered */}
      <div className="flex-1 flex items-center justify-center w-full h-full px-0 sm:px-2 md:px-4">
        <MessageContainer />
      </div>
    </div>
  )
}

export default HomePage