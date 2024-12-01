import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { fetchCalendarData, fetchTasksForDate } from './../services/api';
import TaskList from './TaskList'; // Component to display tasks
import TaskForm from './TaskForm'; 

const CalendarComponent: React.FC = () => {
  const [taskCounts, setTaskCounts] = useState<{ [key: string]: number }>({});
  const [activeDate, setActiveDate] = useState<Date | null>(null);
  const [tasks, setTasks] = useState<any[]>([]); // Replace `any` with your task type
  
  // Fetch calendar task counts
  const refreshTaskCounts = async () => {
    const data = await fetchCalendarData();
    setTaskCounts(data);
  };

  useEffect(() => {
    refreshTaskCounts(); // Initial fetch for task counts
  }, []);

  const fetchTasks = async () => {
    if (!activeDate) return;

    const formattedDate = formatDateToLocalString(activeDate);
    const data = await fetchTasksForDate(formattedDate);
    setTasks(data);
  };

  useEffect(() => {
    fetchTasks();
  }, [activeDate]);


  const formatDateToLocalString = (date: Date): string => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };
  
  const formattedActiveDate = activeDate ? formatDateToLocalString(activeDate) : '';

  const formatDateTile = ({ date }: { date: Date }) => {
    const formattedDate = formatDateToLocalString(date);
    const count = taskCounts[formattedDate] || 0;
  
    return count > 0 ? (
      <div style={{ position: 'relative', height: '100%', width: '100%' }}>
        <div
          style={{
            position: 'absolute',
            bottom: '5px', // Moves the circle further down
            right: '-5px', // Moves the circle further to the right
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            backgroundColor: 'rgba(224, 247, 250, 0.8)', // Light blue with transparency
            color: '#006064', // Darker text color for contrast
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            fontWeight: 'bold',
          }}
        >
          {count}
        </div>
      </div>
    ) : null;
  };

  const handleDateClick = (date: Date) => {
    // Set activeDate without timezone issues
    setActiveDate(new Date(date.getFullYear(), date.getMonth(), date.getDate()));
  };
  

  return (
    <div>
        <Calendar
      tileContent={formatDateTile}
      onClickDay={handleDateClick} // Set the active date
    />
    {activeDate && (
      <div style={{ marginTop: '20px' }}>
        <h3>Tasks for {formattedActiveDate}</h3>
        <TaskList tasks={tasks} fetchTasks={fetchTasks} refreshTaskCounts={refreshTaskCounts} />
        <TaskForm selectedDate={activeDate} fetchTasks={fetchTasks} refreshTaskCounts={refreshTaskCounts} />
      </div>
    )}
    </div>
  );
};

export default CalendarComponent;