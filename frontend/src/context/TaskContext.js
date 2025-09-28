import React, { createContext, useContext, useState, useCallback } from 'react';
import taskService from '../services/taskService';

const TaskContext = createContext();

export const useTasks = () => useContext(TaskContext);

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTasks = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const fetched = await taskService.getTasks(params);
      setTasks(fetched);
    } catch {
      setTasks([]);
    }
    setLoading(false);
  }, []);

  const createTask = async (task) => {
    const newTask = await taskService.createTask(task);
    setTasks(prev => [newTask, ...prev]);
    return newTask;
  };

  const updateTask = async (id, updates) => {
    const upd = await taskService.updateTask(id, updates);
    setTasks(list => list.map(t => t._id === id ? upd : t));
    return upd;
  };

  const deleteTask = async (id) => {
    await taskService.deleteTask(id);
    setTasks(list => list.filter(t => t._id !== id));
  };

  return (
    <TaskContext.Provider value={{
      tasks, fetchTasks, loading, createTask, updateTask, deleteTask
    }}>
      {children}
    </TaskContext.Provider>
  );
};
