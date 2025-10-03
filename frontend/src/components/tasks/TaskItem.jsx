// emojis are copied from online websites
import React, { useState } from 'react';
import { useTasks } from '../../context/TaskContext';
import Button from '../common/Button';
import { toast } from 'react-hot-toast';

const BACKEND_URL = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';

const TaskItem = ({ task, onEdit }) => {
  const { updateTask, deleteTask } = useTasks();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const getStatusAccent = () => {
    if (task.status === 'completed') return 'bg-emerald-500';
    if (task.status === 'in-progress') return 'bg-blue-500';
    if (task.status === 'missed') return 'bg-red-500';
    return 'bg-yellow-500';
  };

  const handleStatusToggle = async () => {
    setIsUpdating(true);
    try {
      await updateTask(task._id, {
        status: task.status === 'completed' ? 'pending' : 'completed',
      });
      toast.success(
        task.status === 'completed' ? 'Task marked as pending' : 'Task completed!'
      );
    } catch {
      toast.error('Failed to update task');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    setIsDeleting(true);
    try {
      await deleteTask(task._id);
      toast.success('Task deleted successfully');
    } catch {
      toast.error('Failed to delete task');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className={`rounded-xl border border-slate-700 shadow-lg px-5 py-6 relative bg-slate-800/80`}>
      <span className={`absolute top-4 right-4 w-3 h-3 rounded-full ${getStatusAccent()}`}></span>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 mb-2">
          <span className={
            `px-3 py-1 rounded-full text-xs font-bold border shadow-sm ${
              task.priority === 'high'
              ? 'bg-red-500/20 text-red-400 border-red-500/40'
              : task.priority === 'medium'
              ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40'
              : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
            }`
          }>
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </span>
          <span className="text-xs px-2 py-1 rounded-full border border-slate-600 bg-slate-700 text-gray-400">
            {new Date(task.dueDate).toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: '2-digit' })}
          </span>
        </div>
        <h3 className={`text-lg font-bold ${task.status === 'missed' ? 'text-gray-500 line-through' : 'text-white'}`}>
          {task.title}
        </h3>
        <p className={`text-sm text-gray-400`}>
          {task.description}
        </p>
        {task.meetingLink && (
          <a
            href={task.meetingLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-blue-400 hover:text-blue-200 font-medium text-xs transition-colors duration-200"
          >
            🔗 Join Meeting
          </a>
        )}
        <span className={`inline-block mt-1 px-2 py-1 rounded text-xs font-semibold 
          ${
            task.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400'
            : task.status === 'in-progress' ? 'bg-blue-500/20 text-blue-400'
            : task.status === 'missed' ? 'bg-red-500/20 text-red-400'
            : 'bg-yellow-500/20 text-yellow-400'
          }`
        }>
          {task.status.replace('-', ' ')}
        </span>
      </div>
      {task.imageUrl && (
        <div className="mt-3 w-24 h-24 rounded-lg border border-slate-700 overflow-hidden flex items-center justify-center">
          <img
            src={`${BACKEND_URL}${task.imageUrl}`}
            alt="Task"
            className="max-w-full max-h-full object-contain bg-slate-800"
          />
        </div>
      )}
      <div className="flex flex-wrap gap-3 mt-4 justify-end">
        <Button
          onClick={handleStatusToggle}
          disabled={isUpdating || task.status === 'missed'}
          isLoading={isUpdating}
          className={`${task.status === 'completed' ? 'bg-yellow-500' : 'bg-emerald-500'} text-white`}
        >
          {task.status === 'completed' ? '↩️ Undo' : '✅ Complete'}
        </Button>
        <Button onClick={onEdit} className="bg-blue-500 hover:bg-blue-600 text-white">
          ✏️ Edit
        </Button>
        <Button
          onClick={handleDelete}
          disabled={isDeleting}
          isLoading={isDeleting}
          className="bg-red-500 hover:bg-red-600 text-white"
        >
          🗑️ Delete
        </Button>
      </div>
    </div>
  );
};

export default TaskItem;
