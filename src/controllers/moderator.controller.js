exports.getIndex = (req, res) => {
  res.render("moderator/main", { layout: "moderator/main" });
};

exports.getAddUser = (req, res) => {
  res.render("moderator/add-user", { layout: "moderator/main" });
};
