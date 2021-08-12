const mongoose = require('mongoose')
const schema = mongoose.Schema
const  votingdone = new schema({
    username:{
        type:String,
        required:true
    },
    teamname:{
        type:String,
        required:true
    },
    participant:{
        type:String,
        required:true
    },
    design:{
        type:String,
        required:true
    }
},{timestamps:true})

module.exports = mongoose.model('vote',votingdone)