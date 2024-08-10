import express from "express";
import cors from "cors";
import http from "http";
import { Server as SocketServer } from "socket.io";
import fileUpload from "express-fileupload";
import users_router from "../routes/users_route.mjs";
import auth_router from "../routes/auth_route.mjs";
import { dbconnection } from "../database/db_config.mjs";
import categorias_router from "../routes/categorias_route.mjs";
import productos_router from "../routes/productos_route.mjs";
import busquedas_router from "../routes/busquedas_route.mjs";
import uploads_router from "../routes/uploads_route.mjs";
import { socket_controller } from "../sockets/socket_controller.mjs";

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;

    //Para socket.io
    this.server = http.createServer(this.app);
    this.io = new SocketServer(this.server);

    this.paths = {
      users: "/api/users",
      auth: "/api/auth",
      categorias: "/api/categorias",
      productos: "/api/productos",
      busquedas: "/api/busquedas",
      uploads: "/api/uploads",
    };

    //Conexion a BD
    this.connect_database();

    //Middlewares
    this.middlewares();

    //Rutas de mi App
    this.routes();

    //Sockets
    this.sockets();
  }

  async connect_database() {
    await dbconnection();
  }

  middlewares() {
    //CORS
    this.app.use(cors());

    //Lectura y parseo del Body de la request
    this.app.use(express.json());

    //Directorio público
    this.app.use(express.static("public"));

    //Fileupload - Carga de archivos
    this.app.use(
      fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
        createParentPath: true,
      })
    );
  }

  routes() {
    this.app.use(this.paths.users, users_router);
    this.app.use(this.paths.auth, auth_router);
    this.app.use(this.paths.categorias, categorias_router);
    this.app.use(this.paths.productos, productos_router);
    this.app.use(this.paths.busquedas, busquedas_router);
    this.app.use(this.paths.uploads, uploads_router);
  }

  sockets() {
    this.io.on("connection", (socket) => socket_controller(socket, this.io));
  }

  listen() {
    this.server.listen(this.port, () => {
      console.log(`Escuchando en el puerto ${this.port}`);
    });
  }
}

export default Server;
