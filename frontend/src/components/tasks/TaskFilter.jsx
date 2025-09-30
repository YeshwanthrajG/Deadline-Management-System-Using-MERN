import React from 'react';

const TaskFilter = ({ filters, setFilters }) => (
  <div className="bg-slate-700/40 rounded-xl p-5 shadow-lg border border-slate-600 mb-5">
    <div className="flex flex-wrap gap-6">
      <div>
        <label className="block text-gray-300 mb-1 font-semibold">Status</label>
        <select
          value={filters.status || ''}
          onChange={e => setFilters({ ...filters, status: e.target.value })}
          className="bg-slate-800 border border-slate-600 text-white px-3 py-2 rounded-lg"
        >
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      <div>
        <label className="block text-gray-300 mb-1 font-semibold">Priority</label>
        <select
          value={filters.priority || ''}
          onChange={e => setFilters({ ...filters, priority: e.target.value })}
          className="bg-slate-800 border border-slate-600 text-white px-3 py-2 rounded-lg"
        >
          <option value="">All</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>
    </div>
  </div>
);

export default TaskFilter;
