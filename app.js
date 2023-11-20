const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require('path')
const dotenv = require('dotenv');
const errorMiddleware = require('./middlewares/error');

const products = require("./routes/product")



app.use(express.json());
app.use(cors());
require("dotenv").config();
app.use(bodyParser.json())




//Routes

app.use("/api/", products)


app.use(errorMiddleware)

module.exports = app;
