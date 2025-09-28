import React, { useState } from 'react';
import { useTasks } from '../../context/TaskContext';
import Button from '../common/Button';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns-tz';

const BACKEND_URL = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';

const IST_TIMEZONE = 'Asia/Kolkata';

const TaskItem = ({ task, onEdit }) => {
  const { updateTask, deleteTask } = useTasks();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const getTaskBackground = () => {
    if (task.status === 'completed') return 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200';
    if (task.status === 'missed') return 'bg-gradient-to-r from-gray-100 to-slate-100 border-gray-300';
    if (task.status === 'in-progress') return 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200';
    if (task.priority === 'high') return 'bg-gradient-to-r from-red-50 to-pink-50 border-red-200';
    if (task.priority === 'medium') return 'bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200';
    return 'bg-gradient-to-r from-green-50 to-lime-50 border-green-200';
  };

  const getPriorityBadge = () => {
    const baseClasses = 'px-3 py-1 rounded-full text-xs font-bold border shadow-sm';
    if (task.priority === 'high') return `${baseClasses} bg-red-100 text-red-800 border-red-300`;
    if (task.priority === 'medium') return `${baseClasses} bg-yellow-100 text-yellow-800 border-yellow-300`;
    return `${baseClasses} bg-green-100 text-green-800 border-green-300`;
  };

  const getStatusBadge = () => {
    const baseClasses = 'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium';
    if (task.status === 'completed') return `${baseClasses} bg-green-100 text-green-800`;
    if (task.status === 'in-progress') return `${baseClasses} bg-blue-100 text-blue-800`;
    if (task.status === 'missed') return `${baseClasses} bg-gray-200 text-gray-700 line-through`;
    return `${baseClasses} bg-orange-100 text-orange-800`;
  };

  const handleStatusToggle = async () => {
    setIsUpdating(true);
    try {
      await updateTask(task._id, {
        status: task.status === 'completed' ? 'pending' : 'completed',
      });
      toast.success(task.status === 'completed' ? 'Task marked as pending' : 'Task completed!');
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

  // Format dueDate in IST
  const formattedDueDate = task.dueDate
    ? format(new Date(task.dueDate), 'yyyy-MM-dd HH:mm', { timeZone: IST_TIMEZONE })
    : '';

  return (
    <div className={`${getTaskBackground()} rounded-xl border-2 p-6 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 ${task.status === 'missed' ? 'opacity-75' : ''}`}>
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
        <div className="flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className={getPriorityBadge()}>
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </span>
            <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full border">
              📅 {formattedDueDate}
            </span>
          </div>
          <h3 className={`text-lg font-bold ${task.status === 'missed' ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
            {task.title}
          </h3>
          <p className={`text-sm text-gray-600 ${task.status === 'missed' ? 'text-gray-400' : ''}`}>
            {task.description}
          </p>
          {task.meetingLink && (
            <a
              href={task.meetingLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors duration-200"
            >
              🔗 Join Meeting
            </a>
          )}
          <span className={getStatusBadge()}>
            {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
          </span>
        </div>

        {task.imageUrl && (
          <div className="w-28 h-28 shrink-0 rounded-lg border border-gray-300 overflow-hidden shadow-sm flex items-center justify-center">
            <img
              src={`${BACKEND_URL}${task.imageUrl}`}
              alt="Task"
              className="max-w-full max-h-full object-contain"
            />
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-3 mt-6 justify-end">
        <Button
          onClick={handleStatusToggle}
          disabled={isUpdating || task.status === 'missed'}
          isLoading={isUpdating}
          className={`${task.status === 'completed' ? 'bg-orange-500' : 'bg-green-500'} text-white`}
        >
          {task.status === 'completed' ? '↩️ Undo' : '✅ Complete'}
        </Button>
        <Button onClick={onEdit} className="bg-indigo-500 hover:bg-indigo-600 text-white">
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
