import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import Home from './home.jsx'; // Ensure you have a Home component
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import Problems from './problems.jsx';
import Update_Problems from './update_problem.jsx';
import Create_Problems from './create_problem.jsx';
import View_Problem from './view_problem.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/home" element={<Problems />} />
        <Route path="/problem" element={<Problems />} />
        <Route path="/create_problem" element={<Create_Problems />} />
        <Route path="/update_problem/:id" element={<Update_Problems />} />
        <Route path="/view_problem/:id" element={<View_Problem />} />
      </Routes>
    </Router>
  </React.StrictMode>,
);
