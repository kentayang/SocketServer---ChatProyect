import { Router } from "express";
import { check } from "express-validator";
import {
  google_signin,
  login,
  renovate_token,
} from "../controllers/auth_control.mjs";
import { validate_fields } from "../middlewares/validate_fields.mjs";
import { validate_jwt } from "../middlewares/validate_jwt.mjs";

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

auth_router.post(
  "/google",
  [check("id_token", "id_token es necesario").not().isEmpty(), validate_fields],
  google_signin
);

auth_router.get("/", validate_jwt, renovate_token);

export default auth_router;
