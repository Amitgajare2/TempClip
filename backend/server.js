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


const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("DB Connected"))
  .catch((err) => console.log(err));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Socket
setupSocket(io);

// Cleanup
Cleanup();


app.get("/", (req, res) => {
  res.send("Server Running");
});

app.use("/api/session", sessionRoutes);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});