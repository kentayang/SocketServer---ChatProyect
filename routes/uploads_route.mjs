import { Router } from "express";
import { check } from "express-validator";
import { validate_fields } from "../middlewares/validate_fields.mjs";
import {
  showImage,
  updateImageCloudinary,
  uploadFile,
} from "../controllers/uploads_control.mjs";
import { allowed_collections_image } from "../utils/db-validators.mjs";
import { validate_file } from "../middlewares/validate_file.mjs";

const uploads_router = Router();

uploads_router.post("/", validate_file, uploadFile);

uploads_router.put(
  "/:collection/:id",
  [
    validate_file,
    check("id", "Debe ser un id válido").isMongoId(),
    check("collection").custom((c) =>
      allowed_collections_image(c, ["users", "products"])
    ),
    validate_fields,
  ],
  updateImageCloudinary
);

uploads_router.get(
  "/:collection/:id",
  [
    check("id", "Debe ser un id válido").isMongoId(),
    check("collection").custom((c) =>
      allowed_collections_image(c, ["users", "products"])
    ),
    validate_fields,
  ],
  showImage
);

export default uploads_router;
