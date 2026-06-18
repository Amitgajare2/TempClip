import Session from "../models/Session.js";

export default (io) => {

  io.on("connection", (socket) => {

    console.log("User Connected");

    // STEP 6
    socket.on("join-session", async (code) => {

      // Save room code on socket
      socket.sessionCode = code;

      const session = await Session.findOne({ code });

      if (!session) {
        socket.emit("error-message", "Session not found");
        return;
      }

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


  // STEP 7
  socket.on(
    "clipboard-change",
    async ({ code, data }) => {

      await Session.updateOne(
        { code },
        { clipboardData: data }
      );

      socket
        .to(code)
        .emit("clipboard-update", data);
    }
  );


  // STEP 8
  socket.on("disconnect", async () => {

    if (!socket.sessionCode) return;

    await Session.updateOne(
      { code: socket.sessionCode },
      { $inc: { usersOnline: -1 } }
    );

    const updated = await Session.findOne({
      code: socket.sessionCode
    });

    if (updated) {
      io.to(socket.sessionCode).emit(
        "online-users",
        updated.usersOnline
      );
    }

  });

});

};