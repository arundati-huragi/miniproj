import React from 'react';

const DashboardSummary = ({ totalTasks, completedTasks, onTotalTasksClick }) => {
  const pendingTasks = totalTasks - completedTasks;

  return (
    <div className="bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 rounded-xl shadow-xl p-10 mb-10 max-w-5xl mx-auto text-white font-heading">
      <h2 className="text-4xl font-extrabold mb-8 text-white drop-shadow-lg">Task Summary</h2>
      <div className="grid grid-cols-3 gap-10 text-center">
        <button
          onClick={onTotalTasksClick}
          className="bg-indigo-700 bg-opacity-70 rounded-lg p-8 shadow-lg transform hover:scale-105 transition-transform duration-300 focus:outline-none"
          aria-label="Show Total Tasks"
        >
          <p className="text-6xl font-extrabold">{totalTasks}</p>
          <p className="mt-3 text-xl font-semibold">Total Tasks</p>
        </button>
        <div className="bg-green-600 bg-opacity-70 rounded-lg p-8 shadow-lg transform hover:scale-105 transition-transform duration-300">
          <p className="text-6xl font-extrabold">{completedTasks}</p>
          <p className="mt-3 text-xl font-semibold">Completed Tasks</p>
        </div>
        <div className="bg-yellow-500 bg-opacity-70 rounded-lg p-8 shadow-lg transform hover:scale-105 transition-transform duration-300">
          <p className="text-6xl font-extrabold">{pendingTasks}</p>
          <p className="mt-3 text-xl font-semibold">Pending Tasks</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardSummary;
