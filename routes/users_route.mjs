import { Router } from "express";
import {
  getUsers,
  putUsers,
  postUsers,
  deleteUsers,
  patchUsers,
} from "../controllers/users_control.mjs";

const router = Router();

router.get("/", getUsers);
router.post("/", postUsers);
router.put("/:id", putUsers);
router.patch("/", patchUsers);
router.delete("/", deleteUsers);

// Para validar Errores 404
// router.put("*", (req, res) => {
//   res.status(404).json({
//     msg: "404 Error - Not found",
//   });
// });

export default router;
