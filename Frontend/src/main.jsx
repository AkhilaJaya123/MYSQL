import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";  // Add the required imports
import LoginPage from "./components/LoginPage";
import FacultyDashboard from "./components/FacultyDashboard";
import StudentDashboard from "./components/StudentDashboard";
import "./style.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter> {/* Wrap the app with BrowserRouter for routing */}
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/faculty" element={<FacultyDashboard />} />
        <Route path="/student" element={<StudentDashboard />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
