const mongoose = require('mongoose')

const groupsSchema = new mongoose.Schema({
    groupId:String,
    userId:String,
    image:String,
    groupName:String,
    email:String,
    userName:String
})

module.exports = mongoose.model('groupsDetail',groupsSchema)