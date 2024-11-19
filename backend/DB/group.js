const mongoose = require('mongoose')
require('dotenv').config()

const groupSchema = new mongoose.Schema({
    groupName:String,
    image:String,
    userId:String
})

module.exports = mongoose.model('group',groupSchema)