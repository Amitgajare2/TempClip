import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import Cleanup from "./utils/cleanup.js";

import sessionRoutes from "./routes/sessionRoutes.js";
import setupSocket from "./sockets/socket.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

setupSocket(io);
Cleanup();

app.get("/", (req, res) => {
  res.send("Server Running");
});

app.use("/api/session", sessionRoutes);

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("DB Connected");
  } catch (err) {
    console.error("DB connection failed:", err);
    process.exit(1);
  }

  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
