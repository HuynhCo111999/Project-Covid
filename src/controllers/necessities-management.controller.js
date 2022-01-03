exports.get = (req, res) => {
  res.render("moderator/necessities-management", {
    layout: "moderator/main",
    function: "necessities-produdct",
  });
};

exports.add = (req, res) => {
  res.redirect("./necessities");
};
