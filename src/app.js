const express = require('express');
const app = express();
const { engine } = require('express-handlebars');
const bodyParser = require("body-parser");
const path = require('path');
const cookieParser = require('cookie-parser');
require('dotenv').config()
//set port local
const port = process.env.PORT || 3000;

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());
// database
const db = require("./models");
const Role = db.role;

// db.sequelize.sync();
// force: true will drop the table if it already exists
db.sequelize.sync({force: true}).then(() => {
  console.log('Drop and Resync Database with { force: true }');
  initial();
});

app.engine('handlebars', engine());
app.set('view engine', 'handlebars')
app.set('views', path.join(__dirname, 'views'));

//As Routes are defined in pages.js
app.use('/admin', require('./routes/admin'));
app.use('/', require('./routes/index'));
app.use(express.static(__dirname + '/public'));
require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);

app.listen(port, () => {
    console.log(`Server started on port: ${port}`);
})

function initial() {
    Role.create({
      id: 1,
      name: "user"
    });
   
    Role.create({
      id: 2,
      name: "moderator"
    });
   
    Role.create({
      id: 3,
      name: "admin"
    });
  }