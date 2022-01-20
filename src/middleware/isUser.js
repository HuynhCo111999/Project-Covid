module.exports = (req, res, next) => {
  if (!req.cookies.userId || req.cookies.role !== "user") {
    return res.redirect("/");
  }
  next();
};
