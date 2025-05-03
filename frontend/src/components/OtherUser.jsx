import React from 'react'
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser } from '../redux/userSlice.jsx'

const OtherUser = ({user}) => {
    const dispatch = useDispatch();
    const { selectedUser, onlineUsers } = useSelector(store => store.user)
    const isOnline = Array.isArray(onlineUsers) && onlineUsers.includes(user._id);
    const selectedUserHandler = (user) => {
        dispatch(setSelectedUser(user))
    }
    
    return (
        <>
            <div className='text-black'>
                <div 
                    onClick={() => selectedUserHandler(user)} 
                    className={`${selectedUser?._id === user?._id ? 'bg-gray-700 text-white' : 'text-white hover:bg-gray-700/50'} 
                    flex gap-3 items-center rounded-lg p-2 cursor-pointer transition-all duration-200`}
                >
                    <div className={`avatar ${isOnline ? 'online' : ''}`}>
                        <div className='w-10 rounded-full ring-1 ring-white/20'>
                            <img src={user?.profilePhoto} alt="" />
                        </div>
                    </div>
                    <div className='flex-1'>
                        <div className='flex justify-between gap-2'>
                            <p className="font-medium">{user?.fullName}</p>
                        </div>
                        {/* <!-- Removed the username display line --> */}
                    </div>
                </div>
            </div>
            <div className='divider my-0 py-1 h-1 before:bg-gray-700/30 after:bg-gray-700/30'></div>
        </>
    )
}

export default OtherUser