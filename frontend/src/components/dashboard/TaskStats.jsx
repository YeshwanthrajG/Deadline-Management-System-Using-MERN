import React from 'react';
import { 
  CheckCircleIcon, 
  ClockIcon, 
  ExclamationTriangleIcon, 
  PlayCircleIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const TaskStats = ({ tasks }) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const pendingTasks = tasks.filter(task => task.status === 'pending').length;
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress').length;
  const missedTasks = tasks.filter(task => task.status === 'missed').length;

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const stats = [
    {
      name: 'Total Tasks',
      value: totalTasks,
      icon: ChartBarIcon,
      change: totalTasks > 0 ? '+' + totalTasks : '0',
      changeType: 'increase',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
    },
    {
      name: 'Completed',
      value: completedTasks,
      icon: CheckCircleIcon,
      change: completionRate + '%',
      changeType: completionRate > 70 ? 'increase' : completionRate > 40 ? 'neutral' : 'decrease',
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20',
    },
    {
      name: 'In Progress',
      value: inProgressTasks,
      icon: PlayCircleIcon,
      change: inProgressTasks > 0 ? 'Active' : 'None',
      changeType: 'neutral',
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
    },
    {
      name: 'Pending',
      value: pendingTasks,
      icon: ClockIcon,
      change: pendingTasks > 0 ? 'Waiting' : 'Clear',
      changeType: pendingTasks > 5 ? 'decrease' : 'neutral',
      color: 'from-yellow-500 to-orange-600',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/20',
    },
    {
      name: 'Missed',
      value: missedTasks,
      icon: ExclamationTriangleIcon,
      change: missedTasks > 0 ? 'Review' : 'Great!',
      changeType: missedTasks > 0 ? 'decrease' : 'increase',
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
      {stats.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.name}
            className={`relative overflow-hidden rounded-2xl ${item.bgColor} backdrop-blur-xl border ${item.borderColor} p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105`}
          >
            {/* Background decoration */}
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-16 h-16 rounded-full bg-gradient-to-br opacity-20" 
                 style={{background: `linear-gradient(to bottom right, var(--tw-gradient-stops))`}}></div>
            
            <div className="relative">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`inline-flex items-center justify-center p-3 rounded-xl bg-gradient-to-r ${item.color} shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" aria-hidden="true" />
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <div className="flex items-baseline">
                  <p className="text-3xl font-bold text-white">{item.value}</p>
                  <p className={`ml-2 flex items-baseline text-sm font-semibold ${
                    item.changeType === 'increase' ? 'text-emerald-400' : 
                    item.changeType === 'decrease' ? 'text-red-400' : 'text-gray-400'
                  }`}>
                    {item.changeType === 'increase' && (
                      <svg className="self-center flex-shrink-0 h-4 w-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                    {item.changeType === 'decrease' && (
                      <svg className="self-center flex-shrink-0 h-4 w-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                    <span className="sr-only">{item.changeType === 'increase' ? 'Increased' : 'Decreased'} by</span>
                    {item.change}
                  </p>
                </div>
                <p className="text-sm font-medium text-gray-400 mt-1">{item.name}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TaskStats;
