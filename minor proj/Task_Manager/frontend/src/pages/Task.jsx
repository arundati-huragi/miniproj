import React, { useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Textarea } from '../components/utils/Input';
import Loader from '../components/utils/Loader';
import useFetch from '../hooks/useFetch';
import MainLayout from '../layouts/MainLayout';
import validateManyFields from '../validations';
import { TaskContext } from '../context/TaskContext';
import Tasks from '../components/Tasks';

const Task = () => {
  const authState = useSelector(state => state.authReducer);
  const navigate = useNavigate();
  const [fetchData, { loading }] = useFetch();
  const { taskId } = useParams();

  const mode = taskId === undefined ? "add" : "update";
  const [task, setTask] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    reminderDate: ""
  });
  const [formErrors, setFormErrors] = useState({});

  const { tasks, fetchTasks } = useContext(TaskContext);

  useEffect(() => {
    document.title = mode === "add" ? "Add task" : "Update Task";
  }, [mode]);

  useEffect(() => {
    if (mode === "update") {
      const config = { url: `/tasks/${taskId}`, method: "get", headers: { Authorization: authState.token } };
      fetchData(config, { showSuccessToast: false }).then((data) => {
        setTask(data.task);
        setFormData({
          title: data.task.title || "",
          description: data.task.description,
          reminderDate: data.task.reminderDate ? new Date(data.task.reminderDate).toLocaleString('sv-SE', { hour12: false }).slice(0,16) : ""
        });
      });
    }
  }, [mode, authState, taskId, fetchData]);

  const handleChange = e => {
    setFormData({
      ...formData, [e.target.name]: e.target.value
    });
  }

  const handleReset = e => {
    e.preventDefault();
    setFormData({
      description: task.description,
      reminderDate: task.reminderDate ? new Date(task.reminderDate).toLocaleString('sv-SE', { hour12: false }).slice(0,16) : ""
    });
  }

  const handleSubmit = e => {
    e.preventDefault();
    const errors = validateManyFields("task", formData);
    setFormErrors({});

    if (errors.length > 0) {
      setFormErrors(errors.reduce((total, ob) => ({ ...total, [ob.field]: ob.err }), {}));
      return;
    }

    if (!authState.user || !authState.user.name) {
      return (
        <MainLayout>
          <div className="m-auto my-16 max-w-[1000px] bg-white p-8 border-2 shadow-md rounded-md text-center">
            <h2 className="text-2xl font-semibold">Welcome back!</h2>
            <p className="mt-4 text-gray-600">User information is not available.</p>
          </div>
        </MainLayout>
      );
    }

    if (mode === "add") {
      const config = { url: "/tasks", method: "post", data: formData, headers: { Authorization: authState.token } };
      fetchData(config).then(async () => {
        await fetchTasks();
        navigate("/");
      });
    }
    else {
      const config = { url: `/tasks/${taskId}`, method: "put", data: formData, headers: { Authorization: authState.token } };
      fetchData(config).then(async () => {
        await fetchTasks();
        navigate("/");
      });
    }
  }

  const fieldError = (field) => (
    <p className={`mt-1 text-pink-600 text-sm ${formErrors[field] ? "block" : "hidden"}`}>
      <i className='mr-2 fa-solid fa-circle-exclamation'></i>
      {formErrors[field]}
    </p>
  )

  return (
    <>
      <MainLayout>
        <div className="m-auto my-16 max-w-[1000px] bg-gradient-to-r from-pink-400 via-purple-500 to-blue-600 text-lightgrey p-8 rounded-xl shadow-lg border-2 border-transparent">
          <h2 className="text-4xl font-extrabold mb-4 drop-shadow-md">Welcome back, {authState.user && authState.user.name ? authState.user.name : "User"}!</h2>
          <p className="mb-6 text-lg drop-shadow-sm">Ready to {mode === "add" ? "add a new task" : "update your task"} and boost your productivity?</p>
          <form>
            {loading ? (
              <Loader />
            ) : (
              <>
                <div className="mb-4">
                  <label htmlFor="title">Title</label>
                  <input type="text" name="title" id="title" value={formData.title} placeholder="Enter title" onChange={handleChange} className="border rounded-md p-2 w-full" />
                </div>
                <div className="mb-4">
                  <label htmlFor="description">Description</label>
                  <Textarea type="description" name="description" id="description" value={formData.description} placeholder="Write here.." onChange={handleChange} />
                  {fieldError("description")}
                </div>

                <div className="mb-4">
                  <label htmlFor="reminderDate">Reminder</label>
                  <input type="datetime-local" name="reminderDate" id="reminderDate" value={formData.reminderDate} onChange={handleChange} className="border rounded-md p-2 w-full" />
                  {fieldError("reminderDate")}
                </div>

                <button className='bg-primary text-white px-4 py-2 font-medium hover:bg-primary-dark' onClick={handleSubmit}>{mode === "add" ? "Add task" : "Update Task"}</button>
                <button className='ml-4 bg-red-500 text-white px-4 py-2 font-medium' onClick={() => navigate("/")}>Cancel</button>
                {mode === "update" && <button className='ml-4 bg-blue-500 text-white px-4 py-2 font-medium hover:bg-blue-600' onClick={handleReset}>Reset</button>}
              </>
            )}
          </form>
        </div>
      </MainLayout>
    </>
  )
}

export default Task;
