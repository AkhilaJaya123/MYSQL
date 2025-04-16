import React, { useState } from "react";
import axios from "axios";
import "./FacultyDashboard.css";

function FacultyDashboard() {
  const [marks, setMarks] = useState([]);
  const [newMark, setNewMark] = useState({ student_usn: "", subject: "", marks: "" });
  const [updateMark, setUpdateMark] = useState({ student_usn: "", subject: "", marks: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleUpload = async () => {
    if (!newMark.student_usn || !newMark.subject || !newMark.marks) {
      setError("All fields are required for uploading marks");
      return;
    }

    try {
      await axios.post("http://localhost:8000/api/upload-marks", newMark);
      setMarks([...marks, newMark]);
      setNewMark({ student_usn: "", subject: "", marks: "" });
      setError("");
      setSuccess("Marks uploaded successfully");
    } catch (err) {
      setError("Error uploading marks. Please try again.");
      setSuccess("");
    }
  };

  const handleUpdate = async () => {
    if (!updateMark.student_usn || !updateMark.subject || !updateMark.marks) {
      setError("All fields are required for updating marks");
      return;
    }

    try {
      const response = await axios.put("http://localhost:8000/api/update-marks", updateMark);
      setMarks((prevMarks) =>
        prevMarks.map((mark) =>
          mark.student_usn === updateMark.student_usn && mark.subject === updateMark.subject
            ? { ...mark, marks: updateMark.marks }
            : mark
        )
      );
      setUpdateMark({ student_usn: "", subject: "", marks: "" });
      setError("");
      setSuccess(response.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Error updating marks. Please try again.");
      setSuccess("");
    }
  };

  return (
    <div className="faculty-dashboard">
      <h1>Faculty Dashboard</h1>

      {/* Upload Marks Section */}
      <div className="upload-section">
        <h2>Upload Marks</h2>
        <input
          type="text"
          placeholder="Student USN"
          value={newMark.student_usn}
          onChange={(e) => setNewMark({ ...newMark, student_usn: e.target.value })}
        />
        <input
          type="text"
          placeholder="Subject"
          value={newMark.subject}
          onChange={(e) => setNewMark({ ...newMark, subject: e.target.value })}
        />
        <input
          type="number"
          placeholder="Marks"
          value={newMark.marks}
          onChange={(e) => setNewMark({ ...newMark, marks: e.target.value })}
        />
        <button onClick={handleUpload}>Upload Marks</button>
      </div>

      {/* Update Marks Section */}
      <div className="update-section">
        <h2>Update Marks</h2>
        <input
          type="text"
          placeholder="Student USN"
          value={updateMark.student_usn}
          onChange={(e) => setUpdateMark({ ...updateMark, student_usn: e.target.value })}
        />
        <input
          type="text"
          placeholder="Subject"
          value={updateMark.subject}
          onChange={(e) => setUpdateMark({ ...updateMark, subject: e.target.value })}
        />
        <input
          type="number"
          placeholder="New Marks"
          value={updateMark.marks}
          onChange={(e) => setUpdateMark({ ...updateMark, marks: e.target.value })}
        />
        <button onClick={handleUpdate}>Update Marks</button>
      </div>

      {/* Display Errors or Success Messages */}
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

      {/* Display Marks in Table */}
      <div className="marks-section">
        <h2>Uploaded Marks</h2>
        {marks.length > 0 ? (
          <table className="marks-table">
            <thead>
              <tr>
                <th>Student USN</th>
                <th>Subject</th>
                <th>Marks</th>
              </tr>
            </thead>
            <tbody>
              {marks.map((mark, index) => (
                <tr key={index}>
                  <td>{mark.student_usn}</td>
                  <td>{mark.subject}</td>
                  <td>{mark.marks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No marks uploaded yet.</p>
        )}
      </div>
    </div>
  );
}

export default FacultyDashboard;
