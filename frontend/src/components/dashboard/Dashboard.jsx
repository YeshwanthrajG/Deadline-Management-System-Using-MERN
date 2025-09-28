import React, { useEffect } from 'react';
import { useTasks } from '../../context/TaskContext';
import TaskStats from './TaskStats';

const Dashboard = () => {
  const { tasks, fetchTasks, loading } = useTasks();

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const getProgressData = () => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    const inProgress = tasks.filter(t => t.status === 'in-progress').length;
    const pending = tasks.filter(t => t.status === 'pending').length;
    const missed = tasks.filter(t => t.status === 'missed').length;

    const completionRate = total > 0 ? ((completed / total) * 100).toFixed(1) : 0;
    
    return {
      total, completed, inProgress, pending, missed, completionRate
    };
  };

  const getRecentTasks = () => {
    return tasks
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, 5);
  };

  const progress = getProgressData();
  const recentTasks = getRecentTasks();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="flex items-center space-x-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="text-xl text-gray-600">Loading your progress...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            📊 Task Dashboard
          </h1>
          <p className="text-xl text-gray-600">
            Track your productivity and stay on top of your goals
          </p>
        </div>

        {/* Stats Overview */}
        <TaskStats tasks={tasks} />

        {/* Progress Charts and Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Progress Chart */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="mr-3">🎯</span>
              Overall Progress
            </h3>
            
            <div className="space-y-6">
              {/* Completion Rate */}
              <div className="text-center">
                <div className="text-6xl font-bold text-blue-600 mb-2">
                  {progress.completionRate}%
                </div>
                <div className="text-gray-600">Tasks Completed</div>
              </div>

              {/* Progress Bars */}
              <div className="space-y-4">
                {[
                  { label: 'Completed', count: progress.completed, color: 'bg-green-500', bgColor: 'bg-green-100' },
                  { label: 'In Progress', count: progress.inProgress, color: 'bg-blue-500', bgColor: 'bg-blue-100' },
                  { label: 'Pending', count: progress.pending, color: 'bg-yellow-500', bgColor: 'bg-yellow-100' },
                  { label: 'Missed', count: progress.missed, color: 'bg-red-500', bgColor: 'bg-red-100' }
                ].map(item => {
                  const percentage = progress.total > 0 ? (item.count / progress.total) * 100 : 0;
                  return (
                    <div key={item.label}>
                      <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                        <span>{item.label}</span>
                        <span>{item.count} ({percentage.toFixed(0)}%)</span>
                      </div>
                      <div className={`w-full ${item.bgColor} rounded-full h-3`}>
                        <div
                          className={`${item.color} h-3 rounded-full transition-all duration-1000 ease-out`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="mr-3">📝</span>
              Recent Activity
            </h3>
            
            {recentTasks.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">📋</div>
                <p className="text-gray-500">No tasks yet. Start by creating your first task!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentTasks.map(task => (
                  <div key={task._id} className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200">
                    <div className="flex-shrink-0 mr-4">
                      <div className={`w-3 h-3 rounded-full ${
                        task.status === 'completed' ? 'bg-green-500' :
                        task.status === 'in-progress' ? 'bg-blue-500' :
                        task.status === 'missed' ? 'bg-red-500' : 'bg-yellow-500'
                      }`}></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {task.title}
                      </p>
                      <div className="flex items-center space-x-3 text-xs text-gray-500">
                        <span className={`px-2 py-1 rounded-full ${
                          task.priority === 'high' ? 'bg-red-100 text-red-800' :
                          task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {task.priority}
                        </span>
                        <span>{task.status.replace('-', ' ')}</span>
                        {task.recurrence?.type !== 'one-time' && (
                          <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                            {task.recurrence.type}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Motivational Section */}
        <div className="mt-8 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 rounded-2xl p-8 text-white">
          <div className="text-center">
            <h3 className="text-3xl font-bold mb-4">
              {progress.completionRate >= 80 ? '🎉 Amazing Progress!' :
               progress.completionRate >= 60 ? '💪 Great Work!' :
               progress.completionRate >= 40 ? '👍 Keep Going!' :
               '🚀 Let\'s Get Started!'}
            </h3>
            <p className="text-xl opacity-90">
              {progress.completionRate >= 80 ? 'You\'re crushing your goals! Keep up the excellent work!' :
               progress.completionRate >= 60 ? 'You\'re doing great! A few more tasks to go!' :
               progress.completionRate >= 40 ? 'Good momentum! Stay focused and keep pushing forward!' :
               'Every journey begins with a single step. You\'ve got this!'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
