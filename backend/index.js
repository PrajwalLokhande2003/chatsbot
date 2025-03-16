const express = require('express')
const http = require('http')
const app = express();
const cors = require('cors')
require('./DB/config')
const PORT = process.env.PORT || 5050
const server = http.createServer(app)
const io = require('socket.io')(server,{
    cors: {
        origin: "*"
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
const groupsdetails = require('./DB/groupsdetails');






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
        let user = await User.findOne({email:req.body.email,password:req.body.password}).select('-password')
        res.send(user)
    }
})

app.post('/creategroup', upload.single('image'), async (req, res) => {
    const refstorage = !req.file  ? '' : ref(storage, req.file.originalname);
    !req.file ? '' : await uploadBytes(refstorage, req.file.buffer)

    let group = await Group.create({
        groupName: req.body.groupName,
        image: !req.file ? '' : await getDownloadURL(refstorage, req.file.originalname),
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

app.get('/search/:key', async(req,res)=>{
    let result = await GroupDetail.find({
        "$or":[
            {groupName:{$regex:req.params.key}}
        ]
    })
    res.send(result)
})


app.post('/send-date', async (req, res) => {
    let data = await Date.create({
        date: req.body.date,
        groupId: req.body.groupId
    })

    let result = await data.save()

    res.send(result)

})

let onlineUsers = [];

io.on('connection', (socket) => {
    socket.on('addMessage', ({ message, time, date, groupId, userId, userName, image:{ext, size, fileName, name}, view, replay:{replayMsg, replayExt, replayFname, replayUerName,msgId},edit }) => {

        socket.broadcast.emit('getMessage',
            {
                message,
                time,
                date,
                groupId,
                userId,
                userName,
                image:{
                    ext,
                    size,
                    fileName,
                    name  
                },
                view,
                replay:{
                    replayMsg, 
                    replayExt, 
                    replayFname, 
                    replayUerName,
                    msgId
                },
                edit
            }
        )
    })

    socket.on('add-editmsg', (update)=>{
        socket.broadcast.emit('get-editmsg',update)
    })

    socket.on('add-chats', ({allChats})=>{
        socket.broadcast.emit('get-chats',{allChats})
    })

    socket.on('sendInvite', ({ email, image, time, date, groupId, userId, userName, view }) => {
        socket.broadcast.emit('getInvite', {
            email,
            image,
            time,
            date,
            groupId,
            userId,
            userName,
            view
        })
    })

    socket.on('addUserId',(userId)=>{
        socket.broadcast.emit('getUserId',userId)
    })

    socket.on('addEmailId',(emailId)=>{
        socket.broadcast.emit('getEmailId',emailId)
    })

  socket.on("new-user-add", (newUser) => {
    if (!onlineUsers.some((user) => user.userId === newUser._id)) {  
      onlineUsers.push({ userName: newUser.name,userId:newUser._id, socketId: socket.id });
    }
    io.emit("get-users", onlineUsers);
  });
  
  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id)
    io.emit("get-users", onlineUsers);
  });
  
  socket.on("offline", () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id)
    io.emit("get-users", onlineUsers);
  });


})

app.get('/all-chats', async(req,res)=>{
    let chat = await chats.find()
    res.send(chat)
})

app.post('/send-chat', upload.single('image'), async (req, res) => {
    try {
        const refstorage = req.file ? ref(storage, req.file.originalname) : null;
        if (req.file) await uploadBytes(refstorage, req.file.buffer);

        let chat = await chats.create({
            message: req.body.message,
            time: req.body.time,
            date: req.body.date,
            userId: req.body.userId,
            groupId: req.body.groupId,
            userName: req.body.userName,
            image: {
                fileName: req.file ? await getDownloadURL(refstorage) : '',
                ext: req.body.ext,
                size: req.body.size,
                name: req.body.name
            },
            view: JSON.parse(req.body.view) || [] ,
            replay: {
                message:req.body.replayMsg,
                ext: req.body.replayExt,
                name: req.body.replayFname,
                userName: req.body.replayUerName,
                msgId:req.body.msgId
            },
            edit:req.body.edit

        });

        res.status(201).json(chat);
    } catch (error) {
        console.error("Error in send-chat:", error);
        res.status(500).json({ error: error.message });
    }
});
// app.put("/update-view/:id", async (req, res) => {
//     try {
//         const { view } = req.body; 
//         if (!Array.isArray(view)) {
//             return res.status(400).json({ error: "View must be an array" });
//         }

//         const updatedChat = await chats.findByIdAndUpdate(
//             req.params.id,
//             { $push: { view: { $each: view } } },
//             { new: true }
//         );

//         if (!updatedChat) {
//             return res.status(404).json({ error: "Chat not found" });
//         }

//         res.status(200).json({ message: "View updated", chat: updatedChat });
//     } catch (error) {
//         console.error("Error updating view:", error);
//         res.status(500).json({ error: error.message });
//     }
// });

app.put('/update-chat/:id',async(req,res)=>{
    let result = await chats.updateOne({_id:req.params.id},{$set:{message:req.body.editMsg,edit:req.body.edit}})
    res.send(result) 
})

app.delete('/delete-chat/:id', async (req, res) => {
    let message = await chats.deleteOne({ _id: req.params.id })
    res.send(message)
})

app.put('/update-chat-view/:groupId/:id',async(req,res)=>{
    let result = await chats.updateMany({groupId:req.params.groupId},{$set:{"view.$[elem].numV":req.body.numV}},{ 
        arrayFilters: [{ "elem.id": req.params.id }],
        new: true 
    })
    
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
        image: req.body.image,
        last_msg_id : req.body.last_msg_id,
        view:req.body.view
    })
    let result = await message.save()

    res.send(result)
})

app.put('/update-invite-view/:email',async(req,res)=>{
    let result = await Message.updateMany({email:req.params.email},{$set:{view:req.body.view}})
    res.send(result) 
})

app.get('/new-message/:email', async (req, res) => {
    let message = await Message.find({ email: req.params.email })
    res.send(message)
})

app.get('/search-invite-email/:id/:email', async(req,res)=>{
    let result = await GroupDetail.find({
        "$or":[
            {   
                groupId : {$regex:req.params.id},
                email:{$regex:req.params.email}
            }
        ]
    })
    res.send(result)}
)

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

app.get('/get-user/:id',async(req,res)=>{
    let user = await User.find({_id:req.params.id}).select('-password')
    res.send(user)
})

app.put('/set-user/:id',async(req,res)=>{
    let result = await User.updateOne({_id:req.params.id},{$set:{name:req.body.name}})
    let result1 = await GroupDetail.updateMany({userId:req.params.id},{$set:{userName:req.body.name}})
    let result2 = await chats.updateMany({userId:req.params.id},{$set:{userName:req.body.name}})
    res.send({result,result1,result2}) 
})

app.put('/update-user-password/:id/:currpass',async(req,res)=>{
    let result = await User.updateOne({_id:req.params.id,password:req.params.currpass},{$set:{password:req.body.password}})
    res.send(result) 
})

app.delete('/delete-user/:id/:email',async(req,res)=>{
    let result = await User.deleteOne({_id: req.params.id,email:req.params.email})
    let result1 = await GroupDetail.deleteOne({userId: req.params.id})
    res.send({result,result1})
})

server.listen(PORT);

