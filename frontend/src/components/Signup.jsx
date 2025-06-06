import React, { useState } from 'react'
import { Link,useNavigate } from 'react-router-dom'
import axios from "axios"
import { toast } from 'react-toastify';



const Signup = () => {
  const [user, setUser] = useState({
    fullName: "",
    username: "",
    password: "",
    confirmPassword: "", // Changed from conformPassword
    gender: "",
  })
  const navigate = useNavigate();
const handleCheckbox=(gender)=>{
  setUser({...user,gender})
}
  const onSubmitHandler= async(e)=>{
    e.preventDefault();
    try {
      // const res = await axios.post('http://localhost:8080/api/v1/user/register',user,{
        const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/v1/user/register`,user,{
        // const res = await axios.post('http://192.168.43.217:8080/api/v1/user/register',user,{
        
        headers:{
          'Content-Type':'application/json'
        },
        withCredentials:true
      })
      if(res.data.success){
        toast.success("Account Created Successfully!");
        navigate("/login")

      }
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || "Signup failed");
    }
    // And also update it in the reset function
    setUser({
      fullName: "",
      username: "",
      password: "",
      confirmPassword: "", // Changed from conformPassword
      gender: "",
    })
  }
  return (
    <>
    <div className='w-full h-full flex items-center justify-center p-0'>
      <div className='w-full max-w-md px-0 mx-auto my-auto'>
        <div className='w-full p-6 rounded-lg shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-25 border border-gray-900'>
          <h1 className='text-3xl font-bold text-center text-slate-900'>Signup</h1>
          <form onSubmit={onSubmitHandler}>
            <div>
              <label className='label p-2'>
                <span className='text-base label-text'>Full Name</span>
              </label>
              <input
                value={user.fullName || ""} // Ensure value is always a string
                onChange={(e) => setUser({ ...user, fullName: e.target.value })}
                className='w-full input input-bordered h-10'
                type="text"
                placeholder='Full Name'
              />
            </div>
            <div>
              <label className='label p-2'>
                <span className='text-base label-text'>Username</span>
              </label>
              <input
                value={user.username || ""}
                onChange={(e) => setUser({ ...user, username: e.target.value })}
                className='w-full input input-bordered h-10'
                type="text"
                placeholder='Username'
              />
            </div>
            <div>
              <label className='label p-2'>
                <span className='text-base label-text'>Password</span>
              </label>
              <input
                value={user.password || ""}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
                className='w-full input input-bordered h-10'
                type="password"
                placeholder='Password'
              />
            </div>
            <div>
              <label className='label p-2'>
                <span className='text-base label-text'>Confirm Password</span>
              </label>
              <input
                value={user.confirmPassword || ""}
                onChange={(e) => setUser({ ...user, confirmPassword: e.target.value })}
                className='w-full input input-bordered h-10'
                type="password"
                placeholder='Confirm Password'
              />
            </div>
            <div className='flex items-center my-4 mx-2'>
              <div className='flex items-center'>
                <p>Male</p>
                <input
                  type="checkbox" 
                  checked={user.gender==="male"}
                  onChange={()=>handleCheckbox("male")}
                  className="checkbox mx-2" 
                />
              </div>
              <div className='flex items-center'>
                <p>Female</p>
                <input
                  type="checkbox" 
                  checked={user.gender==="female"}
                  onChange={()=>handleCheckbox("female")}
                  className="checkbox mx-2" 
                />
              </div>
            </div>
            <div>
              <p className='text-center text-gray-300'>
                Already have an account?
                <Link to="/login" className='underline ml-1 text-gray-200'>
                  Login
                </Link>
              </p>
            </div>

            <div>
              <button type='submit' className='btn btn-block btn-sm mt-2 border border-slate-700'>Signup</button>
            </div>
          </form>
        </div>
      </div>
    </div>
    </>
  )
}

export default Signup