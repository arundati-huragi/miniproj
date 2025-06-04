import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/actions/authActions';

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="w-64 h-screen bg-gradient-to-b from-indigo-700 via-purple-800 to-pink-700 shadow-lg p-6 flex flex-col text-white font-semibold">
      <h2 className="text-2xl font-bold mb-8 tracking-wide drop-shadow-lg">Settings</h2>
      <nav className="flex flex-col gap-6">
        <NavLink
          to="/settings/profile"
          className={({ isActive }) =>
            `px-6 py-3 rounded-md transition duration-300 ${
              isActive ? 'bg-white bg-opacity-25 font-bold shadow-lg' : 'hover:bg-white hover:bg-opacity-10'
            }`
          }
        >
          Profile Settings
        </NavLink>
        <button
          onClick={() => navigate('/tasks/add')}
          className="text-left px-6 py-3 rounded-md bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 text-white font-semibold shadow-lg hover:scale-105 transform transition duration-300"
        >
          Add Task
        </button>
        <button
          onClick={handleLogout}
          className="text-left px-6 py-3 rounded-md bg-red-600 hover:bg-red-700 transition duration-300 shadow-md"
        >
          Logout
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;
