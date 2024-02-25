const isAdmin = async (req, res, next) => {
  const user = req.session.user;

  if (!user.is_admin) {
    return res.status(301).redirect("/");
  }

  next();
};

const isReadOnly = async (req, res, next) => {
    next()
}

module.exports = {
    isAdmin,
    isReadOnly
}