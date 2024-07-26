import "dotenv/config";
import Server from "./models/server.mjs";

const server = new Server();
server.listen();
