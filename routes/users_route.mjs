import { Router } from "express";
import { check } from "express-validator";
import {
  getUsers,
  putUsers,
  postUsers,
  deleteUsers,
  patchUsers,
} from "../controllers/users_control.mjs";
import { users_validate } from "../middlewares/users_validate.mjs";
import {
  role_isValid,
  email_exists,
  user_exists_byid,
} from "../utils/db.validators.mjs";

const router = Router();

router.get("/", getUsers);

router.post(
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
    users_validate,
  ],
  postUsers
);

router.put(
  "/:id",
  [
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(user_exists_byid),
    check("role").custom(role_isValid),
    users_validate,
  ],
  putUsers
);

router.patch("/", patchUsers);

router.delete(
  "/:id",
  [
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(user_exists_byid),
    users_validate,
  ],
  deleteUsers
);

export default router;
