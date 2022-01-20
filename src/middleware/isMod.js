module.exports = (req, res, next) => {
  if (!req.cookies.userId || req.cookies.role !== "moderator") {
    return res.redirect("/");
  }
  next();
};
