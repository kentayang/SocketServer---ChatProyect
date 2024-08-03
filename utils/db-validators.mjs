import { CategoriaModel } from "../models/categoria_model.mjs";
import { ProductoModel } from "../models/producto_model.mjs";
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

const category_exists_byid = async (_id) => {
  const categoryExists = await CategoriaModel.findOne({ _id });
  if (!categoryExists) {
    throw new Error(`El id de categoria ${_id} no existe`);
  }
};

const product_exists_byid = async (_id) => {
  const productExists = await ProductoModel.findOne({ _id });
  if (!productExists) {
    throw new Error(`El id de producto ${_id} no existe`);
  }
};

export {
  role_isValid,
  email_exists,
  user_exists_byid,
  category_exists_byid,
  product_exists_byid,
};
