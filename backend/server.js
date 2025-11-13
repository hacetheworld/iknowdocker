import express from "express";
import dotenv from "dotenv";
dotenv.config();
import "./db.js";
const app = express();

const PORT = process.env.PORT;

app.use(express.json());

app.get("/api", (req, res) => {
  res.send("API HEALTH IS GOOODDDDDD...");
});

app.listen(PORT, () => {
  console.log(`Server is running on the port: ${PORT}`);
});
