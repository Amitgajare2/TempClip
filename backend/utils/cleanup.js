import Session from "../models/Session.js";

export default function Cleanup() {
  setInterval(async () => {
    try {
      const result = await Session.deleteMany({
        expiresAt: { $lt: new Date() }
      });

      if (result.deletedCount > 0) {
        console.log(
          `${result.deletedCount} expired sessions deleted`
        );
      }
    } catch (error) {
      console.error("Cleanup Error:", error);
    }
  }, 60000);
}