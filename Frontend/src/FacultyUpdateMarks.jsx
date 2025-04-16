import React, { useState } from "react";
import axios from "axios";

function FacultyUpdateMarks() {
  const [data, setData] = useState({
    student_usn: "",
    subject: "",
    marks: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleUpdate = async () => {
    if (!data.student_usn || !data.subject || !data.marks) {
      setError("All fields are required");
      return;
    }

    try {
      const response = await axios.put("http://localhost:8000/api/update-marks", data);
      setMessage(response.data);
      setError("");
    } catch (err) {
      setError("Error updating marks. Please try again.");
    }
  };

  return (
    <div>
      <h2>Update Marks</h2>
      <input
        type="text"
        placeholder="Student USN"
        onChange={(e) => setData({ ...data, student_usn: e.target.value })}
      />
      <input
        type="text"
        placeholder="Subject"
        onChange={(e) => setData({ ...data, subject: e.target.value })}
      />
      <input
        type="number"
        placeholder="Marks"
        onChange={(e) => setData({ ...data, marks: e.target.value })}
      />
      <button onClick={handleUpdate}>Update Marks</button>
      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default FacultyUpdateMarks;
