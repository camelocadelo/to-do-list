import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { fetchCalendarData, fetchTasksForDate } from 'services/api';
import TaskList from 'components/TaskList/TaskList'
import TaskForm from 'components/TaskForm/TaskForm';
import './CalendarStyles.css';

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
      <div className='counter-container'>
        <div className='counter'>
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
        <div className='task-container'>
          <h3>Tasks for {formattedActiveDate}</h3>
          <TaskForm selectedDate={activeDate} fetchTasks={fetchTasks} refreshTaskCounts={refreshTaskCounts} />
          <TaskList tasks={tasks} fetchTasks={fetchTasks} refreshTaskCounts={refreshTaskCounts} setTasks={setTasks} />
        </div>
      )}
    </div>
  );
};

export default CalendarComponent;