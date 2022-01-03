exports.get = (req, res) => {
  res.render("moderator/necessities-management", {
    layout: "moderator/main",
    function: "neccessities-product",
  });
};

exports.add = (req, res) => {
  res.redirect("./necessities");
};
