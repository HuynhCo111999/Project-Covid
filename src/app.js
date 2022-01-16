const express = require("express");
const app = express();
const { engine } = require("express-handlebars");
const expressHbs = require("express-handlebars");
const bodyParser = require("body-parser");
const path = require("path");
const cookieParser = require("cookie-parser");
require("dotenv").config();
//set port local
const port = process.env.PORT || 3000;

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());
// database
const db = require("./models");
const init = require("./middleware/init-table");
// db.sequelize.sync();
db.sequelize.sync({ force: false, alter: true }).then(() => {
  // init.initial();
});

const hbs = expressHbs.create({
  helpers: {
    ifStr(s1, s2, options) {
      return s1 === s2 ? options.fn(this) : options.inverse(this);
    },
    getName(s) {
      return s.split(".")[1].split(",")[0];
    },
    getId(s) {
      return s.split(".")[0].trim();
    },
    switch(value, options){
      this.switch_value = value;
      return options.fn(this);
    },
    case(value, options){
      if (value == this.switch_value) {
        return options.fn(this);
      }
    },
    gt(a,b) {
      var next =  arguments[arguments.length-1];
	    return (a > b) ? next.fn(this) : next.inverse(this);
    }
  },
});
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

//As Routes are defined in pages.js
app.use("/admin", require("./routes/admin"));
app.use("/", require("./routes/index"));
app.use(express.static(__dirname + "/public"));
require("./routes/auth.routes")(app);
require("./routes/user.routes")(app);

app.use("/moderator", require("./routes/moderator"));

app.listen(port, () => {
  console.log(`Server started on port: ${port}`);
});
