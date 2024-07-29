import mongoose from "mongoose";

const dbconnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Base de datos conectada.");
  } catch (error) {
    console.error(error);
    throw new Error("Error al conectar con la bd");
  }
};

export { dbconnection };
