import Session from "../models/Session.js";

export async function findActiveSession(code) {
  const normalized = String(code ?? "").trim();

  if (!/^\d{6}$/.test(normalized)) {
    return null;
  }

  return Session.findOne({
    code: normalized,
    expiresAt: { $gt: new Date() },
  });
}

export const SECTION_NOT_FOUND = "Section not found";
