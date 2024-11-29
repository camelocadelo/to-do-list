import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000',
});

export const fetchCalendarData = async () => {
  const response = await api.get('/calendar');
  return response.data;
};

export const fetchTasksForDate = async (date: string) => {
  const response = await api.get(`/tasks?date=${date}`);
  return response.data;
};

export const addTask = async (task: { title: string; date: string }) => {
  const response = await api.post('/tasks', task);
  return response.data;
};

export const deleteTask = async (id: number) => {
  await api.delete(`/tasks/${id}`);
};