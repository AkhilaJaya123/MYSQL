
const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173", // Update with your React app's URL if different
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Database connection
const con = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "",
});

con.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    process.exit(1);
  }
  console.log("Connected to MySQL");

  // Database setup
  con.query("CREATE DATABASE IF NOT EXISTS oee", (err) => {
    if (err) throw err;
    console.log("Database created or already exists.");
  });

  con.query("USE oee", (err) => {
    if (err) throw err;
    console.log("Using database: oee");
  });

  // Create tables
  const createTables = [
    `CREATE TABLE IF NOT EXISTS faculty (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(50) NOT NULL,
      department VARCHAR(50) NOT NULL,
      username VARCHAR(50) UNIQUE NOT NULL,
      password VARCHAR(50) NOT NULL,
      course VARCHAR(50)
    )`,
    `CREATE TABLE IF NOT EXISTS students (
      usn VARCHAR(20) PRIMARY KEY,
      name VARCHAR(50) NOT NULL,
      username VARCHAR(50) UNIQUE NOT NULL,
      password VARCHAR(50) NOT NULL,
      department VARCHAR(50) NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS marks (
      id INT AUTO_INCREMENT PRIMARY KEY,
      student_usn VARCHAR(20) NOT NULL,
      subject VARCHAR(50) NOT NULL,
      marks INT NOT NULL,
      FOREIGN KEY (student_usn) REFERENCES students(usn) ON DELETE CASCADE
    )`,
  ];

  createTables.forEach((query) => {
    con.query(query, (err) => {
      if (err) throw err;
      console.log("Tables are ready.");
    });
  });

  // Insert initial data
  const insertData = (query, data) => {
    data.forEach((record) => {
      con.query(query, record, (err) => {
        if (err) console.error("Error inserting data:", err);
      });
    });
  };

  insertData(
    `INSERT IGNORE INTO faculty (name, department, username, password, course) VALUES (?, ?, ?, ?, ?)`,
    [
      ["Prof. Shwetha", "Computer Science", "shwetha", "password1", "Data Structures"],
      ["Prof. Manjula", "Electrical Engineering", "manjula", "password2", "Circuit Analysis"],
      ["Prof. Sunil", "Mechanical Engineering", "sunil", "password3", "Thermodynamics"],
    ]
  );

  insertData(
    `INSERT IGNORE INTO students (usn, name, username, password, department) VALUES (?, ?, ?, ?, ?)`,
    [
      ["01fe22bcs180", "Tanuja Tondikatti", "Tanuja", "password1", "Computer Science"],
      ["01fe22bcs182", "Soujanya Menasagi", "Soujanya", "password2", "Computer Science"],
      ["01fe22bcs190", "Aditya Tondikatti", "Aditya", "password3", "Computer Science"],
      ["01fe22bcs126", "Pragati Hippalkar", "Pragati", "password4", "Computer Science"],
      ["01fe22bcs188", "Ananya Patil", "Ananya", "password5", "Computer Science"],
      ["01fe22bcs230", "Jhanavi Chinchansur", "Jhanavi", "password6", "Computer Science"],
    ]
  );

  insertData(
    `INSERT IGNORE INTO marks (student_usn, subject, marks) VALUES (?, ?, ?)`,
    [
      ["01fe22bcs180", "Web Tech", 85],
      ["01fe22bcs182", "Data Structures", 78],
      ["01fe22bcs190", "Computer Vision", 92],
      ["01fe22bcs126", "Machine learning", 85],
      ["01fe22bcs188", "Software Engineering", 85],
      ["01fe22bcs230", "Data Structures", 85],
    ]
  );
});

// API Routes

// Login route
app.post("/api/login", (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password || !role) {
    res.status(400).json({ message: "All fields are required" });
    return;
  }

  const table = role === "faculty" ? "faculty" : "students";
  const query = `SELECT * FROM ${table} WHERE username = ? AND password = ?`;

  con.query(query, [username, password], (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      res.status(500).json({ message: "Database query error" });
      return;
    }

    if (results.length === 0) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    res.status(200).json({ message: "Login successful", role });
  });
});

// Upload marks route
app.post("/api/upload-marks", (req, res) => {
  const { student_usn, subject, marks } = req.body;

  if (!student_usn || !subject || marks == null) {
    res.status(400).json({ message: "All fields are required" });
    return;
  }

  const query = `INSERT INTO marks (student_usn, subject, marks) 
                 VALUES (?, ?, ?) 
                 ON DUPLICATE KEY UPDATE marks = VALUES(marks)`;

  con.query(query, [student_usn, subject, marks], (err) => {
    if (err) {
      console.error("Error uploading marks:", err);
      res.status(500).json({ message: "Error uploading marks" });
      return;
    }
    res.status(200).json({ message: "Marks uploaded successfully" });
  });
});

// View marks route
app.get("/api/view-marks", (req, res) => {
  const { usn } = req.query;

  if (!usn) {
    res.status(400).json({ message: "USN is required" });
    return;
  }

  const query = "SELECT subject, marks FROM marks WHERE student_usn = ?";
  con.query(query, [usn], (err, results) => {
    if (err) {
      console.error("Error fetching marks:", err);
      res.status(500).json({ message: "Error fetching marks" });
      return;
    }
    res.status(200).json(results);
  });
});

// Update marks route
app.put("/api/update-marks", (req, res) => {
  const { student_usn, subject, marks } = req.body;

  // Check if all required fields are provided
  if (!student_usn || !subject || marks === undefined) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // SQL query to update marks in the 'marks' table
  const query = `
    UPDATE marks 
    SET marks = ? 
    WHERE student_usn = ? AND subject = ?
  `;

  con.query(query, [marks, student_usn, subject], (err, result) => {
    if (err) {
      console.error("Error updating marks:", err);
      return res.status(500).json({ message: "Error updating marks" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Record not found" });
    }

    res.status(200).json({ message: "Marks updated successfully" });
  });
});

// Start the server
app.listen(8000, () => {
  console.log("Server running on http://localhost:8000");
});
