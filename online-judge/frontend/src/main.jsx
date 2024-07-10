import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import App from './App';
import Home from './home'; // Ensure you have a Home component
import Problems from './problems';
import Update_Problems from './update_problem';
import Create_Problems from './create_problem';
import View_Problem from './view_problem';
import Navbar from './navbar';
import { UserProvider } from './UserContext'; // Import UserProvider
import Submissions from "./submissions";
import SubmissionDetail from './view_submission';
import './index.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const MainLayout = () => {
  const location = useLocation();
  const hideNavbarRoutes = ['/'];

  return (
    <>
      {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/home" element={<Problems />} />
        <Route path="/problem" element={<Problems />} />
        <Route path="/create_problem" element={<Create_Problems />} />
        <Route path="/update_problem/:id" element={<Update_Problems />} />
        <Route path="/view_problem/:id" element={<View_Problem />} />
        <Route path='/submissions' element={<Submissions />} />
        <Route path="/submission/:id" element={<SubmissionDetail />} />
      </Routes>
    </>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserProvider>
      <Router>
        <MainLayout />
      </Router>
    </UserProvider>
  </React.StrictMode>
);
