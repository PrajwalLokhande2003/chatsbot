const mongoose = require('mongoose')
const group = require('./group')

const chatSchema = new mongoose.Schema({
    message:String,
    time:String,
    date:String,
    userId:String,
    groupId:String,
    userName:String
})

module.exports = mongoose.model('chats',chatSchema)