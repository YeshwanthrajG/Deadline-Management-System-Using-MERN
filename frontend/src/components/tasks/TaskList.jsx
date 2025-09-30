import React, { useState } from 'react';
import { useTasks } from '../../context/TaskContext';
import TaskForm from './TaskForm';
import TaskItem from './TaskItem';

const BOARD_COLUMNS = [
  {
    status: 'pending',
    label: 'To Do',
    color: 'bg-yellow-500/20 border-yellow-50',
    accent: 'bg-yellow-500/20'
  },
  {
    status: 'in-progress',
    label: 'In Progress',
    color: 'bg-blue-500/20 border-blue-50',
    accent: 'bg-blue-500/20'
  },
  {
    status: 'completed',
    label: 'Done',
    color: 'bg-emerald-500/20 border-emerald-50',
    accent: 'bg-emerald-500/20'
  },
];

const TaskList = () => {
  const { tasks } = useTasks();
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editTask, setEditTask] = useState(null);

  const onEditTask = (task) => {
    setEditTask(task);
    setShowTaskForm(true);
  };

  const closeForm = () => {
    setShowTaskForm(false);
    setEditTask(null);
  };

  return (
    <div className="min-h-screen bg-transparent py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-white">My Board</h2>
          <button
            onClick={() => setShowTaskForm(true)}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl font-bold transition-all"
          >
            + Add Task
          </button>
        </div>
        {/* Board columns */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8">
          {BOARD_COLUMNS.map((col) => (
            <div key={col.status} className={`rounded-2xl shadow-xl border ${col.color} p-2 flex flex-col`}>
              <div className="text-lg font-bold mb-3 flex items-center space-x-2">
                <span className={`inline-block w-3 h-3 rounded-full ${col.accent}`}></span>
                <span className="text-white">{col.label}</span>
                <span className="ml-2 px-2 py-1 text-xs font-bold bg-slate-800/60 rounded-lg text-gray-400">{tasks.filter(task => task.status === col.status).length}</span>
              </div>
              <div className="space-y-5">
                {tasks.filter(task => task.status === col.status).map(task => (
                  <TaskItem key={task._id} task={task} onEdit={() => onEditTask(task)} />
                ))}
                {tasks.filter(task => task.status === col.status).length === 0 && (
                  <div className="text-sm px-3 py-5 text-gray-400 text-center border border-slate-700 bg-slate-700/30 rounded-lg">
                    No tasks yet!
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      {(showTaskForm || editTask) && (
        <TaskForm initialData={editTask} onDone={closeForm} />
      )}
    </div>
  );
};

export default TaskList;
