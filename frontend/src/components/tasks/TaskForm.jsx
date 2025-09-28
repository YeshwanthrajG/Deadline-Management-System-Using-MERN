import React, { useState, useEffect } from 'react';
import { useTasks } from '../../context/TaskContext';
import Button from '../common/Button';
import { toast } from 'react-hot-toast';
import { formatInTimeZone } from 'date-fns-tz';

const IST_TIMEZONE = 'Asia/Kolkata';

const TaskForm = ({ initialData = null, onDone }) => {
  const { createTask, updateTask } = useTasks();
  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    meetingLink: '',
    status: 'pending',
    imageFile: null,
    recurrenceType: 'one-time',
    customDays: []
  });
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const weekDays = [
    { value: 'monday', label: 'Monday' },
    { value: 'tuesday', label: 'Tuesday' },
    { value: 'wednesday', label: 'Wednesday' },
    { value: 'thursday', label: 'Thursday' },
    { value: 'friday', label: 'Friday' },
    { value: 'saturday', label: 'Saturday' },
    { value: 'sunday', label: 'Sunday' }
  ];

  useEffect(() => {
    if (initialData) {
      const dueDate = initialData.dueDate
        ? formatInTimeZone(new Date(initialData.dueDate), IST_TIMEZONE, "yyyy-MM-dd'T'HH:mm")
        : '';
      setForm({
        ...initialData,
        dueDate,
        imageFile: null,
        meetingLink: initialData.meetingLink || '',
        status: initialData.status || 'pending',
        recurrenceType: initialData.recurrence?.type || 'one-time',
        customDays: initialData.recurrence?.customDays || []
      });
      if (initialData.imageUrl) {
        const BACKEND_URL = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';
        setImagePreview(`${BACKEND_URL}${initialData.imageUrl}`);
      }
    } else {
      setForm({
        title: '',
        description: '',
        priority: 'medium',
        dueDate: '',
        meetingLink: '',
        status: 'pending',
        imageFile: null,
        recurrenceType: 'one-time',
        customDays: []
      });
      setImagePreview(null);
    }
  }, [initialData]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      Object.keys(form).forEach(key => {
        if (key === 'imageFile' && form[key]) {
          data.append('image', form[key]);
        } else if (key === 'customDays') {
          data.append('customDays', JSON.stringify(form[key]));
        } else if (key === 'dueDate' && form[key]) {
          const utcDate = new Date(form[key]).toISOString();
          data.append('dueDate', utcDate);
        } else if (key !== 'imageFile') {
          data.append(key, form[key]);
        }
      });

      if (initialData?._id) {
        await updateTask(initialData._id, data);
        toast.success('✅ Task updated successfully!');
      } else {
        await createTask(data);
        toast.success('🎉 Task created successfully!');
      }

      if (onDone) onDone();
    } catch {
      toast.error('❌ Failed to save task. Please try again.');
    }
    setLoading(false);
  }

  function handleChange(e) {
    const { name, value, files } = e.target;

    if (name === 'imageFile') {
      const file = files[0];
      setForm({ ...form, imageFile: file });
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => setImagePreview(e.target.result);
        reader.readAsDataURL(file);
      } else {
        setImagePreview(null);
      }
    } else if (name === 'customDays') {
      const day = value;
      const isChecked = form.customDays.includes(day);
      if (isChecked) {
        setForm({ ...form, customDays: form.customDays.filter(d => d !== day) });
      } else {
        setForm({ ...form, customDays: [...form.customDays, day] });
      }
    } else {
      setForm({ ...form, [name]: value });
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold text-white">
              {initialData ? '✏️ Edit Task' : '➕ Create New Task'}
            </h3>
            <button
              type="button"
              onClick={onDone}
              className="text-white hover:text-gray-200 transition-colors duration-200 p-2 hover:bg-white hover:bg-opacity-20 rounded-full"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-semibold text-gray-700">
              📝 Task Title
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="Enter a descriptive title..."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-semibold text-gray-700">
              📄 Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              placeholder="Describe your task in detail..."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
              rows={3}
            />
          </div>

          {/* Priority and Due Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="flex items-center text-sm font-semibold text-gray-700">
                🎯 Priority
              </label>
              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
              >
                <option value="low">🟢 Low Priority</option>
                <option value="medium">🟡 Medium Priority</option>
                <option value="high">🔴 High Priority</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="flex items-center text-sm font-semibold text-gray-700">
                📅 Due Date & Time
              </label>
              <input
                name="dueDate"
                value={form.dueDate}
                onChange={handleChange}
                type="datetime-local"
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
              />
            </div>
          </div>

          {/* Status Dropdown (no missed option, can only set progressive statuses) */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-semibold text-gray-700">
              📋 Status
            </label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
            >
              <option value="pending">🟠 Pending</option>
              <option value="in-progress">🔵 In Progress</option>
              <option value="completed">✅ Completed</option>
            </select>
          </div>

          {/* Recurrence Type */}
          <div className="space-y-4">
            <label className="flex items-center text-sm font-semibold text-gray-700">
              🔄 Task Recurrence
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { value: 'one-time', label: '📅 One-time', desc: 'Complete once' },
                { value: 'daily', label: '🔄 Daily', desc: 'Repeat every day' },
                { value: 'custom', label: '🗓️ Custom', desc: 'Select specific days' }
              ].map(option => (
                <label key={option.value} className="cursor-pointer">
                  <input
                    type="radio"
                    name="recurrenceType"
                    value={option.value}
                    checked={form.recurrenceType === option.value}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className={`p-4 border-2 rounded-lg transition-all duration-200 ${
                    form.recurrenceType === option.value
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}>
                    <div className="font-medium text-gray-900">{option.label}</div>
                    <div className="text-sm text-gray-500">{option.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Custom Days Selection */}
          {form.recurrenceType === 'custom' && (
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700">
                Select Days of the Week:
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {weekDays.map(day => (
                  <label key={day.value} className="cursor-pointer">
                    <input
                      type="checkbox"
                      name="customDays"
                      value={day.value}
                      checked={form.customDays.includes(day.value)}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className={`p-3 text-center border-2 rounded-lg transition-all duration-200 ${
                      form.customDays.includes(day.value)
                        ? 'border-green-500 bg-green-50 text-green-800'
                        : 'border-gray-200 hover:border-green-300'
                    }`}>
                      <div className="font-medium text-sm">{day.label}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Meeting Link */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-semibold text-gray-700">
              🔗 Meeting Link (Optional)
            </label>
            <input
              name="meetingLink"
              value={form.meetingLink}
              onChange={handleChange}
              placeholder="https://zoom.us/meeting/..."
              type="url"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-semibold text-gray-700">
              🖼️ Attach Image (Optional)
            </label>
            <input
              name="imageFile"
              type="file"
              accept="image/*"
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors duration-200"
            />
            {imagePreview && (
              <div className="mt-3">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="w-20 h-20 object-cover rounded-lg border-2 border-gray-200 shadow-sm" 
                />
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onDone}
              className="px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
            >
              Cancel
            </button>
            <Button 
              type="submit" 
              isLoading={loading}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              {initialData ? '💾 Update Task' : '🚀 Create Task'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
