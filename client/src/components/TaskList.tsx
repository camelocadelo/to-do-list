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
  refreshTaskCounts: () => Promise<void>; // Callback to refresh task counts
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>; // Pass down state updater
}

const TaskList: React.FC<TaskListProps> = ({ tasks, setTasks,  fetchTasks, refreshTaskCounts }) => {
  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(id);
        alert('Task deleted successfully!');
        await fetchTasks(); // Fetch tasks again
        await refreshTaskCounts(); // Refresh task counts for the calendar
      } catch (error) {
        console.error('Error deleting task:', error);
        alert('Failed to delete the task. Please try again.');
      }
    }
  };

  const handleToggleComplete = (id: number) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };
  return (
    <ul>
    {tasks.map((task) => (
      <li key={task.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => handleToggleComplete(task.id)}
        />
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