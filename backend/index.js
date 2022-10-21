require("dotenv").config();

const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const app = express()
const userRoutes = require("./routes/userRoutes")
const msgRoutes = require("./routes/MessagesRoute")
const socket = require("socket.io")

//database connected
mongoose.connect(process.env.DATABASE).then(() => {
    console.log("DATABASE CONNECTED")
})

app.use(cors());
app.use(express.json());

//routes
app.use("/api/auth", userRoutes)
app.use("/api/messages", msgRoutes)

const PORT = process.env.PORT

const server = app.listen(PORT, ()=> {
    console.log(`SERVER RUNNING ON PORT ${PORT}`)
})

const io = socket(server, {
    cors: {
      origin: process.env.ORIGIN,
      credentials: true,
    },
  });
  
  global.onlineUsers = new Map();
  io.on("connection", (socket) => {
    global.chatSocket = socket;
    socket.on("add-user", (userId) => {
      onlineUsers.set(userId, socket.id);
    });
  
    socket.on("send-msg", (data) => {
        console.log(data)
      const sendUserSocket = onlineUsers.get(data.to);
      if (sendUserSocket) {
        socket.to(sendUserSocket).emit("msg-recieve", data.messages);
      }
    });
  });