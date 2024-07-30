import bcrypt from "bcrypt";
import { UserModel } from "../models/user_model.mjs";
import { createJWT } from "../utils/jsonwebtoken.mjs";

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    //Verificar si email existe
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        msg: "Usuario incorrecto",
      });
    }

    //Verificamos que el usuario tenga estado true
    if (!user.status) {
      return res.status(400).json({
        msg: "Usuario incorrecto",
      });
    }

    //Verificamos la contraseña
    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(400).json({
        msg: "Password incorrecto",
      });
    }

    //Generar JWT
    const token = await createJWT(user.id);

    res.json({
      user,
      token,
    });
  } catch (error) {
    comsole.log(error);
    res.status(500).json({
      msg: "Algo salió mal",
    });
  }
};

export { login };
