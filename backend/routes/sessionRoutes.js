import Session from "../models/Session.js";
import { Router } from "express";
import { findActiveSession, SECTION_NOT_FOUND } from "../utils/sessionHelpers.js";

const router = Router();

function generateCode() {
  return Math.floor(
    100000 + Math.random() * 900000
  ).toString();
}

router.post("/join", async (req, res) => {
  try {
    const session = await findActiveSession(req.body?.code);

    if (!session) {
      return res.status(404).json({ message: SECTION_NOT_FOUND });
    }

    res.json({
      code: session.code,
      message: "Section found",
    });
  } catch (error) {
    console.error("Join session error:", error);
    res.status(500).json({ message: "Failed to join section" });
  }
});

router.get("/:code", async (req, res) => {
  try {
    const session = await findActiveSession(req.params.code);

    if (!session) {
      return res.status(404).json({ message: SECTION_NOT_FOUND });
    }

    res.json(session);
  } catch (error) {
    console.error("Get session error:", error);
    res.status(500).json({ message: "Failed to fetch session" });
  }
});

router.post("/create", async (req, res) => {
  try {
    const code = generateCode();

    const session = await Session.create({
      code,
      expiresAt: new Date(
        Date.now() + 10 * 60 * 1000
      )
    });

    res.json(session);
  } catch (error) {
    console.error("Create session error:", error);
    res.status(500).json({ message: "Failed to create section" });
  }
});

export default router;
