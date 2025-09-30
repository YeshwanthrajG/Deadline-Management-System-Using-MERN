import React, { useState, useEffect } from 'react';
import { useTasks } from '../../context/TaskContext';
import Button from '../common/Button';
import { toast } from 'react-hot-toast';
import { formatInTimeZone } from 'date-fns-tz';
import { 
  XMarkIcon,
  DocumentTextIcon,
  ClockIcon,
  FlagIcon,
  LinkIcon,
  PhotoIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

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
    { value: 'monday', label: 'Mon' },
    { value: 'tuesday', label: 'Tue' },
    { value: 'wednesday', label: 'Wed' },
    { value: 'thursday', label: 'Thu' },
    { value: 'friday', label: 'Fri' },
    { value: 'saturday', label: 'Sat' },
    { value: 'sunday', label: 'Sun' }
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <DocumentTextIcon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white">
                {initialData ? 'Edit Task' : 'Create New Task'}
              </h3>
            </div>
            <button
              type="button"
              onClick={onDone}
              className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-lg transition-all duration-200"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-88px)]">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Title */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-200 mb-2">
                <DocumentTextIcon className="w-4 h-4 mr-2" />
                Task Title
              </label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                placeholder="Enter a descriptive title..."
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Description */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-200 mb-2">
                <DocumentTextIcon className="w-4 h-4 mr-2" />
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                placeholder="Describe your task in detail..."
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                rows={3}
              />
            </div>

            {/* Priority, Due Date, Status Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Priority */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-200 mb-2">
                  <FlagIcon className="w-4 h-4 mr-2" />
                  Priority
                </label>
                <select
                  name="priority"
                  value={form.priority}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                >
                  <option value="low">🟢 Low</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="high">🔴 High</option>
                </select>
              </div>

              {/* Due Date */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-200 mb-2">
                  <ClockIcon className="w-4 h-4 mr-2" />
                  Due Date
                </label>
                <input
                  name="dueDate"
                  value={form.dueDate}
                  onChange={handleChange}
                  type="datetime-local"
                  required
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Status */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-200 mb-2">
                  <ArrowPathIcon className="w-4 h-4 mr-2" />
                  Status
                </label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                >
                  <option value="pending">🟠 Pending</option>
                  <option value="in-progress">🔵 In Progress</option>
                  <option value="completed">✅ Completed</option>
                </select>
              </div>
            </div>

            {/* Recurrence Type */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-200 mb-3">
                <ArrowPathIcon className="w-4 h-4 mr-2" />
                Task Recurrence
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { value: 'one-time', label: '📅 One-time', desc: 'Complete once' },
                  { value: 'daily', label: '🔄 Daily', desc: 'Repeat daily' },
                  { value: 'custom', label: '🗓️ Custom', desc: 'Specific days' }
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
                    <div className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                      form.recurrenceType === option.value
                        ? 'border-indigo-500 bg-indigo-500/20 text-white'
                        : 'border-slate-600 bg-slate-700/30 text-gray-300 hover:border-slate-500 hover:bg-slate-700/50'
                    }`}>
                      <div className="font-medium">{option.label}</div>
                      <div className="text-sm text-gray-400 mt-1">{option.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Custom Days Selection */}
            {form.recurrenceType === 'custom' && (
              <div>
                <label className="text-sm font-medium text-gray-200 mb-3 block">
                  Select Days of the Week:
                </label>
                <div className="grid grid-cols-7 gap-2">
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
                      <div className={`p-3 text-center rounded-lg border-2 transition-all duration-200 ${
                        form.customDays.includes(day.value)
                          ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400'
                          : 'border-slate-600 bg-slate-700/30 text-gray-400 hover:border-slate-500'
                      }`}>
                        <div className="font-medium text-sm">{day.label}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Meeting Link */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-200 mb-2">
                <LinkIcon className="w-4 h-4 mr-2" />
                Meeting Link (Optional)
              </label>
              <input
                name="meetingLink"
                value={form.meetingLink}
                onChange={handleChange}
                placeholder="https://zoom.us/meeting/..."
                type="url"
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-200 mb-2">
                <PhotoIcon className="w-4 h-4 mr-2" />
                Attach Image (Optional)
              </label>
              <input
                name="imageFile"
                type="file"
                accept="image/*"
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 border-dashed rounded-xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-indigo-500 file:text-white hover:file:bg-indigo-600 transition-all"
              />
              {imagePreview && (
                <div className="mt-3">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-20 h-20 object-cover rounded-lg border-2 border-slate-600 shadow-lg" 
                  />
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-slate-700">
              <button
                type="button"
                onClick={onDone}
                className="px-6 py-3 text-sm font-medium text-gray-300 bg-slate-700 hover:bg-slate-600 rounded-lg transition-all duration-200"
              >
                Cancel
              </button>
              <Button 
                type="submit" 
                isLoading={loading}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                {initialData ? '💾 Update Task' : '🚀 Create Task'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskForm;
