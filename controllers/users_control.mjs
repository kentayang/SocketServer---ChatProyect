const getUsers = (req, res) => {
  const { q, nombre = "no name", apikey } = req.query;

  res.json({
    msg: "get API - controlador",
    q,
    nombre,
    apikey,
  });
};

const putUsers = (req, res) => {
  const { id } = req.params;

  res.json({
    msg: "put API - controlador",
    id,
  });
};

const postUsers = (req, res) => {
  const { nombre, edad } = req.body;

  res.status(201).json({
    msg: "post API - controlador",
    nombre,
    edad,
  });
};

const deleteUsers = (req, res) => {
  res.json({
    msg: "delete API - controlador",
  });
};

const patchUsers = (req, res) => {
  res.json({
    msg: "patch API - controlador",
  });
};

export { getUsers, putUsers, postUsers, deleteUsers, patchUsers };
