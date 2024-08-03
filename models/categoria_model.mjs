import { Schema, model } from "mongoose";

const categoriaSchema = Schema({
  category: {
    type: String,
    required: [true, "La categoría es obligatoria"],
    unique: true,
  },
  status: {
    type: Boolean,
    default: true,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

categoriaSchema.methods.toJSON = function () {
  const { __v, ...data } = this.toObject();
  return data;
};

const CategoriaModel = model("Category", categoriaSchema);

export { CategoriaModel };
