const Task = require('../models/Task');
const { validationResult } = require('express-validator');

// Convert YYYY-MM-DDTHH:mm to IST Date for MongoDB
const convertToISTDate = (input) => {
  // Input: string 'YYYY-MM-DDTHH:mm'
  // Parse as IST instead of local/UTC
  const [date, time] = input.split('T');
  const [year, month, day] = date.split('-').map(Number);
  const [hour, minute] = time.split(':').map(Number);

  // Construct Date object as IST (manual)
  // JS months are 0-based
  return new Date(Date.UTC(year, month - 1, day, hour - 5, minute - 30));
};

// Should active today
const shouldTaskBeActiveToday = (task) => {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

  if (!task.recurrence || !task.recurrence.type) return true;
  if (task.recurrence.type === 'one-time') return true;
  if (task.recurrence.type === 'daily') return true;
  if (task.recurrence.type === 'custom') {
    return task.recurrence.customDays.includes(today);
  }
  return true;
};

const resetRecurringTasks = async (userId) => {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tasks = await Task.find({
    user: userId,
    'recurrence.type': { $in: ['daily', 'custom'] },
    status: { $in: ['completed', 'missed'] },
    updatedAt: { $lt: startOfDay },
  });
  for (const task of tasks) {
    if (shouldTaskBeActiveToday(task)) {
      task.status = 'pending';
      await task.save();
    }
  }
};

const getTasks = async (req, res) => {
  try {
    const { status, priority, sortBy, sortOrder } = req.query;

    await resetRecurringTasks(req.user._id);

    const filter = { user: req.user._id };
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    let tasks = await Task.find(filter);

    const now = new Date();
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

    // Mark missed
    const toMiss = tasks.filter(task => {
      if (['completed', 'missed'].includes(task.status)) return false;
      if (!task.dueDate) return false;

      const due = new Date(task.dueDate);

      if (!task.recurrence || task.recurrence.type === 'one-time') {
        return due < now;
      }

      return now > endOfDay && shouldTaskBeActiveToday(task);
    });

    await Promise.all(toMiss.map(task => {
      task.status = 'missed';
      return task.save();
    }));

    tasks = await Task.find(filter);

    tasks = tasks.filter(task => {
      if (!task.recurrence) return true;
      if (task.recurrence.type === 'one-time') return true;
      return shouldTaskBeActiveToday(task);
    });

    // Sorting (optional, unchanged)
    if (sortBy === 'priority') {
      const prioritySortMap = { high: 3, medium: 2, low: 1 };
      const direction = sortOrder === 'desc' ? -1 : 1;
      tasks.sort((a, b) => {
        const diff = (prioritySortMap[a.priority || 'medium'] - prioritySortMap[b.priority || 'medium']) * direction;
        if (diff !== 0) return diff;
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
    } else if (sortBy === 'dueDate') {
      const direction = sortOrder === 'desc' ? -1 : 1;
      tasks.sort((a, b) => (new Date(a.dueDate) - new Date(b.dueDate)) * direction);
    } else if (sortBy === 'createdAt') {
      const direction = sortOrder === 'desc' ? -1 : 1;
      tasks.sort((a, b) => (new Date(a.createdAt) - new Date(b.createdAt)) * direction);
    }

    res.json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    console.error('Error in getTasks:', error);
    res.status(500).json({ message: 'Server error while fetching tasks' });
  }
};

const createTask = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    let { title, description, priority, dueDate, meetingLink, recurrenceType, customDays } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';

    if (dueDate) {
      dueDate = convertToISTDate(dueDate);
    }

    const recurrence = {
      type: recurrenceType || 'one-time',
      customDays: recurrenceType === 'custom' ? JSON.parse(customDays || '[]') : []
    };

    const task = await Task.create({
      title,
      description,
      priority,
      dueDate,
      meetingLink,
      imageUrl,
      recurrence,
      user: req.user._id,
    });

    res.status(201).json({ success: true, data: task });
  } catch (error) {
    console.error('Error in createTask:', error);
    res.status(500).json({ message: 'Server error creating task' });
  }
};

const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (task.user.toString() !== req.user._id.toString())
      return res.status(401).json({ message: 'Not authorized' });

    if (req.file) req.body.imageUrl = `/uploads/${req.file.filename}`;

    if (req.body.dueDate) {
      req.body.dueDate = convertToISTDate(req.body.dueDate);
    }

    if (req.body.recurrenceType) {
      req.body.recurrence = {
        type: req.body.recurrenceType,
        customDays: req.body.recurrenceType === 'custom' ? JSON.parse(req.body.customDays || '[]') : []
      };
      delete req.body.recurrenceType;
      delete req.body.customDays;
    }

    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, data: updatedTask });
  } catch (error) {
    console.error('Error in updateTask:', error);
    res.status(500).json({ message: 'Server error updating task' });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (task.user.toString() !== req.user._id.toString())
      return res.status(401).json({ message: 'Not authorized' });

    await Task.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error in deleteTask:', error);
    res.status(500).json({ message: 'Server error deleting task' });
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };
