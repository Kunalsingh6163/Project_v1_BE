const express = require("express");
const app = express();
const cors = require("cors");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const multer = require("multer")
const upload = multer({ storage: "./public" })
const fs = require("fs")


const saltRounds = 10;

app.use(cors());
app.use(express.json());

mongoose
  .connect("mongodb://localhost:27017/CRUD")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

const Schema = new mongoose.Schema({
  name: String,
  mobile: Number,
  emailid: String,
  password: String,
  image: {
    data: Buffer,
    contentType: String,
    required:true
}
});

const UserModel = mongoose.model("User", Schema);

// Sign-up post
app.post("/lmsusers/signup", async (req, res) => {
  try {
    console.log(req.body);
    const { name, mobile, emailid, password } = req.body;

    const newUser = new UserModel({
      name,
      mobile,
      emailid,
      password,
    });

    await newUser.save();
    res.json(newUser);
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});
// Signup get method
app.get("/lmsusers/signup", async (req, res) => {
  try {
    const { emailid, password } = req.query;

    const users = await UserModel.find({ emailid, password });

    if (!users || users.length === 0) {
      return res.status(401).send("User does not exist");
    } else {
      res.status(200).json({ message: "Users found.", users });
    }
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

//  //login api with post method

app.post("/lmsusers/login", async (req, res) => {
  const { emailid, password } = req.body;

  try {
    // Check if user exists in the database
    const user = await UserModel.findOne({ emailid, password });

    if (user) {
      res.status(200).json({ message: "Login successful" });
    } else {
      res.status(404).json({ message: "User does not exist" });
    }
  } catch (error) {
    console.error("Error executing query", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Login get
app.get("/lmsusers/login", async (req, res) => {
  const { emailid } = req.query;

  try {
    const users = await UserModel.find({ emailid });
    if (users.length === 0) {
      return res.status(404).send("User not found.");
    }
    res.send("Login successful.");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error.");
  }
});

// image upload route
app.post("/lmsusers/courseenrollmentpayment", upload.single('image'), async (req, res, next) => {
  try {
      // Read the uploaded file
      const imagePath = req.file.path;
      const imageBuffer = fs.readFileSync(imagePath);

      // Create a new document
      const newDocument = new UserModel({
          // Add the uploaded image to the image field
          image: {
              data: imageBuffer,
              contentType: req.file.mimetype
          }
      });

      // Save the document to MongoDB
      await newDocument.save();

      res.status(200).send("Image uploaded successfully!");
  } catch (error) {
      console.error(error);
      res.status(500).send("Error uploading image.");
  }
}); 
app.listen(8000, () => {
  console.log("Server has started on port 8000");
});
