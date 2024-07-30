//Estos procedimientos vienen  despues de validate_jwt. Sino fallarán

const validate_adminrole = (req, res, next) => {
  //Verificamos que la validacion del token salio ok
  if (!req.user) {
    return res.status(500).json({
      msg: "Se quiere validar el rol antes de validar el token",
    });
  }

  const { role, name } = req.user;
  if (role !== "ADMIN_ROLE") {
    return res.status(401).json({
      msg: `${name} no tiene permisos para realizar esta acción`,
    });
  }

  next();
};

const validate_roles = (...roles) => {
  return (req, res, next) => {
    //Verificamos que la validacion del token salio ok
    if (!req.user) {
      return res.status(500).json({
        msg: "Se quiere validar el rol antes de validar el token",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(401).json({
        msg: `El servicio requiere los roles ${roles}`,
      });
    }
    next();
  };
};

export { validate_adminrole, validate_roles };
