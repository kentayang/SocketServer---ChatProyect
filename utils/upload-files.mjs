import path from "path";
import * as url from "url";
import { v4 as uuidv4 } from "uuid";

//Añadido para que funcione el __dirname en nuevas versiones de NodeJS
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

const uploadFiles = (
  files,
  validExtensions = ["png", "jpg", "jpeg", "gif"],
  folder = ""
) => {
  return new Promise((resolve, reject) => {
    const { file } = files;
    const cutedNameFile = file.name.split(".");
    const extension = cutedNameFile[cutedNameFile.length - 1];

    //Validar exxtensiones permitidas
    if (!validExtensions.includes(extension)) {
      return reject("Extensión de archivo no permitida");
    }

    const tempFileName = uuidv4() + "." + extension;
    const uploadPath = path.join(
      __dirname,
      "../uploads/",
      folder,
      tempFileName
    );

    file.mv(uploadPath, (err) => {
      if (err) {
        return reject(err);
      }

      resolve(tempFileName);
    });
  });
};

export { uploadFiles };
