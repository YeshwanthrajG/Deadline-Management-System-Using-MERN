import React, { useEffect } from 'react';
import { useTasks } from '../../context/TaskContext';
import TaskStats from './TaskStats';
import { 
  ChartBarIcon,
  ClipboardDocumentListIcon,
  TrophyIcon,
  RocketLaunchIcon 
} from '@heroicons/react/24/outline';

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-indigo-200 rounded-full animate-pulse"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-medium text-white mb-2">Loading Dashboard</h3>
            <p className="text-gray-400">Please wait while we fetch your data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl">
              <ChartBarIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Dashboard
              </h1>
              <p className="text-xl text-gray-400">
                Track your productivity and manage your tasks efficiently
              </p>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <TaskStats tasks={tasks} />

        {/* Progress Charts and Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Progress Chart */}
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg">
                <TrophyIcon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white">Overall Progress</h3>
            </div>
            
            <div className="space-y-6">
              {/* Completion Rate */}
              <div className="text-center">
                <div className="relative inline-flex items-center justify-center w-32 h-32 mb-4">
                  <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-slate-700"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="transparent"
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-indigo-500"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeDasharray={`${progress.completionRate}, 100`}
                      strokeLinecap="round"
                      fill="transparent"
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white">
                        {progress.completionRate}%
                      </div>
                      <div className="text-xs text-gray-400">Complete</div>
                    </div>
                  </div>
                </div>
                <div className="text-gray-400">Tasks Completed</div>
              </div>

              {/* Progress Bars */}
              <div className="space-y-4">
                {[
                  { label: 'Completed', count: progress.completed, color: 'bg-emerald-500', bgColor: 'bg-emerald-500/20', textColor: 'text-emerald-400' },
                  { label: 'In Progress', count: progress.inProgress, color: 'bg-blue-500', bgColor: 'bg-blue-500/20', textColor: 'text-blue-400' },
                  { label: 'Pending', count: progress.pending, color: 'bg-yellow-500', bgColor: 'bg-yellow-500/20', textColor: 'text-yellow-400' },
                  { label: 'Missed', count: progress.missed, color: 'bg-red-500', bgColor: 'bg-red-500/20', textColor: 'text-red-400' }
                ].map(item => {
                  const percentage = progress.total > 0 ? (item.count / progress.total) * 100 : 0;
                  return (
                    <div key={item.label}>
                      <div className="flex justify-between text-sm font-medium text-gray-300 mb-2">
                        <span className={item.textColor}>{item.label}</span>
                        <span className="text-gray-400">{item.count} ({percentage.toFixed(0)}%)</span>
                      </div>
                      <div className={`w-full ${item.bgColor} rounded-full h-2`}>
                        <div
                          className={`${item.color} h-2 rounded-full transition-all duration-1000 ease-out`}
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
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg">
                <ClipboardDocumentListIcon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white">Recent Activity</h3>
            </div>
            
            {recentTasks.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ClipboardDocumentListIcon className="w-8 h-8 text-gray-500" />
                </div>
                <p className="text-gray-400 mb-2">No tasks yet</p>
                <p className="text-gray-500 text-sm">Create your first task to get started!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentTasks.map(task => (
                  <div key={task._id} className="flex items-center p-4 bg-slate-700/30 rounded-xl border border-slate-600/30 hover:bg-slate-700/50 transition-all duration-200">
                    <div className="flex-shrink-0 mr-4">
                      <div className={`w-3 h-3 rounded-full ${
                        task.status === 'completed' ? 'bg-emerald-500' :
                        task.status === 'in-progress' ? 'bg-blue-500' :
                        task.status === 'missed' ? 'bg-red-500' : 'bg-yellow-500'
                      }`}></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {task.title}
                      </p>
                      <div className="flex items-center space-x-3 mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          task.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                          task.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-green-500/20 text-green-400'
                        }`}>
                          {task.priority}
                        </span>
                        <span className="text-xs text-gray-400 capitalize">
                          {task.status.replace('-', ' ')}
                        </span>
                        {task.recurrence?.type !== 'one-time' && (
                          <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full text-xs font-medium">
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
        <div className="mt-8 bg-gradient-to-r from-emerald-500/20 via-blue-500/20 to-purple-600/20 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full mb-6">
              <RocketLaunchIcon className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-4">
              {progress.completionRate >= 80 ? 'Outstanding Performance!' :
               progress.completionRate >= 60 ? 'Excellent Progress!' :
               progress.completionRate >= 40 ? 'Keep Up The Momentum!' :
               '🚀 Ready To Achieve More!'}
            </h3>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              {progress.completionRate >= 80 ? 'You\'re absolutely crushing your goals! Your dedication and consistency are truly inspiring.' :
               progress.completionRate >= 60 ? 'You\'re making fantastic progress! Just a few more tasks and you\'ll reach your peak performance.' :
               progress.completionRate >= 40 ? 'Great momentum building up! Stay focused and continue pushing forward to reach new heights.' :
               'Every great journey begins with a single step. You have the power to accomplish amazing things!'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
