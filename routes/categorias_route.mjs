import { Router } from "express";
import { check } from "express-validator";
import { validate_fields } from "../middlewares/validate_fields.mjs";
import { validate_jwt } from "../middlewares/validate_jwt.mjs";
import { validate_roles } from "../middlewares/validate_roles.mjs";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategory,
  updateCategory,
} from "../controllers/categorias_control.mjs";
import { category_exists_byid } from "../utils/db-validators.mjs";

const categorias_router = Router();

categorias_router.get("/", getCategories);

categorias_router.get(
  "/:id",
  [
    check("id", "El id de categoría es obligatorio").not().isEmpty(),
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(category_exists_byid),
    validate_fields,
  ],
  getCategory
);

categorias_router.post(
  "/",
  [
    validate_jwt,
    check("category", "El nombre de la categoría es obligatorio")
      .not()
      .isEmpty(),
    validate_fields,
  ],
  createCategory
);

categorias_router.put(
  "/:id",
  [
    validate_jwt,
    check("id", "El id de categoría es obligatorio").not().isEmpty(),
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(category_exists_byid),
    validate_fields,
  ],
  updateCategory
);

categorias_router.delete(
  "/:id",
  [
    validate_jwt,
    validate_roles("ADMIN_ROLE"),
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(category_exists_byid),
    validate_fields,
  ],
  deleteCategory
);

export default categorias_router;
