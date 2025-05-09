import React from 'react'
import SendInput from './SendInput'
import Messages from './Messages'
import { useDispatch, useSelector } from 'react-redux'
import {setSelectedUser} from '../redux/userSlice'

const MessageContainer = () => {
  const { selectedUser, authUser } = useSelector(store => store.user)
  const dispatch = useDispatch();

  return (
    <div className="w-full h-full flex justify-center items-center p-0">
      {
        selectedUser != null ? (
          <div className='w-full md:min-w-[550px] flex flex-col flex-1 mx-auto h-full max-w-md md:max-w-full'>

            <div className='flex gap-3 items-center text-white bg-gray-800/70 p-3 border-b border-gray-700/50 mt-14 md:mt-0'>
              <div className='avatar online'>
                <div className='w-10 rounded-full ring-2 ring-gray-500/50'>
                  <img src={selectedUser?.profilePhoto} alt="" />
                </div>
              </div>
              <div className='flex flex-col flex-1'>
                <div className='flex justify-between gap-2'>
                  <p className="font-medium">{selectedUser?.fullName}</p>
                </div>
              </div>
            </div>
            <Messages />
            <SendInput />

          </div>
        ) : (
          <div className='w-full md:min-w-[550px] flex flex-col justify-center items-center bg-gray-800/40 flex-1 mt-14 md:mt-0 mx-auto h-full max-w-md md:max-w-full p-4'>
            <div className="text-center p-8 rounded-xl bg-gray-900/50 backdrop-blur-sm border border-white/10 shadow-lg max-w-md w-full">
              <h1 className='text-3xl text-white font-bold mb-2'>Hi, {authUser?.fullName}</h1>
              <h2 className='text-xl text-gray-300 mb-4'>Welcome to Chat App</h2>
              <p className="text-gray-400">Select a contact to start messaging</p>
            </div>
          </div>
        )
      }
    </div>
  )
}

export default MessageContainer