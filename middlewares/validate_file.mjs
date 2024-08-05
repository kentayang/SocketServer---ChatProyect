const validate_file = (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0 || !req.files.file) {
    return res
      .status(400)
      .json({ msg: "No se enviaron archivos en la petición.(validate_file)" });
  }
  next();
};

export { validate_file };
