import React, { useState } from 'react';
import { addTask } from '../services/api';
import { toast } from 'react-toastify';

interface TaskFormProps {
  selectedDate: Date;
  fetchTasks: () => Promise<void>; // Fetch tasks callback
  refreshTaskCounts: () => Promise<void>; // Callback to refresh task counts
}

const TaskForm: React.FC<TaskFormProps> = ({ selectedDate, fetchTasks, refreshTaskCounts }) => {
  const [title, setTitle] = useState('');

  // Format date to 'YYYY-MM-DD' in local time
  const formatDateToLocalString = (date: Date): string => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Task title is required!');
      return;
    }

    const formattedDate = formatDateToLocalString(selectedDate);
    try {
      await addTask({ title, date: formattedDate });
      setTitle('');
      toast.success('Task added successfully!');
      await fetchTasks()
      await refreshTaskCounts()
    } catch (error) {
      toast.error('Failed to add task!');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <button type="submit">Add Task</button>
    </form>
  );
};

export default TaskForm;