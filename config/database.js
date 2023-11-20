const mongoose = require('mongoose');

const connectDatabase = ()=>{
    mongoose.connect(process.env.ATLAS_URI,{
        useNewUrlParser:true,
        useUnifiedTopology:true
    }).then(con=>{
        console.log(`MongoDB is connected to the host: ${con.connection.host} `)
    })
}

module.exports = connectDatabase;