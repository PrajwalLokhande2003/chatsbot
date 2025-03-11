const mongoose = require('mongoose')
const group = require('./group')

const chatSchema = new mongoose.Schema({
    message:String,
    time:String,
    date:String,
    userId:String,
    groupId:String,
    userName:String,
    image:{
        fileName:String,
        ext:String,
        size:String,
        name:String
    },
    view:[{id:String,numV:Number}],
    replay:{
        message:String,
        ext:String,
        name:String,
        userName:String,
        msgId:String
    },
    edit:Number
})

module.exports = mongoose.model('chats',chatSchema)