import { Schema, model } from "mongoose";

const productoSchema = Schema({
  product: {
    type: String,
    required: [true, "El nombre del producto es obligatorio"],
    unique: true,
  },
  description: {
    type: String,
    default: "",
  },
  available: {
    type: Boolean,
    default: true,
  },
  status: {
    type: Boolean,
    default: true,
    required: true,
  },
  price: {
    type: Number,
    default: 0,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
});

productoSchema.methods.toJSON = function () {
  const { __v, ...data } = this.toObject();
  return data;
};

const ProductoModel = model("Product", productoSchema);

export { ProductoModel };
