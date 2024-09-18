const mongoose = require("mongoose");
const config = require("./env/" + (process.env.NODE_ENV || "development"));

mongoose
  .connect(config.mongoURI, {
    useUnifiedTopology: true,
    useNewUrlParser: true, // Add this option
    useCreateIndex: true, // Use createIndexes for indexing
  })
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

module.exports = mongoose;
