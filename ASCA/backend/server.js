require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'anti_scam_call_db'
});

db.connect(err => {
    if (err) throw err;
    console.log('Connected to MariaDB');
});

// Login route
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const query = 'SELECT * FROM users WHERE username = ?';

    db.query(query, [username], async (err, results) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ message: 'Database error', error: err });
        }
        if (results.length === 0) {
            console.warn("User not found:", username);
            return res.status(401).json({ message: 'User not found' });
        }

        const user = results[0];
        console.log("User found:", user);

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.warn("Invalid password for user:", username);
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id, username: user.username }, 'your_jwt_secret', { expiresIn: '1h' });
        res.json({ token });
    });
});
// Registration route
app.post("/register", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    // Check if user already exists
    db.query("SELECT * FROM users WHERE username = ?", [username], async (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Database error" });
        }

        if (results.length > 0) {
            return res.status(400).json({ message: "Username already exists" });
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Insert new user
        db.query("INSERT INTO users (username, password) VALUES (?, ?)", [username, hashedPassword], (err) => {
            if (err) {
                console.error("Database insert error:", err);
                return res.status(500).json({ message: "Database error" });
            }
            res.status(201).json({ message: "User registered successfully" });
        });
    });
});


// Start server
app.listen(5000, () => console.log('Server running on port 5000'));
