import { Socket } from "socket.io";
import { JWTVerify } from "../../helpers/jwt-generator.js";
import Users from "../classes/users.js";

const users = new Users();

const socketController = async (socket = new Socket(), io) => {
  console.log("Socket Controller escuchando...");

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

    // Check message data sended from client
    if (!data.userName || !data.chatRoom) {
      return callback({
        error: true,
        message: "Hey! Seems some data is neeeded",
      });
    }

    // Remove old user profile from Users collection (DDBB) && leave room
    const storedUser = users.getUser(socket.id);
    if (storedUser) {
      socket.leave(storedUser.chatRoom);
      users.deleteUser(socket.id);
      const otherUsers = users.getUsersByRoom(storedUser.chatRoom);
      socket
        .to(storedUser.chatRoom)
        .emit(
          "userLeftRoom",
          `${storedUser.userName} has left the room!!`,
          otherUsers
        );
    }

    // Join user to  the new chat room
    socket.join(data.chatRoom.id);

    // Save user in Users collection (DDBB)
    users.setUser(socket.id, data.userName, data.chatRoom.id);

    // Add the dummy user to chat room of connected user
    users.setChatRoomToDummyUser(data.chatRoom.id);

    // Get users connected at the same chat room
    const connectedUsers = users.getUsersByRoom(data.chatRoom.id);

    // Advise to chatroom's users that new user has been coneected
    socket
      .to(data.chatRoom.id)
      .emit(
        "newUser",
        createMessage(
          data.chatRoom.id,
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
    const sender = users.getUser(data.idSender);
    const reciver = users.getUser(data.idReciver);

    if (sender && reciver) {
      if (reciver.userName == "Everybody")
        io.to(data.chatRoom).emit(
          "emitMessage",
          createMessage(
            data.chatRoom,
            data.from,
            data.to,
            data.msg,
            data.idReciver
          )
        );
      else {
        io.to(reciver.id).emit(
          "emitMessage",
          createMessage(
            data.chatRoom,
            data.from,
            data.to,
            data.msg,
            data.idReciver
          )
        );
        io.to(sender.id).emit(
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

export default socketController;
