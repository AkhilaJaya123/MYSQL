import React, { useEffect, useState } from "react";
import axios from "axios";
import "./StudentDashboard.css";

function StudentDashboard() {
  const [marks, setMarks] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMarks = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/view-marks", {
          params: { usn: "01fe22bcs190" }, // Replace with dynamic USN based on logged-in user
        });
        setMarks(response.data);
      } catch (err) {
        setError("Error fetching marks. Please try again.");
      }
    };
    fetchMarks();
  }, []);

  return (
    <div>
      <h1>Student Dashboard</h1>
      <h2>Your Marks</h2>
      {error && <p className="error">{error}</p>}
      <ul>
        {marks.map((mark, index) => (
          <li key={index}>
            {mark.subject}: {mark.marks}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default StudentDashboard;
