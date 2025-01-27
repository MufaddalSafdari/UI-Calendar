import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
// import App from './App';
// import Calendar from './Calendar';
// import DayCal from './OldDayCal';
import CalendarWithBeautifiedStyles from './CalendarWithBeautifiedStyles';
import reportWebVitals from './reportWebVitals';
// import './styles.css'; // Import your CSS file here
import './CalendarWithBeautifiedStyles.css'; // Import your CSS file here
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* <App /> */}
    {/* <Calendar /> */}
    {/* <DayCal /> */}
    <CalendarWithBeautifiedStyles />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
