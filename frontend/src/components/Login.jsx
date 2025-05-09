import React, { useState } from 'react'
import { Link,useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setAuthUser } from '../redux/userSlice'

const Login = () => {
 const [user, setUser] = useState({
     username: "",
     password: "",
   })
   const dispatch = useDispatch();
   const navigate = useNavigate();
   const onSubmitHandler= async(e)=>{
     e.preventDefault();
     try {
      // const res = await axios.post('http://localhost:8080/api/v1/user/login',user,{
        const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/v1/user/login`,user,{
        // const res = await axios.post('http://192.168.43.217:8080/api/v1/user/login',user,{
      
        headers:{
          'Content-Type':'application/json'
        },
        withCredentials:true
      })
        navigate("/");
        console.log(res);
        dispatch(setAuthUser(res.data));
      
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error)
    }
     setUser({
     username: "",
     password: "",
     })
   }

  return (
    <div className='w-full h-full flex items-center justify-center p-0'>
      <div className='w-full max-w-md px-0 mx-auto my-auto'>
        <div className='w-full p-6 rounded-lg shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-25 border border-gray-900'>
          <h1 className='text-3xl font-bold text-center text-slate-900'>Login</h1>
          <form onSubmit={onSubmitHandler} action="">
            <div>
              <label className='label p-2'>
                <span className='text-base label-text'>Username</span>
              </label>
              <input 
                value={user.username|| ""}
                onChange={(e)=>setUser({...user,username:e.target.value})}
                className='w-full input input-bordered h-10' 
                type="text" 
                placeholder='Username' 
              />
            </div>
            <div>
              <label className='label p-2'>
                <span className='text-base label-text '>Password</span>
              </label>
              <input 
                value={user.password|| ""}
                onChange={(e)=>setUser({...user,password:e.target.value})}
                className='w-full input input-bordered h-10' 
                type="password" 
                placeholder='Password' 
              />
            </div>
            <div className='p-2'>
              <p className='text-center text-gray-300'>
                Don't have an account?
                <Link to="/register" className='underline ml-1 text-gray-200'>
                  Signup
                </Link>
              </p>
            </div>

            <div>
              <button type='submit' className='btn btn-block btn-sm mt-2 border border-slate-700'>Login</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login