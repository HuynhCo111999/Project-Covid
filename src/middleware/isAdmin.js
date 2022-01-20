module.exports = (req, res, next) => {
  if (!req.cookies.userId || req.cookies.role !== "admin") {
    return res.redirect("/");
  }
  next();
};
