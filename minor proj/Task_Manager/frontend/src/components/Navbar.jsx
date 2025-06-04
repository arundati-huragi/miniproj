import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { logout } from '../redux/actions/authActions';
import Notifications from './Notifications';

const Navbar = () => {
  const authState = useSelector(state => state.authReducer);
  const dispatch = useDispatch();
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);

  const toggleNavbar = () => {
    setIsNavbarOpen(!isNavbarOpen);
  };

  const handleLogoutClick = () => {
    dispatch(logout());
  };

  return (
    <>
      <header className='flex justify-between sticky top-0 p-4 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 shadow-md items-center font-sans text-white'>
        <h2 className='cursor-pointer uppercase font-heading text-xl flex items-center gap-2'>
          <Link to="/" className="text-white hover:text-yellow-100 transition">Listify</Link>
        </h2>
        <ul className='flex gap-4 uppercase font-medium items-center'>
          {authState.isLoggedIn ? (
            <>
              <li className="bg-primary text-white font-medium rounded-md shadow-md transition duration-300 hover:bg-primary-dark">
                <Link to='/tasks/add' className='block w-full h-full px-4 py-2 flex items-center gap-2 text-white'> <i className="fa-solid fa-plus"></i> Add task </Link>
              </li>
              <li>
                <Notifications />
              </li>
              <li className='py-2 px-3 cursor-pointer hover:bg-yellow-700 transition rounded-sm' onClick={handleLogoutClick}>Logout</li>
            </>
          ) : (
<li className='py-2 px-3 cursor-pointer hover:bg-gray-700 transition rounded-sm'><Link to="/login" className="text-white">Login</Link></li>
          )}
        </ul>
        <span className='md:hidden cursor-pointer text-white' onClick={toggleNavbar}><i className="fa-solid fa-bars"></i></span>

        {/* Navbar displayed as sidebar on smaller screens */}
        <div className={`absolute md:hidden right-0 top-0 bottom-0 transition ${(isNavbarOpen === true) ? 'translate-x-0' : 'translate-x-full'} bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 shadow-lg w-screen sm:w-9/12 h-screen font-sans text-white`}>
          <div className='flex'>
            <span className='m-4 ml-auto cursor-pointer text-white' onClick={toggleNavbar}><i className="fa-solid fa-xmark"></i></span>
          </div>
          <ul className='flex flex-col gap-4 uppercase font-medium text-center'>
            {authState.isLoggedIn ? (
              <>
                <li className="bg-primary text-white font-medium transition py-2 px-3 rounded-md shadow-md hover:bg-primary-dark">
                  <Link to='/tasks/add' className='block w-full h-full flex items-center gap-2 text-white'> <i className="fa-solid fa-plus"></i> Add task </Link>
                </li>
                <li>
                  <Notifications />
                </li>
                <li className='py-2 px-3 cursor-pointer hover:bg-yellow-700 transition rounded-sm' onClick={handleLogoutClick}>Logout</li>
              </>
            ) : (
              <li className='py-2 px-3 cursor-pointer text-white hover:bg-yellow-700 transition rounded-sm'><Link to="/login">Login</Link></li>
            )}
          </ul>
        </div>
      </header>
    </>
  );
};

export default Navbar;
