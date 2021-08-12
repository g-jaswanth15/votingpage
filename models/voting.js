const mongoose=require('mongoose')
const schema = mongoose.Schema

const votingschema = new schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
},{timestamps:true})

module.exports = mongoose.model('votinguser',votingschema)