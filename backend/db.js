import mongoose from "mongoose";

// Use an IIFE (Immediately Invoked Function Expression) to use async/await at the top level
(async () => {
  try {
    const con = await mongoose.connect(process.env.MONGO_URI);
    console.log("Mongodb connected successfully");
    // console.log(con); // 'con' is the main mongoose object
  } catch (err) {
    console.error("Error: mongdb error");
    console.error(err);
    // Exit process if DB fails to connect
    process.exit(1);
  }
})();
