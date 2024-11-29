import React, { useState } from 'react';
import { addTask } from '../services/api';

interface TaskFormProps {
  selectedDate: Date;
}

const TaskForm: React.FC<TaskFormProps> = ({ selectedDate }) => {
  const [title, setTitle] = useState('');

  // Format date to 'YYYY-MM-DD' in local time
  const formatDateToLocalString = (date: Date): string => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Task title is required!');
      return;
    }

    const formattedDate = formatDateToLocalString(selectedDate); // Correctly formatted date
    await addTask({ title, date: formattedDate }); // Send task with correct date
    setTitle(''); // Clear input after submission
    alert('Task added successfully!');
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