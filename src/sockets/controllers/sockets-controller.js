import { Socket } from "socket.io";

import { JWTVerify } from "../../helpers/jwt-generator.js";
import Users from "../classes/users.js";
const users = new Users();

const socketController = (socket = new Socket(), io) => {
  // New user connection listener
  socket.on("enterChat", async (data, callback) => {
    // JWT validation
    const token = socket.handshake.headers["x-token"];
    const user = await JWTVerify(token);

    if (!user) {
      // Antes de desconectar al cliente
      io.emit("beforeDisconnect", "Authentication issues encountered!");
      socket.disconnect();
      return;
    }

    console.log(`User connected: ${user.username} - [${socket.id}]`);

    console.log(data);
    // Check message data sended from client
    if (!data.userName || !data.chatRoom) {
      return callback({
        error: true,
        message: "Hey! Seems some data neeeded",
      });
    }

    // Add the dummy user to chat room of connected user
    users.setChatRoomToDummyUser(data.chatRoom.name);

    // Join user to chat room
    socket.join(data.chatRoom.name);

    // Save user in users array (DDBB)
    users.setUser(socket.id, data.userName, data.chatRoom.name);

    // Get users connected at the same chat room
    const connectedUsers = users.getUsersByRoom(data.chatRoom.name);

    // Advise to chatroom's users that new user has been coneected
    socket.broadcast
      .to(data.chatRoom.name)
      .emit(
        "newUser",
        createMessage(
          data.chatRoom.name,
          "Admin",
          data.userName,
          `${data.userName} is connected!!`
        ),
        connectedUsers
      );

    // Callback response, the connected users array
    callback(connectedUsers);
  });

  // Client sended message listener
  socket.on("createMessage", (data) => {
    console.log(data);

    const userTo = users.getUser(data.idSelected);
    const sender = users.getUser(data.idSender);

    if (userTo && sender) {
      if (userTo.userName == "Everybody")
        io.to(userTo.chatRoom).emit(
          "emitMessage",
          createMessage(
            data.chatRoom,
            data.from,
            data.to,
            data.msg,
            data.idSelected
          )
        );
      else {
        socket.broadcast
          .to(userTo.id)
          .emit(
            "emitMessage",
            createMessage(
              data.chatRoom,
              data.from,
              data.to,
              data.msg,
              data.idSelected
            )
          );
        socket.broadcast
          .to(sender.id)
          .emit(
            "emitMessage",
            createMessage(
              data.chatRoom,
              data.from,
              data.to,
              data.msg,
              data.idSender
            )
          );
      }
    }
  });

  // User disconnect listener
  socket.on("disconnect", () => {
    // First, delete user from array
    let deletedUser = users.deleteUser(socket.id);

    if (deletedUser) {
      // Get users in the same chat room to disconnect advise
      const connectedUsers = users.getUsersByRoom(deletedUser.chatRoom);
      // Send message back to them
      io.to(deletedUser.chatRoom).emit(
        "userDisconnect",
        createMessage(
          deletedUser.chatRoom,
          "Admin",
          deletedUser.userName,
          `${deletedUser.userName} has left the chat`
        ),
        connectedUsers
      );
    }
  });
};

const createMessage = (chatRoom, from, to, message, id = null) => {
  return { chatRoom, from, to, message, id, date: new Date().getTime() };
};

export default {
  socketController,
};
