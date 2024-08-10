import { checkJWT } from "../utils/jsonwebtoken.mjs";
import ChatMessages from "../models/chat_model.mjs";

const chatInstance = new ChatMessages();

const socket_controller = async (socket, io) => {
  const user = await checkJWT(socket.handshake.headers["app-token"]);
  if (!user) {
    return socket.disconnect();
  }

  //Cuando se conecta un usuario
  chatInstance.connectUser(user);
  io.emit("usuarios-activos", chatInstance.usersArr);
  socket.emit("recibir-mensajes", chatInstance.last10);

  //Conectar usuario a su sala independiente
  //Cada usuario se va a conectar a la sala global (io), sala socket.id y sala privada por su id (user.id)
  socket.join(user.id);

  //Cuando se desconecta. Limpieza.
  socket.on("disconnect", () => {
    chatInstance.disconnectUser(user.id);
    io.emit("usuarios-activos", chatInstance.usersArr);
  });

  //Cuando se envia un mensaje
  socket.on("enviar-mensaje", ({ message, uid }) => {
    //Mensaje prievado
    if (uid) {
      socket.to(uid).emit("mensaje-privado", { from: user.name, message });
      return;
    }

    //Mensaje Global
    chatInstance.sendMessage(user.id, user.name, message);
    io.emit("recibir-mensajes", chatInstance.last10);
  });
};

export { socket_controller };
