import React, { useEffect } from 'react';
import { useTasks } from '../../context/TaskContext';
import TaskItem from './TaskItem';
import TaskForm from './TaskForm';
import TaskFilter from './TaskFilter';
import Button from '../common/Button';

const TaskList = () => {
  const { tasks, fetchTasks, loading } = useTasks();
  const [showForm, setShowForm] = React.useState(false);
  const [editTask, setEditTask] = React.useState(null);
  const [filterParams, setFilterParams] = React.useState({});
  const [sortParams, setSortParams] = React.useState({ sortBy: 'createdAt', sortOrder: 'desc' });

  useEffect(() => {
    fetchTasks({ ...filterParams, ...sortParams });
  }, [filterParams, sortParams, fetchTasks]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              📝 Your Tasks
            </h2>
            <p className="text-gray-600 mt-2">Organize, prioritize, and accomplish your goals</p>
          </div>
          <Button 
            onClick={() => { setShowForm(true); setEditTask(null); }}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 px-6 py-3 text-lg font-semibold"
          >
            <span className="mr-2">✨</span>
            Create New Task
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
          <TaskFilter setFilter={setFilterParams} setSort={setSortParams} />
        </div>

        {/* Task Form Modal */}
        {showForm && (
          <TaskForm
            initialData={editTask}
            onDone={() => { setShowForm(false); setEditTask(null); }}
          />
        )}
        
        {/* Tasks Content */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200"></div>
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 absolute top-0"></div>
              </div>
              <span className="text-lg text-gray-600 font-medium">Loading your tasks...</span>
            </div>
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-8xl mb-6">📋</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No tasks found</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              {Object.keys(filterParams).length > 0 
                ? "No tasks match your current filters. Try adjusting your search criteria."
                : "Ready to get organized? Create your first task and start achieving your goals!"
              }
            </p>
            <Button 
              onClick={() => { setShowForm(true); setEditTask(null); }}
              className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 px-8 py-3 text-lg"
            >
              🚀 Create Your First Task
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {tasks.map(task => (
              <TaskItem
                key={task._id}
                task={task}
                onEdit={() => { setEditTask(task); setShowForm(true); }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList;
