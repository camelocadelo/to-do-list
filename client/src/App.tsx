import React from 'react';
import CalendarComponent from 'components/Calendar/Calendar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import default styles
import './App.css'

const App = () => {
  return (<div className="appContainer">
      <h1>To-Do Calendar</h1>
      <ToastContainer position="top-right" autoClose={3000} />
      <CalendarComponent />
    </div>
)};

export default App;
