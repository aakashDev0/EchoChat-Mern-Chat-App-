import React, { useState, useEffect } from 'react';
import OtherUsers from './OtherUsers';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthUser, setOtherUsers } from '../redux/userSlice';

const Sidebar = () => {
  const [search, setSearch] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const { otherUsers } = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [originalUsers, setOriginalUsers] = useState(null);
  const [noResults, setNoResults] = useState(false);

  // Store original users when they first load
  useEffect(() => {
    if (otherUsers && !originalUsers) {
      setOriginalUsers(otherUsers);
    }
  }, [otherUsers, originalUsers]);

  // Logout handler
  const logoutHandler = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/v1/user/logout');
      navigate('/login');
      toast.success(res.data.message);
      dispatch(setAuthUser(null))
    } catch (error) {
      console.error(error);
      toast.error('Failed to logout. Please try again.');
    }
  };

  // Search handler that runs on input change
  useEffect(() => {
    const performSearch = async () => {
      // If search is empty or too short, restore original users
      if (!search.trim() || search.trim().length < 2) {
        if (originalUsers) {
          dispatch(setOtherUsers(originalUsers));
          setNoResults(false);
        }
        return;
      }
      
      setIsSearching(true);
      
      try {
        const res = await axios.get(`http://localhost:8080/api/v1/user/search?query=${search}`, {
          withCredentials: true
        });
        
        if (res.data.length > 0) {
          dispatch(setOtherUsers(res.data));
          setNoResults(false);
        } else {
          // Keep the current list but show "not found" message
          setNoResults(true);
        }
      } catch (error) {
        console.error("Search error:", error);
        toast.error('Error searching for users.');
      } finally {
        setIsSearching(false);
      }
    };
    
    // Increase debounce time to 500ms and only search if there are at least 2 characters
    const timeoutId = setTimeout(() => {
      if (search.trim().length >= 2) {
        performSearch();
      } else if (!search.trim() && originalUsers) {
        dispatch(setOtherUsers(originalUsers));
        setNoResults(false);
      }
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [search, dispatch, originalUsers]);

  return (
    <div className="border-r border-white/20 p-4 flex flex-col bg-gray-800/40 w-full md:w-80 h-full overflow-hidden">
      <div className="relative mb-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input input-bordered rounded-lg w-full bg-gray-700/50 text-white placeholder-gray-400 border-gray-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50 transition-all"
          type="text"
          placeholder="Search by name or username..."
          disabled={isSearching}
        />
        
        {search && (
          <button 
            onClick={() => setSearch('')} 
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
          >
            ×
          </button>
        )}
      </div>
      
      {noResults && (
        <div className="text-center text-red-400 mt-1 mb-2 text-sm">
          No users found
        </div>
      )}
      
      <div className="divider my-1 before:bg-gray-600/50 after:bg-gray-600/50"></div>
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <OtherUsers />
      </div>
      <div className="mt-2 pt-2 border-t border-gray-700/50">
        <button onClick={logoutHandler} className="btn btn-sm bg-red-450 hover:bg-red-500 border-none text-white w-full">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
