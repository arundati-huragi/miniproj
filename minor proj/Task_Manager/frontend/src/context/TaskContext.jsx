import React, { createContext, useState, useCallback, useEffect } from "react";
import useFetch from "../hooks/useFetch";
import { useSelector } from "react-redux";

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const authState = useSelector(state => state.authReducer);
  const { isLoggedIn } = authState;

  const [tasks, setTasks] = useState([]);
  const [totalTasksCount, setTotalTasksCount] = useState(0);
  const [completedTasksCount, setCompletedTasksCount] = useState(0);

  const [fetchTasksData] = useFetch();

  const fetchTasks = useCallback(() => {
    if (!isLoggedIn) return;
    const config = {
      url: "/tasks",
      method: "get",
      headers: {
        Authorization: `Bearer ${authState.token}`
      }
    };
    fetchTasksData(config, { showSuccessToast: false, showErrorToast: false })
      .then(data => {
        console.log("fetchTasks data:", data);
        if (data && data.tasks) {
          console.log("Setting tasks state with tasks:", data.tasks);
          setTasks(data.tasks);
          setTotalTasksCount(data.tasks.length);
          setCompletedTasksCount(data.tasks.filter(task => task.completed).length);
        }
      })
      .catch(() => {
        setTasks([]);
        setTotalTasksCount(0);
        setCompletedTasksCount(0);
      });
  }, [isLoggedIn, fetchTasksData, authState.token]);

  useEffect(() => {
    console.log("TaskContext useEffect fetchTasks called");
    fetchTasks();
  }, [fetchTasks]);

  return (
    <TaskContext.Provider value={{
      tasks,
      totalTasksCount,
      completedTasksCount,
      fetchTasks,
      setTasks,
      setTotalTasksCount,
      setCompletedTasksCount
    }}>
      {children}
    </TaskContext.Provider>
  );
};
