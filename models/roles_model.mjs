import { Schema, model } from "mongoose";

const roleSchema = Schema({
  role: {
    type: String,
    required: [true, "El rol es obligatorio"],
  },
});

const RoleModel = model("Role", roleSchema);

export { RoleModel };
