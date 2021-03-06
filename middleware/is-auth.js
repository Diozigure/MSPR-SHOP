const { Exception } = require("handlebars");

isAuth = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res.redirect("/login");
  }
  next();
};

isAdmin = (req, res, next) => {
  if(req.session.user.role == 'Admin')
    return next();
  return next(new Error("Unauthorized"));
};

module.exports = {
  isAuth,
  isAdmin
}
