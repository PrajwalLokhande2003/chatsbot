const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    groupId:String,
    email:String,
    time:String,
    date:String,
    groupName:String,
    userName:String,
    image:String,
    view : Number
})

module.exports = mongoose.model('message',messageSchema)