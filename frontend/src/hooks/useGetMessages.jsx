import React, { useEffect } from 'react'
import axios from "axios";
import {useSelector,useDispatch} from "react-redux";
import {setMessages} from '../redux/messagesSlice.jsx'

const useGetMessages = () => {
    const {selectedUser} = useSelector(state => state.user);
    const dispatch = useDispatch();
  return (
     useEffect(() => {
       const fetchMessages = async ()=>{
        try {
            axios.defaults.withCredentials = true;
            // const res =  await axios.get(`http://localhost:8080/api/v1/message/${selectedUser?._id}`);
            const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/v1/message/${selectedUser?._id}`);
            // const res = await axios.get(`http://192.168.43.217:8080/api/v1/message/${selectedUser?._id}`);

            console.log(res); 
            dispatch(setMessages(res.data))

        } catch (error) {
            console.log(error);
            
        }
       }
       fetchMessages();
     }, [selectedUser])
     
  )
}

export default useGetMessages