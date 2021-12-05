const mongoose = require('mongoose')
const empSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    age:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    }
})

module.exports = mongoose.model("empdata",empSchema)