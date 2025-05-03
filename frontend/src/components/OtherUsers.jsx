import React from 'react'
import OtherUser from './OtherUser'
import userGetOtherUsers from '../hooks/userGetOtherUsers'
import { useSelector } from 'react-redux';



const OtherUsers = () => {

    // my custom hook
    userGetOtherUsers();
    const {otherUsers} = useSelector(store=>store.user);
     if(!otherUsers) return;

    return (
        <div className='overflow-auto flex-1'>
            {
                otherUsers?.map((user)=>{
                    return(
                        <OtherUser key={user._id} user={user}/>
                    )
                })
            }
        </div>

    )
}

export default OtherUsers