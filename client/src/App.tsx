import React from 'react';
import CalendarComponent from './components/Calendar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import default styles

const App = () => {
  return (<div>
      <h1>To-Do Calendar</h1>
      <ToastContainer position="top-right" autoClose={3000} />
      <CalendarComponent />
      {/* Other components */}
    </div>
)};

export default App;
