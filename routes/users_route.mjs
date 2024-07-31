import { Router } from "express";
import { check } from "express-validator";
import { validate_fields } from "../middlewares/validate_fields.mjs";
import { validate_jwt } from "../middlewares/validate_jwt.mjs";
import {
  validate_adminrole,
  validate_roles,
} from "../middlewares/validate_roles.mjs";
import {
  getUsers,
  putUsers,
  postUsers,
  deleteUsers,
  patchUsers,
} from "../controllers/users_control.mjs";
import {
  role_isValid,
  email_exists,
  user_exists_byid,
} from "../utils/db-validators.mjs";

const users_router = Router();

users_router.get("/", getUsers);

users_router.post(
  "/",
  [
    check("name", "El nombre es obligatorio").not().isEmpty(),
    check("password", "El password es obligatorio").not().isEmpty(),
    check("password", "El password debe tener más de 6 caracteres").isLength({
      min: 6,
    }),
    check("email", "El correo no es válido").isEmail(),
    //check("role", "No es un rol permitido").isIn(["ADMIN_ROLE", "USER_ROLE"]),
    check("role").custom(role_isValid),
    check("email").custom(email_exists),
    validate_fields,
  ],
  postUsers
);

users_router.put(
  "/:id",
  [
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(user_exists_byid),
    check("role").custom(role_isValid),
    validate_fields,
  ],
  putUsers
);

// users_router.patch("/", patchUsers);

users_router.delete(
  "/:id",
  [
    validate_jwt,
    //validate_adminrole,
    validate_roles("ADMIN_ROLE", "ADMIN2_ROLE"),
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(user_exists_byid),
    validate_fields,
  ],
  deleteUsers
);

export default users_router;
