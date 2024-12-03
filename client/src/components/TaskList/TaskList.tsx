import React from 'react';
import { deleteTask } from 'services/api';
import { toast } from 'react-toastify';
import './TaskListStyles.css'

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
    try {
      await deleteTask(id);
      toast.success('Task deleted successfully!');
      await fetchTasks()
      await refreshTaskCounts()
    } catch (error) {
      toast.error('Failed to delete task!');
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
    <ul className="taskList">
    {tasks.map((task) => (
      <li
        key={task.id}
        // style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}
        className="taskListItem"
        >
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