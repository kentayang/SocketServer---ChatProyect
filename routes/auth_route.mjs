import { Router } from "express";
import { check } from "express-validator";
import { login } from "../controllers/auth_control.mjs";
import { validate_fields } from "../middlewares/validate_fields.mjs";

const auth_router = Router();

auth_router.post(
  "/login",
  [
    check("email", "El correo no es válido").isEmail(),
    check("password", "El password es obligatorio").not().isEmpty(),
    validate_fields,
  ],
  login
);

export default auth_router;
