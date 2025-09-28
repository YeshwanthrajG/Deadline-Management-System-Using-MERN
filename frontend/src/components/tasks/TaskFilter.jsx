import React, { useState } from 'react';

const sortOptions = [
  { label: 'Alphabetical', value: { sortBy: 'title', sortOrder: 'asc' } },
  { label: 'Priority (High first)', value: { sortBy: 'priority', sortOrder: 'desc' } },
  { label: 'Created (Newest first)', value: { sortBy: 'createdAt', sortOrder: 'desc' } },
  { label: 'Deadline (Soonest first)', value: { sortBy: 'dueDate', sortOrder: 'asc' } }
];

const filterOptions = [
  { label: 'All', value: {} },
  { label: 'Pending', value: { status: 'pending' } },
  { label: 'In Progress', value: { status: 'in-progress' } },
  { label: 'Completed', value: { status: 'completed' } },
  { label: 'Priority: High', value: { priority: 'high' } },
  { label: 'Priority: Medium', value: { priority: 'medium' } },
  { label: 'Priority: Low', value: { priority: 'low' } }
];

const TaskFilter = ({ setFilter, setSort }) => {
  const [filterIdx, setFilterIdx] = useState(0);
  const [sortIdx, setSortIdx] = useState(2);

  function handleFilterChange(e) {
    const idx = Number(e.target.value);
    setFilterIdx(idx);
    setFilter(filterOptions[idx].value);
  }
  function handleSortChange(e) {
    const idx = Number(e.target.value);
    setSortIdx(idx);
    setSort(sortOptions[idx].value);
  }
  return (
    <div className="flex gap-4 mb-4">
      <select onChange={handleFilterChange} value={filterIdx} className="border px-2 py-1 rounded">
        {filterOptions.map((opt, i) =>
          <option value={i} key={i}>{opt.label}</option>
        )}
      </select>
      <select onChange={handleSortChange} value={sortIdx} className="border px-2 py-1 rounded">
        {sortOptions.map((opt, i) =>
          <option value={i} key={i}>{opt.label}</option>
        )}
      </select>
    </div>
  );
};

export default TaskFilter;
