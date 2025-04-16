import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function LoginPage() {
  const [user, setUser] = useState({ username: "", password: "", role: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!user.username || !user.password || !user.role) {
      setError("All fields are required");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/api/login", user);
      if (response.data.role === "faculty") {
        navigate("/faculty");
      } else if (response.data.role === "student") {
        navigate("/student");
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError("Invalid credentials");
      } else {
        setError("Server error. Please try again later.");
      }
    }
  };

  return (
    <div className="login-container">
      <h1>Internal Assessment Portal</h1>
      <input
        type="text"
        placeholder="Username"
        onChange={(e) => setUser({ ...user, username: e.target.value })}
      />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setUser({ ...user, password: e.target.value })}
      />
      <select onChange={(e) => setUser({ ...user, role: e.target.value })}>
        <option value="">Select Role</option>
        <option value="faculty">Faculty</option>
        <option value="student">Student</option>
      </select>
      <button onClick={handleLogin}>Login</button>
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default LoginPage;
