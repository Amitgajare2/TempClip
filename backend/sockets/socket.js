import Session from "../models/Session.js";
import { findActiveSession, SECTION_NOT_FOUND } from "../utils/sessionHelpers.js";

async function decrementUsers(io, code) {
  await Session.updateOne(
    { code, usersOnline: { $gt: 0 } },
    { $inc: { usersOnline: -1 } }
  );

  const updated = await Session.findOne({ code });

  if (updated) {
    io.to(code).emit("online-users", updated.usersOnline);
  }
}

export default (io) => {

  io.on("connection", (socket) => {

    console.log("User Connected");

    socket.on("join-session", async (code) => {

      const session = await findActiveSession(code);

      if (!session) {
        socket.emit("error-message", SECTION_NOT_FOUND);
        return;
      }

      if (socket.sessionCode === code) {
        socket.emit("clipboard-update", session.clipboardData);
        socket.emit("online-users", session.usersOnline);
        return;
      }

      if (socket.sessionCode) {
        await decrementUsers(io, socket.sessionCode);
        socket.leave(socket.sessionCode);
      }

      socket.sessionCode = code;
      socket.join(code);

      await Session.updateOne(
        { code },
        { $inc: { usersOnline: 1 } }
      );

      const updated = await Session.findOne({ code });

      io.to(code).emit(
        "online-users",
        updated.usersOnline
      );

      socket.emit(
        "clipboard-update",
        updated.clipboardData
      );

    });

    socket.on("leave-session", async (code) => {
      if (!socket.sessionCode || socket.sessionCode !== code) return;


      socket.sessionCode = null;
      await decrementUsers(io, code);
      socket.leave(code);
    });

  socket.on(
    "clipboard-change",
    async ({ code, data }) => {

      const session = await findActiveSession(code);

      if (!session || !socket.rooms.has(code)) {
        socket.emit("error-message", SECTION_NOT_FOUND);
        return;
      }

      await Session.updateOne(
        { code },
        { clipboardData: data }
      );

      socket.to(code).emit("clipboard-update", data);
    }
  );


  socket.on("disconnect", async () => {

    if (!socket.sessionCode) return;

    const code = socket.sessionCode;
    socket.sessionCode = null;
    await decrementUsers(io, code);

  });

});

};
