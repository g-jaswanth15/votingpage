const mongoose=require('mongoose')
const schema = mongoose.Schema
const  createschema = new schema({
    username:{
        type:String,
        required:true
    },
    teamname:{
        type:String,
        required:true
    },
    design1:{
        type:String,
        required:true
    },
    design2:{
        type:String,
        required:true
    },
    code:{
        type:String,
        required:true
    },
    color1:{
        type:String,
        required:true
    },
    color2:{
        type:String,
        required:true
    }
},{timestamps:true})

module.exports = mongoose.model('createuserteam',createschema)