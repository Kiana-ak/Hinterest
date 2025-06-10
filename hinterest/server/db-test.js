const mongoose = require('mongoose');

// Replace <your-cluster-url> with your real cluster info
const uri = "mongodb+srv://hinterest1:M1DxqiRIpYyt4KLJ@hinterest-cluster.5eafkyj.mongodb.net/?retryWrites=true&w=majority&appName=hinterest-cluster";

// Connect to MongoDB
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("✅ Connected to MongoDB Atlas");
    mongoose.disconnect();
  })
  .catch((err) => {
    console.error("❌ Connection error:", err);
  });
