import { CategoriaModel } from "../models/categoria_model.mjs";

const getCategories = async (req, res) => {
  try {
    const { limit = 5, from = 0 } = req.query;
    const query = { status: true };

    const [total, categories] = await Promise.all([
      CategoriaModel.countDocuments(query),
      CategoriaModel.find(query)
        .populate("user", "name")
        .skip(Number(from))
        .limit(Number(limit)),
    ]);

    res.json({
      total,
      categories,
    });
  } catch (error) {
    console.log(error);
    res.status(401).json({
      msg: "Algo salio mal al obtener categorias",
    });
  }
};

const getCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await CategoriaModel.findById({ _id: id }).populate(
      "user",
      "name"
    );
    res.json(category);
  } catch (error) {
    console.log(error);
    res.status(401).json({
      msg: "Algo salio mal al obtener la categoria",
    });
  }
};

const createCategory = async (req, res) => {
  try {
    const category = req.body.category.toUpperCase();
    const categoryDB = await CategoriaModel.findOne({ category });
    if (categoryDB) {
      return res.status(400).json({
        msg: "La categoría ya existe.",
      });
    }
    const data = {
      category,
      user: req.user._id,
    };

    const new_category = new CategoriaModel(data);
    await new_category.save();

    res.status(201).json(new_category);
  } catch (error) {
    console.log(error);
    res.status(401).json({
      msg: "Algo salio mal al registrar la categoria",
    });
  }
};

const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { _id, user, ...props } = req.body;
  props.category = props.category.toUpperCase();

  const category = await CategoriaModel.findByIdAndUpdate(id, props, {
    new: true,
  });

  res.json({
    msg: "Categoria editada correctamente",
    category,
  });
};

const deleteCategory = async (req, res) => {
  const { id } = req.params;
  const category = await CategoriaModel.findByIdAndUpdate(
    id,
    { status: false },
    { new: true }
  );
  const authUser = req.user;

  res.json({ category, authUser });
};

export {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
};
