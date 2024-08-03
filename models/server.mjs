import express from "express";
import cors from "cors";
import users_router from "../routes/users_route.mjs";
import auth_router from "../routes/auth_route.mjs";
import { dbconnection } from "../database/db_config.mjs";
import categorias_router from "../routes/categorias_route.mjs";
import productos_router from "../routes/productos_route.mjs";
import busquedas_router from "../routes/busquedas_route.mjs";

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.paths = {
      users: "/api/users",
      auth: "/api/auth",
      categorias: "/api/categorias",
      productos: "/api/productos",
      busquedas: "/api/busquedas",
    };

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
    this.app.use(this.paths.users, users_router);
    this.app.use(this.paths.auth, auth_router);
    this.app.use(this.paths.categorias, categorias_router);
    this.app.use(this.paths.productos, productos_router);
    this.app.use(this.paths.busquedas, busquedas_router);
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Escuchando en el puerto ${this.port}`);
    });
  }
}

export default Server;
