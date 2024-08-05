import path from "path";
import fs from "fs";
import * as url from "url";
import { uploadFiles } from "../utils/upload-files.mjs";
import { UserModel } from "../models/user_model.mjs";
import { ProductoModel } from "../models/producto_model.mjs";
import { v2 as cloudinary } from "cloudinary";
cloudinary.config(process.env.CLOUDINARY_URL);

//Añadido para que funcione el __dirname en nuevas versiones de NodeJS
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

const uploadFile = async (req, res) => {
  try {
    //Por defecto imagenes
    const uploadedFile = await uploadFiles(req.files, undefined, "imgs");
    //Para otros tipos (Indicar la carpeta- 3° arg, si no existe la creará)
    //const uploadedFile = await uploadFiles(req.files, ["txt", "md"], "textos");
    res.json({
      uploadedFile,
    });
  } catch (error) {
    res.status(400).json({
      error,
    });
  }
};

const updateImage = async (req, res) => {
  const { id, collection } = req.params;

  let model;

  switch (collection) {
    case "users":
      model = await UserModel.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: `No existe un usuario con id ${id}`,
        });
      }
      break;

    case "products":
      model = await ProductoModel.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: `No existe un producto con id ${id}`,
        });
      }
      break;

    default:
      return res
        .status(500)
        .json({ msg: "Algo salio mal al subir la imagen en la colección" });
      break;
  }

  //Limpiamos imagenes previas
  if (model.img) {
    const pathImage = path.join(__dirname, "../uploads", collection, model.img);
    if (fs.existsSync(pathImage)) {
      fs.unlinkSync(pathImage);
    }
  }
  model.img = await uploadFiles(req.files, undefined, collection);
  await model.save();

  res.json(model);
};

const updateImageCloudinary = async (req, res) => {
  const { id, collection } = req.params;

  let model;

  switch (collection) {
    case "users":
      model = await UserModel.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: `No existe un usuario con id ${id}`,
        });
      }
      break;

    case "products":
      model = await ProductoModel.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: `No existe un producto con id ${id}`,
        });
      }
      break;

    default:
      return res
        .status(500)
        .json({ msg: "Algo salio mal al subir la imagen en la colección" });
      break;
  }

  //Limpiamos imagenes previas
  if (model.img) {
    const nameArr = model.img.split("/");
    const nameFile = nameArr[nameArr.length - 1];
    const [public_id] = nameFile.split(".");
    cloudinary.uploader.destroy(public_id);
  }

  const { tempFilePath } = req.files.file;
  const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
  model.img = secure_url;

  await model.save();

  res.json(model);
};

const showImage = async (req, res) => {
  const { id, collection } = req.params;

  let model;

  switch (collection) {
    case "users":
      model = await UserModel.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: `No existe un usuario con id ${id}`,
        });
      }
      break;

    case "products":
      model = await ProductoModel.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: `No existe un producto con id ${id}`,
        });
      }
      break;

    default:
      return res
        .status(500)
        .json({ msg: "Algo salio mal al leer la imagen en la colección" });
      break;
  }

  if (model.img) {
    const pathImage = path.join(__dirname, "../uploads", collection, model.img);
    if (fs.existsSync(pathImage)) {
      return res.sendFile(pathImage);
    }
  } else {
    const pathNoImage = path.join(__dirname, "../assets/no-image.jpg");
    return res.sendFile(pathNoImage);
  }
};

export { uploadFile, updateImage, updateImageCloudinary, showImage };
