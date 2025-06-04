import React, { useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import Tooltip from './utils/Tooltip';

const Tasks = ({ tasks, fetchTasks, token }) => {
  const [fetchData] = useFetch();
  const navigate = useNavigate();

  const handleDelete = useCallback((id) => {
    const config = { url: `/tasks/${id}`, method: "delete", headers: { Authorization: `Bearer ${token}` } };
    fetchData(config).then(() => fetchTasks());
  }, [fetchData, fetchTasks, token]);

  const handleToggleComplete = useCallback((task) => {
    const config = {
      url: `/tasks/${task._id}`,
      method: "put",
      data: { status: task.completed ? "pending" : "completed", description: task.description },
      headers: { Authorization: `Bearer ${token}` }
    };
    fetchData(config).then(() => {
      fetchTasks();
    });
  }, [fetchData, fetchTasks, token]);

  const handleCardClick = (taskId) => {
    navigate(`/tasks/${taskId}`);
  };

  return (
    <div className="my-4 mx-auto max-w-[700px] py-6 bg-card-bg rounded-lg shadow-lg border border-gray-300">
      {tasks.length !== 0 && <h2 className='my-4 ml-2 md:ml-0 text-2xl font-heading text-primary'>Your tasks ({tasks.length})</h2>}

      {tasks.length === 0 ? (
        <div className='w-[600px] h-[300px] flex items-center justify-center gap-4 text-text-secondary'>
          <span>No tasks found</span>
          <Link to="/tasks/add" className="bg-primary text-white hover:bg-primary-dark font-medium rounded-md px-4 py-2 shadow-md transition duration-300">+ Add new task </Link>
        </div>
      ) : (
        tasks.map((task, index) => (
          <div
            key={task._id}
            className='bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 my-4 p-5 text-white rounded-lg shadow-xl border border-transparent flex items-center transition-transform transform hover:scale-[1.02] cursor-pointer'
            onClick={() => handleCardClick(task._id)}
          >

            <input
              type="checkbox"
              checked={task.completed}
              onChange={(e) => {
                e.stopPropagation();
                handleToggleComplete(task);
              }}
              className="mr-5 w-6 h-6 cursor-pointer accent-white"
            />

            <div className='flex-1'>
              <div className='flex items-center'>
                <span className='font-heading font-semibold text-white text-lg'>{task.title ? task.title : `Task #${index + 1}`}</span>

                <Tooltip text={"Edit this task"} position={"top"}>
                  <Link
                    to={`/tasks/${task._id}`}
                    onClick={(e) => e.stopPropagation()}
                    className='ml-auto mr-3 text-white cursor-pointer hover:text-yellow-300 transition'
                  >
                    <i className="fa-solid fa-pen"></i>
                  </Link>
                </Tooltip>

                <Tooltip text={"Delete this task"} position={"top"}>
                  <span
                    className='text-red-500 cursor-pointer hover:text-red-600 transition'
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(task._id);
                    }}
                  >
                    <i className="fa-solid fa-trash"></i>
                  </span>
                </Tooltip>
              </div>
              <div className='whitespace-pre-wrap mt-2 break-words break-all'>{task.description}</div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Tasks;
