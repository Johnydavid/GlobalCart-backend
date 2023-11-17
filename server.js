const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDatabase = require("./config/database");



app.use(express.json());
app.use(cors());
require("dotenv").config();



const port = Number(process.env.PORT) || 3001

app.listen(port, ()=>{
    console.log(`server is running on port ${port}`)
})

app.use(bodyParser.json())

// Database Connection
connectDatabase();