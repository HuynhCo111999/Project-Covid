const express = require('express');
const app = express();
const { engine } = require('express-handlebars');
const path = require('path');
require('dotenv').config()
//set port local
const port = process.env.PORT || 3000;

app.engine('handlebars', engine());
app.set('view engine', 'handlebars')
app.set('views', path.join(__dirname, 'views'));

//As Routes are defined in pages.js
app.use('/', require('./routes/index'));
app.use(express.static(__dirname + '/public'));

app.listen(port, () => {
    console.log(`Server started on port: ${port}`);
})