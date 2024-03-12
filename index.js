const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const bcrypt = require("bcrypt");

const saltRounds = 10; // Add a salt rounds value for bcrypt

// Middleware
app.use(cors());
app.use(express.json()); // Allows us to access req.body

// Create a sign-up route with POST method
app.post("/lmsusers/signup", async (req, res) => {
  try {
    console.log(req.body);
    const {  name, mobile, emailid, password,  } = req.body;
    // Hash the password before saving to the database
    // const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await pool.query(
      "INSERT INTO lmsusers ( name, mobile, emailid, password) VALUES ($1, $2, $3, $4) RETURNING *",
      [ name, mobile, emailid, password ]
    );
    res.json(newUser.rows[0]); // Return the newly created user
  } catch (err) {
    console.error(err.message);
  }
});



//get signup
app.get("/lmsusers/signup", async (req, res) => {
  try {
    const { user_id, name, emailid, password, mobile } = req.body;
    // Hash the password before saving to the database
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await pool.query(
      "SELECT * FROM lmsuser WHERE emailid = $1",
      [user_id, name, emailid, hashedPassword, mobile]
    );
    res.json(newUser.rows[0]); // Return the newly created user
  } catch (err) {
    console.error(err.message);
  }
});

// Login route
app.get("/lmsuser/login", async (req, res) => {
  const { emailid, password } = req.body;

  try {
    // Find the user by email
    const query = "SELECT * FROM lmsuser WHERE emailid = $1";
    const { rows } = await pool.query(query, [emailid]);

    if (rows.length === 0) {
      return res.status(404).send("User not found.");
    }

    const user = rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      // Passwords match
      // Proceed with login logic (e.g., generating a token or session)
      res.send("Login successful.");
    } else {
      // Passwords don't match
      res.status(401).send("Invalid email or password.");
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error.");
  }
});

app.listen(8000, () => {
  console.log("Server has started on port 8000");
});
