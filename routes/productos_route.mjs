import { Router } from "express";
import { check } from "express-validator";
import { validate_fields } from "../middlewares/validate_fields.mjs";
import { validate_jwt } from "../middlewares/validate_jwt.mjs";
import { validate_roles } from "../middlewares/validate_roles.mjs";
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
} from "../controllers/productos_control.mjs";
import {
  category_exists_byid,
  product_exists_byid,
} from "../utils/db-validators.mjs";

const productos_router = Router();

productos_router.get("/", getProducts);

productos_router.get(
  "/:id",
  [
    check("id", "El id de producto es obligatorio").not().isEmpty(),
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(product_exists_byid),
    validate_fields,
  ],
  getProduct
);

productos_router.post(
  "/",
  [
    validate_jwt,
    check("product", "El nombre del producto es obligatorio").not().isEmpty(),
    check("category", "La categoría es obligatoria").not().isEmpty(),
    check("category", "No es un ID válido de categoria").isMongoId(),
    check("category").custom(category_exists_byid),
    validate_fields,
  ],
  createProduct
);

productos_router.put(
  "/:id",
  [
    validate_jwt,
    check("id", "El id de categoría es obligatorio").not().isEmpty(),
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(product_exists_byid),
    check("category", "La categoría es obligatoria").not().isEmpty(),
    check("category", "No es un ID válido de categoria").isMongoId(),
    check("category").custom(category_exists_byid),
    validate_fields,
  ],
  updateProduct
);

productos_router.delete(
  "/:id",
  [
    validate_jwt,
    validate_roles("ADMIN_ROLE"),
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(product_exists_byid),
    validate_fields,
  ],
  deleteProduct
);

export default productos_router;
