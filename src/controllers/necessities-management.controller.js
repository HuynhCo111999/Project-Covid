exports.get = (req, res) => {
    res.render("moderator/necessities-management", { layout: "moderator/main"});
};

exports.add = (req, res) => {
    res.redirect("./necessities");
};