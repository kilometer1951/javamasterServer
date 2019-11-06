module.exports = (app, io) => {
  io.on("connection", function(socket) {
    console.log("user connected");
    socket.on("newOrder", function(msg) {
      io.emit("newOrder", msg);
    });

    socket.on("disconnect", function() {
      console.log("user disconnected");
    });
  });
};
