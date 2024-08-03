import mongoose from "mongoose";
import { UserModel } from "../models/user_model.mjs";
import { CategoriaModel } from "../models/categoria_model.mjs";
import { ProductoModel } from "../models/producto_model.mjs";

const allowedCollections = ["users", "categories", "products", "roles"];

const searchUsers = async (term = "", res) => {
  //Busqueda por ID user. Validamos si es un id de mongoDB válido
  const isMongoId = mongoose.Types.ObjectId.isValid(term);
  if (isMongoId) {
    const user = await UserModel.findById(term);
    return res.json({
      results: user ? [user] : [],
    });
  }

  // Usamos expresion regular para evitar mayusculas y minusculas
  const regex = new RegExp(term, "i");

  const users = await UserModel.find({
    $or: [{ name: regex }, { email: regex }],
    $and: [{ status: true }],
  });

  const count = await UserModel.countDocuments({
    $or: [{ name: regex }, { email: regex }],
    $and: [{ status: true }],
  });

  return res.json({
    count,
    results: users,
  });
};

const searchCategories = async (term = "", res) => {
  const isMongoId = mongoose.Types.ObjectId.isValid(term);
  if (isMongoId) {
    const category = await CategoriaModel.findById(term);
    return res.json({
      results: category ? [category] : [],
    });
  }

  const regex = new RegExp(term, "i");

  const categories = await CategoriaModel.find({
    $or: [{ category: regex }],
    $and: [{ status: true }],
  });

  const count = await CategoriaModel.countDocuments({
    $or: [{ category: regex }],
    $and: [{ status: true }],
  });

  return res.json({
    count,
    results: categories,
  });
};

const searchProducts = async (term = "", res) => {
  const isMongoId = mongoose.Types.ObjectId.isValid(term);
  if (isMongoId) {
    const product = await ProductoModel.findById(term).populate(
      "category",
      "category"
    );
    return res.json({
      results: product ? [product] : [],
    });
  }

  const regex = new RegExp(term, "i");

  const products = await ProductoModel.find({
    $or: [{ product: regex }],
    $and: [{ status: true }],
  }).populate("category", "category");

  const count = await ProductoModel.countDocuments({
    $or: [{ product: regex }],
    $and: [{ status: true }],
  });

  return res.json({
    count,
    results: products,
  });
};

const search = (req, res) => {
  const { collection, term } = req.params;

  if (!allowedCollections.includes(collection)) {
    return res.status(400).json({
      msg: `Las colecciones permitidas son: ${allowedCollections}`,
    });
  }

  switch (collection) {
    case "users":
      searchUsers(term, res);
      break;
    case "categories":
      searchCategories(term, res);
      break;
    case "products":
      searchProducts(term, res);
      break;
    default:
      res.status(500).json({
        msg: "Busqueda no controlada",
      });
  }
};

export { search };
