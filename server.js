require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const path = require('path');

const {
    HTTP_PORT
} = process.env;

var morgan = require('morgan');
const app = express();

//parse application/json
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use("/public", express.static(path.join(__dirname, 'public')));
app.use(fileUpload());

var routes = require('./routes');
routes(app);

// daftarkan menu routes dari index
app.use('/auth', require('./middleware'));

app.listen(HTTP_PORT, () => {
    console.log(`Server started on port`);
});