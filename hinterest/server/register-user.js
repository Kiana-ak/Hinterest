const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./user');

// MongoDB connection string:
const uri = "mongodb+srv://hinterest1:M1DxqiRIpYyt4KLJ@hinterest-cluster.5eafkyj.mongodb.net/?retryWrites=true&w=majority&appName=hinterest-cluster";

// Connect to MongoDB
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
    return registerUser("test@example.com", "mySecurePassword123");
  })
  .then(() => {
    console.log("✅ User registered!");
    mongoose.disconnect();
  })
  .catch((err) => {
    console.error("❌ Error:", err);
    mongoose.disconnect();
  });

// Function to register a user
async function registerUser(email, password) {
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    email,
    passwordHash
  });

  await user.save();
}
