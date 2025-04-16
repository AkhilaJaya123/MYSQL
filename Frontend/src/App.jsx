import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import FacultyDashboard from "./components/FacultyDashboard";
import StudentDashboard from "./components/StudentDashboard";
import "./style.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/faculty" element={<FacultyDashboard />} />
        <Route path="/student" element={<StudentDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
