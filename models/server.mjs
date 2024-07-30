import express from "express";
import cors from "cors";
import users_router from "../routes/users_route.mjs";
import auth_router from "../routes/auth_route.mjs";

import { dbconnection } from "../database/db_config.mjs";

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.usersPath = "/api/users";
    this.authPath = "/api/auth";

    //Conexion a BD
    this.connect_database();

    //Middlewares
    this.middlewares();

    //Rutas de mi App
    this.routes();
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
  }

  routes() {
    this.app.use(this.usersPath, users_router);
    this.app.use(this.authPath, auth_router);
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Escuchando en el puerto ${this.port}`);
    });
  }
}

export default Server;
