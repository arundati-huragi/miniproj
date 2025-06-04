import React, { useContext, useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Tasks from '../components/Tasks.jsx';
import MainLayout from '../layouts/MainLayout';
import DashboardSummary from '../components/DashboardSummary';
import { TaskContext } from '../context/TaskContext';

const Home = () => {

  const authState = useSelector(state => state.authReducer);
  const { isLoggedIn } = authState;

  const { tasks, totalTasksCount, completedTasksCount, fetchTasks } = useContext(TaskContext);

  const [filter, setFilter] = useState('all');

  useEffect(() => {
    document.title = isLoggedIn && authState.user.name ? `${authState.user.name}'s tasks` : "Listify";
  }, [authState, isLoggedIn]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleTotalTasksClick = () => {
    setFilter('total');
  };

  const filteredTasks = filter === 'total' ? tasks : tasks;

  return (
    <>
      <MainLayout>
          {!isLoggedIn ? (
          <div className='bg-gradient-to-r from-blue-700 via-cyan-600 to-teal-500 text-white min-h-[60vh] flex flex-col md:flex-row justify-center items-center py-16 px-8 rounded-xl shadow-xl max-w-7xl mx-auto mt-16 gap-12'>
            <div className='flex-1 flex flex-col justify-center items-start px-6'>
              <h1 className='text-5xl font-extrabold mb-6 leading-tight drop-shadow-lg'>Welcome to LISTIFY</h1>
              <p className='mb-10 text-lg max-w-lg leading-relaxed drop-shadow-md'>Organize your tasks efficiently and boost your productivity with our intuitive task management app.</p>
              <Link to="/signup" className='bg-white text-teal-700 font-semibold rounded-lg px-8 py-4 shadow-lg hover:bg-cyan-100 transition duration-300'>
                Join now to manage your tasks <i className="fa-solid fa-arrow-right ml-3"></i>
              </Link>
            </div>
            <div className='flex-1 flex justify-center items-center'>
              <img src="/white_on_trans.png" alt="Logo" className='max-h-96 max-w-full object-contain' />
            </div>
          </div>
        ) : (
          <>
            <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white rounded-xl shadow-lg p-6 max-w-4xl mx-auto mt-12 mb-6">
              <h1 className='text-4xl font-extrabold mb-2 drop-shadow-md'>Welcome back, {authState.user.name}!</h1>
              <p className="text-lg drop-shadow-sm">Ready to manage your tasks and boost your productivity today?</p>
            </div>
            <DashboardSummary totalTasks={totalTasksCount} completedTasks={completedTasksCount} onTotalTasksClick={handleTotalTasksClick} />
            <div className="mt-6">
              <Tasks tasks={filteredTasks} fetchTasks={fetchTasks} token={authState.token} />
            </div>
          </>
        )}

      </MainLayout>
    </>
  )
}

export default Home
