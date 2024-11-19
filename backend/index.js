const express = require('express');
const app = express();
const server = require('http').createServer(app)
const cors = require('cors')
require('./DB/config')
const PORT = process.env.PORT || 5000
const io = require('socket.io')(server,{
    cors: {
        origin: '*'
    }
})

const { getDownloadURL, ref, getStorage, uploadBytes } = require('firebase/storage')
const config = require('./DB/firebaseconfig')
const { initializeApp } = require('firebase/app')
const multer = require('multer')
// const path = require('path')
// const Jwt = require('jsonwebtoken')
// const jwtKey = process.env.JWT_TOKEN

const User = require('./DB/users');
const Group = require('./DB/group');
const GroupDetail = require('./DB/groupsdetails');
const chats = require('./DB/chats');
const Message = require('./DB/message')
const Date = require('./DB/date');






app.use(express.json())
app.use(cors())

initializeApp(config.firebaseConfig)

const upload = multer({ storage: multer.memoryStorage() })

const storage = getStorage();


app.post('/signup', async (req, res) => {
    let user = await User(req.body)
    let result = await user.save()
    result = result.toObject()
    delete result.password;
    // console.log(result);
    res.send(result)

})

app.get('/check-email-account/:id',async(req,res)=>{
    let result = await User.find({email:req.params.id})
    res.send(result)
})

app.post('/login', async (req, res) => {
    if (req.body.email && req.body.password) {
        let user = await User.findOne(req.body).select('-password')
        res.send(user)
    }
})

app.post('/creategroup', upload.single('image'), async (req, res) => {
    const refstorage = ref(storage, req.file.originalname)
    await uploadBytes(refstorage, req.file.buffer).then((snapshot) => {

    })


    let group = await Group.create({
        groupName: req.body.groupName,
        image: await getDownloadURL(refstorage, req.file.originalname),
        userId: req.body.userId
    })
    res.send(group)

})

app.get('/group&useriddata/:id', async (req, res) => {
    let groups = await GroupDetail.find({ userId: req.params.id })
    res.send(groups)
})

app.get('/groupdata/:id', async (req, res) => {
    let groups = await Group.find({ userId: req.params.id })
    res.send(groups)
})


app.post('/send-date', async (req, res) => {
    let data = await Date.create({
        date: req.body.date,
        groupId: req.body.groupId
    })

    let result = await data.save()

    res.send(result)

})

// app.get('/groupid/:id',async(req,res)=>{
//     let groupId = await GroupDetail.find({userId:req.params.id})
//     res.send(groupId)
// })
// socket.io
let onlineUsers = [];

io.on('connection', (socket) => {

    socket.on('addMessage', ({ message, time, date, groupId, userId, userName }) => {

        socket.broadcast.emit('getMessage',
            {
                message,
                time,
                date,
                groupId,
                userId,
                userName
            }
        )
    })

    socket.on('sendInvite', ({ email, image, time, date, groupId, userId, userName }) => {
        socket.broadcast.emit('getInvite', {
            email,
            image,
            time,
            date,
            groupId,
            userId,
            userName
        })
    })


    socket.on('addUserId',(userId)=>{
        socket.broadcast.emit('getUserId',userId)
    })

    socket.on('addEmailId',(emailId)=>{
        socket.broadcast.emit('getEmailId',emailId)
    })

    // add new user
  socket.on("new-user-add", (newUser) => {
    if (!onlineUsers.some((user) => user.userId === newUser._id)) {  
      // if user is not added before
      onlineUsers.push({ userName: newUser.name,userId:newUser._id, socketId: socket.id });
    }
    // send all active users to new user
    io.emit("get-users", onlineUsers);
  });
  
  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id)
    // send all online users to all users
    io.emit("get-users", onlineUsers);
  });
  
  socket.on("offline", () => {
    // remove user from active users
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id)
    // send all online users to all users
    io.emit("get-users", onlineUsers);
  });


})


app.post('/send-chat', async (req, res) => {
    let chat = await chats.create({
        message: req.body.message,
        time: req.body.time,
        date: req.body.date,
        userId: req.body.userId,
        groupId: req.body.groupId,
        userName: req.body.userName

    })

    let result = await chat.save();
    res.send(result)
})

app.get('/chat-data/:id', async (req, res) => {
    let chat = await chats.find({ groupId: req.params.id })
    res.send(chat)
})

app.get('/messages/:id', async (req, res) => {
    let chat = await chats.find({ _id: req.params.id })
    res.send(chat)
})


app.get('/get-groupid-for-invite/:id',async(req,res)=>{
    let result = await GroupDetail.find({groupId:req.params.id})
    res.send(result)
})

app.post('/send-invite', async (req, res) => {
    let message = await Message.create({
        email: req.body.email,
        groupId: req.body.groupId,
        time: req.body.time,
        date: req.body.date,
        groupName: req.body.groupName,
        userName: req.body.userName,
        image: req.body.image
    })
    let result = await message.save()

    res.send(result)
})

app.get('/new-message/:email', async (req, res) => {
    let message = await Message.find({ email: req.params.email })
    res.send(message)
})

app.post('/accept-invite', async (req, res) => {
    let groupDetail = await GroupDetail.create({
        groupId: req.body.groupId,
        userId: req.body.userId,
        image: req.body.image,
        groupName: req.body.groupName,
        email:req.body.email,
        userName:req.body.userName
    })

    let result = await groupDetail.save()
    res.send(result)
})

app.delete('/delete-invite-data/:id', async (req, res) => {
    let message = await Message.deleteOne({ id: req.params._id })
    res.send(message)
})

app.get('/get-group-member/:groupId',async(req,res)=>{
    let member = await GroupDetail.find({groupId:req.params.groupId})
    res.send(member)
})
app.get('/get-group-member-name/:id',async(req,res)=>{
    let member = await GroupDetail.find({email:req.params.id})
    res.send(member)
})

app.delete('/exit-from-group/:id',async(req,res)=>{
    let result = await GroupDetail.deleteOne({_id: req.params.id})
    res.send(result)
})



server.listen(PORT);

