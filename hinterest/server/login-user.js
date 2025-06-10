const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./user');

// Replace with your actual MongoDB connection string:
const uri = "mongodb+srv://hinterest1:M1DxqiRIpYyt4KLJ@hinterest-cluster.5eafkyj.mongodb.net/?retryWrites=true&w=majority&appName=hinterest-cluster";

// Connect to MongoDB
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
    return loginUser("test@example.com", "mySecurePassword123"); // Try correct password
    // return loginUser("test@example.com", "wrongPassword");     // Try incorrect password
  })
  .then(() => {
    mongoose.disconnect();
  })
  .catch((err) => {
    console.error("❌ Error:", err);
    mongoose.disconnect();
  });

async function loginUser(email, password) {
  const user = await User.findOne({ email });

  if (!user) {
    console.log("❌ User not found");
    return;
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);

  if (isMatch) {
    console.log("✅ Login successful!");
  } else {
    console.log("❌ Incorrect password");
  }
}
