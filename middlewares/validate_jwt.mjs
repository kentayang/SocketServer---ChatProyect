import jwt from "jsonwebtoken";
import { UserModel } from "../models/user_model.mjs";

const validate_jwt = async (req, res, next) => {
  const token = req.header("app-token");
  if (!token) {
    return res.status(401).json({
      msg: "No existe token en la petición",
    });
  }

  try {
    const { uid } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserModel.findById(uid);

    //Verificar si el usuario existe
    if (!user) {
      return res.status(401).json({
        msg: "Token no válido - usuario no existe",
      });
    }

    //Verificar si el usuario está activo
    if (!user.status) {
      return res.status(401).json({
        msg: "Token no válido - usuario desactivado",
      });
    }

    //

    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({
      msg: "Token no válido",
    });
  }
};

export { validate_jwt };
