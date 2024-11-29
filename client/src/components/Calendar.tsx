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
  
  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchCalendarData();
      setTaskCounts(data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!activeDate) return;

    const fetchTasks = async () => {
      const formattedDate = formatDateToLocalString(activeDate)
      const data = await fetchTasksForDate(formattedDate);
      setTasks(data);
    };
    fetchTasks();
  }, [activeDate]);

  const formatDateToLocalString = (date: Date): string => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };
  
  const formattedActiveDate = activeDate ? formatDateToLocalString(activeDate) : '';

  const formatDateTile = ({ date }: { date: Date }) => {
    const formattedDate = formatDateToLocalString(date);
    const count = taskCounts[formattedDate] || 0;
    return count > 0 ? <span>{count}</span> : null;
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
        <TaskList tasks={tasks} />
        <TaskForm selectedDate={activeDate} />
      </div>
    )}
    </div>
  );
};

export default CalendarComponent;