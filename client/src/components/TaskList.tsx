import React from 'react';
import { deleteTask } from '../services/api';


interface Task {
  id: number;
  title: string;
  completed: boolean;
}

interface TaskListProps {
  tasks: Task[];
  fetchTasks: () => Promise<void>; // Fetch tasks callback
}

const TaskList: React.FC<TaskListProps> = ({ tasks, fetchTasks }) => {
  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(id);
        alert('Task deleted successfully!');
        await fetchTasks(); // Fetch tasks again
      } catch (error) {
        console.error('Error deleting task:', error);
        alert('Failed to delete the task. Please try again.');
      }
    }
  };
  return (
    <ul>
    {tasks.map((task) => (
      <li key={task.id}>
        <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
          {task.title}
        </span>
        <button onClick={() => handleDelete(task.id)} style={{ marginLeft: '10px' }}>
          Delete
        </button>
      </li>
    ))}
  </ul>
  );
};

export default TaskList;