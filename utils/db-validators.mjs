import { RoleModel } from "../models/roles_model.mjs";
import { UserModel } from "../models/user_model.mjs";

const role_isValid = async (role = "") => {
  const roleExists = await RoleModel.findOne({ role });
  if (!roleExists) {
    throw new Error(`El rol ${role} no está registrado en la BD`);
  }
};

const email_exists = async (email = "") => {
  const emailExists = await UserModel.findOne({ email });
  if (emailExists) {
    throw new Error(`El correo ${email} ya está registrado en la BD`);
  }
};

const user_exists_byid = async (_id) => {
  const userExists = await UserModel.findOne({ _id });
  if (!userExists) {
    throw new Error(`El id de usuario ${_id} no existe`);
  }
};

export { role_isValid, email_exists, user_exists_byid };
