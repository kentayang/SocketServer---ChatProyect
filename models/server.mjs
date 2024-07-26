import express from "express";
import cors from "cors";
import router from "../routes/users_route.mjs";

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.usersPath = "/api/users";

    //Middlewares
    this.middlewares();

    //Rutas de mi App
    this.routes();
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
    this.app.use(this.usersPath, router);
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Escuchando en el puerto ${this.port}`);
    });
  }
}

export default Server;
