const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require('path')
const dotenv = require('dotenv');
const errorMiddleware = require('./middlewares/error');
const cookieParser = require('cookie-parser')

const products = require("./routes/product");
const auth= require("./routes/auth");
const order = require("./routes/order");



app.use(express.json());
app.use(cookieParser());
app.use(cors());
require("dotenv").config();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));




//Routes

app.use('/api/', products);
app.use('/api/', auth)
app.use('/api/', order)



app.use(errorMiddleware)

module.exports = app;
