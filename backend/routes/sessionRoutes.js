import express from "express";
import Session from "../models/Session.js";
import { Router } from "express";

const router = Router();

function generateCode() {
  return Math.floor(
    100000 + Math.random() * 900000
  ).toString();
}

router.get("/:code", async (req, res) => {
  try {
    const session = await Session.findOne({ code: req.params.code });

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    res.json(session);
  } catch (error) {
    console.error("Get session error:", error);
    res.status(500).json({ message: "Failed to fetch session" });
  }
});

router.post("/create", async (req, res) => {

  const code = generateCode();

  const session = await Session.create({
    code,
    expiresAt: new Date(
      Date.now() + 10 * 60 * 1000
    )
  });

  res.json(session);
});

export default router;