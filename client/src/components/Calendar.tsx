import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { fetchCalendarData } from './../services/api';

const CalendarComponent: React.FC = () => {
  const [taskCounts, setTaskCounts] = useState<{ [key: string]: number }>({});
  
  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchCalendarData();
      setTaskCounts(data);
    };
    fetchData();
  }, []);

  const formatDateTile = ({ date }: { date: Date }) => {
    const formattedDate = date.toISOString().split('T')[0];
    const count = taskCounts[formattedDate] || 0;
    return count > 0 ? <span>{count}</span> : null;
  };

  return (
    <Calendar
      tileContent={formatDateTile}
    />
  );
};

export default CalendarComponent;