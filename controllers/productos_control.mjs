import { ProductoModel } from "../models/producto_model.mjs";

const getProducts = async (req, res) => {
  try {
    const { limit = 5, from = 0 } = req.query;
    const query = { status: true };

    const [total, products] = await Promise.all([
      ProductoModel.countDocuments(query),
      ProductoModel.find(query)
        .populate("user", "name")
        .populate("category", "category")
        .skip(Number(from))
        .limit(Number(limit)),
    ]);

    res.json({
      total,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(401).json({
      msg: "Algo salio mal al obtener productos",
    });
  }
};

const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await ProductoModel.findById({ _id: id })
      .populate("user", "name")
      .populate("category", "category");
    res.json(product);
  } catch (error) {
    console.log(error);
    res.status(401).json({
      msg: "Algo salio mal al obtener el producto",
    });
  }
};

const createProduct = async (req, res) => {
  try {
    const product = req.body.product.toUpperCase();
    const { description, available, price, category } = req.body;
    const productDB = await ProductoModel.findOne({ product });
    if (productDB) {
      return res.status(400).json({
        msg: "El producto ya existe.",
      });
    }
    const data = {
      product,
      description,
      available,
      price,
      user: req.user._id,
      category,
    };

    const new_product = new ProductoModel(data);
    await new_product.save();

    res.status(201).json(new_product);
  } catch (error) {
    console.log(error);
    res.status(401).json({
      msg: "Algo salio mal al registrar el producto",
    });
  }
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { _id, user, ...props } = req.body;
  props.product = props.product.toUpperCase();

  const product = await ProductoModel.findByIdAndUpdate(id, props, {
    new: true,
  });

  res.json({
    msg: "Producto editado correctamente",
    product,
  });
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const product = await ProductoModel.findByIdAndUpdate(
    id,
    { status: false },
    { new: true }
  );

  res.json({ product });
};

export { createProduct, getProducts, getProduct, updateProduct, deleteProduct };
