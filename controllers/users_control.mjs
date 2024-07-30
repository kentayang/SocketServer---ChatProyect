import { UserModel } from "../models/user_model.mjs";
import { hashear } from "../utils/hashing.mjs";

const getUsers = async (req, res) => {
  const { limit = 5, from = 0 } = req.query;
  const query = { status: true };

  const [total, users] = await Promise.all([
    UserModel.countDocuments(query),
    UserModel.find(query).skip(Number(from)).limit(Number(limit)),
  ]);

  res.json({
    total,
    users,
  });
};

const postUsers = async (req, res) => {
  const { name, email, password, role } = req.body;
  const userInstance = new UserModel({ name, email, password, role });

  //Encriptacion de password
  userInstance.password = hashear(password);

  await userInstance.save();

  res.status(201).json({
    msg: "Usuario creado correctamente",
    userInstance,
  });
};

const putUsers = async (req, res) => {
  const { id } = req.params;
  const { _id, password, google, email, ...props } = req.body;

  if (password) {
    props.password = hashear(password);
  }

  const user = await UserModel.findByIdAndUpdate(id, props, { new: true });

  res.json({
    msg: "Usuario editado correctamente",
    user,
  });
};

const deleteUsers = async (req, res) => {
  const { id } = req.params;

  //Cambiamos el estado del user a false
  const user = await UserModel.findByIdAndUpdate(
    id,
    { status: false },
    { new: true }
  );
  const authUser = req.user;

  res.json({ user, authUser });
};

const patchUsers = (req, res) => {
  res.json({
    msg: "patch API - controlador",
  });
};

export { getUsers, putUsers, postUsers, deleteUsers, patchUsers };
