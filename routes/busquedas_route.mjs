import { Router } from "express";
import { search } from "../controllers/busquedas_control.mjs";

const busquedas_router = Router();

busquedas_router.get("/:collection/:term", search);

export default busquedas_router;
