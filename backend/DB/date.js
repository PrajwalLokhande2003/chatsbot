const mongoose = require('mongoose')

const dateSchema = new mongoose.Schema({
    date:String,
    groupId:String
}) 

module.exports = mongoose.model('date',dateSchema)