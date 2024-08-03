import bcrypt from "bcrypt";
import { UserModel } from "../models/user_model.mjs";
import { createJWT } from "../utils/jsonwebtoken.mjs";
import { google_verify } from "../utils/google-verify.mjs";

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
    console.log(error);
    res.status(500).json({
      msg: "Algo salió mal",
    });
  }
};

const google_signin = async (req, res) => {
  const { id_token } = req.body;

  try {
    const { name, img, email } = await google_verify(id_token);
    //console.log(name, img, email);
    let user = await UserModel.findOne({ email });
    //console.log(user);
    if (!user) {
      const data = {
        name,
        email,
        password: "xD",
        role: "USER_ROLE",
        img,
        google: true,
      };
      user = new UserModel(data);
      await user.save();
    }

    if (!user.status) {
      return res.status(401).json({
        msg: "Usuario bloqueado. Comuníquese con el administrador.",
      });
    }

    //Generar JWT
    const token = await createJWT(user.id);

    res.json({
      user,
      token,
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      msg: "El token no se pudo verificar",
    });
  }
};

export { login, google_signin };
