import bcrypt from "bcrypt";

//INSTALAR BCRYPT
//npm i bcrypt

const hashear = (password) => {
  const salt = bcrypt.genSaltSync();
  return bcrypt.hashSync(password, salt);
};

export { hashear };
