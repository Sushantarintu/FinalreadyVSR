require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const mongoose= require('mongoose')
const multer = require('multer');
// const uniqueValidator = require('mongoose-unique-validator');
const bodyParser = require('body-parser');
// const session = require('express-session');
// const MongoStore = require('connect-mongo');
const http = require('http');
const speech = require("@google-cloud/speech");
const client = new speech.SpeechClient();

require('./imageDetails')

const port= process.env.PORT || 10000;

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://virtual-study-room2-git-master-sushanta-bhattas-projects.vercel.app/",
   "https://virtual-study-room2.vercel.app"
];

// app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(cors({credentials: true, origin: allowedOrigins }));
app.use(express.json());
app.use(bodyParser.json());

console.log("Mongo Uri",process.env.MONGO_URI);

const MONGO_URI = process.env.MONGO_URI ; 


const UPLOAD_DIR = path.join(__dirname, 'uploads');

// Ensure the uploads directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR);
}

app.use('/uploads', express.static('uploads'));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ---------- In-memory storage for simplicity ----------
let allFiles = {}; // { roomId: [ { name, url } ] }
let allNotes = {}; // { roomId: [ note1, note2 ] }

const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: { origin: allowedOrigins, methods: ['GET', 'POST'] },
});

const allusers = {};
const socketToUser = {};


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directory to save uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Unique file name
  }
});

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/files/'); // Store all files separately
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });
const fileUpload = multer({ storage: fileStorage });

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.log("MongoDB Connection Error:", err));

const userSchema= mongoose.Schema({name:String,email:String,password:String})
const UserData= mongoose.model('UserData',userSchema)

const Images= mongoose.model("ImageDetails")

const curUserSchema= mongoose.Schema({name:String,email:String,password:String})
const CurLoginer= mongoose.model('CurLoginer',curUserSchema)

const loginerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true }, // Unique constraint added here
  password: { type: String, required: true },
  imagePath:{type:String}
});
// loginerSchema.plugin(uniqueValidator, { message: 'Error, expected {PATH} to be unique.' });
const LoginerData= mongoose.model('LoginerData',loginerSchema)

const grSchema= mongoose.Schema({gname:String,gcapacity:Number,builder:String,gdate:Date,grmembers:Array})
const Group= mongoose.model('Group',grSchema)

const quizschema= mongoose.Schema({queSettingId:String,topicName:String,question:String,options:Array,rightans:String,examDuration:Number})
const Quize= mongoose.model('Quize',quizschema)

const examinerSchema= mongoose.Schema({ename:String,eemail:String,ephno: String,eregd: String,examinerset:String,correctPoint: Number})
const Examiner= mongoose.model('Examiner',examinerSchema)

const realexaminerSchema= mongoose.Schema({ename:String,eemail:String,ephno: String,eregd: String,examinerset:String,correctPoint: Number,subject:String})
const RealExaminer= mongoose.model('RealExaminer',realexaminerSchema)

const authenticateschema= mongoose.Schema({  name: String,email:String, password: String, authid:String})
const Authenticated= mongoose.model('Authenticated',authenticateschema)

app.get('/',(req,res)=>{
  res.send("Hello man...")
})

// Configure Multer for Audio Uploads
const audioStorage = multer.memoryStorage(); // Store audio in memory
const audioUpload = multer({ storage: audioStorage });

// Speech-to-Text API Endpoint
app.post("/api/speech-to-text", audioUpload.single("audio"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No audio file uploaded" });
    }

    const audioBytes = req.file.buffer.toString("base64");

    const request = {
      audio: { content: audioBytes },
      config: {
        encoding: "LINEAR16",
        sampleRateHertz: 16000,
        languageCode: "en-US",
      },
    };

    const [response] = await client.recognize(request);
    const transcription = response.results
      .map((result) => result.alternatives[0].transcript)
      .join(" ");

    res.json({ text: transcription });
  } catch (error) {
    console.error("Speech-to-Text Error:", error);
    res.status(500).json({ error: "Failed to process speech" });
  }
});

app.post('/upload-image', upload.single('file'), async (req, res) => {
  try {
    const imagePath = `uploads/${req.file.filename}`;
    const email = req.body.email;
    
    // Find and update the current user with the new image path
    const updatedUser = await LoginerData.findOneAndUpdate(
      {email},
      { imagePath },
      { new: true }
    );

    if (updatedUser) {
      res.send({ status: "ok", filePath: imagePath, updatedUser });
    } else {
      res.status(404).send({ status: "error", message: "No current user found" });
    }
  } catch (err) {
    console.error(err);
    res.send({ status: "error", data: err });
  }
});


app.get('/images', async (req, res) => {
  try {
    const images = await Images.find({});
    res.json({ status: "ok", images });
  } catch (err) {
    res.json({ status: "error", data: err });
  }
});

app.post('/upload-file', fileUpload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = `uploads/files/${req.file.filename}`;
    res.json({
      status: "ok",
      fileName: req.file.originalname,
      fileUrl: `http://localhost:10000/${filePath}`, // Permanent URL
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "File upload failed" });
  }
});
// ---------- Fetch Files for a Room ----------
app.get("/files", (req, res) => {
  const { roomId } = req.query;
  const files = allFiles[roomId] || [];
  res.json(files);
});

// ---------- Fetch Notes for a Room ----------
app.get("/notes", (req, res) => {
  const { roomId } = req.query;
  const notes = allNotes[roomId] || [];
  res.json(notes);
});
app.post('/curloginer', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Remove all previous records
    await CurLoginer.deleteMany({});

    // Save the new user
    const curUserData = new CurLoginer({ name, email, password });

    await curUserData.save();

    res.json({ message: 'New user data stored successfully and replaced previous data.' });
  } catch (error) {
    console.error('Error storing new user data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/getCuruserData', async (req, res) => {
  try {
    const curUserData = await CurLoginer.findOne();
    if (curUserData) {
      console.log(curUserData);
      
      res.json(curUserData);
    } else {
      res.status(404).json({ message: 'No current user data found.' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});


app.post('/loginers', (req, res) => {
  const { name, email, password } = req.body;

  LoginerData.findOne({ email })
    .then(existingUser => {
      if (existingUser) {
        console.log("User already exists, skipping save.");
        return res.status(200).json({ message: "User already exists. Skipped saving." });
      }

      // Save new user if not a duplicate
      const loginerdata = new LoginerData({ name, email, password });

      loginerdata.save()
        .then(() => res.status(201).json({ message: "Loginer saved successfully" }))
        .catch(err => res.status(500).json({ message: "Error saving data", error: err }));
    })
    .catch(err => res.status(500).json({ message: "Database error", error: err }));
});


app.get('/getloginers', (req, res) => {
  LoginerData.find()
    .then((loginerdata) => {
      console.log("avatars", loginerdata); // Logs the entire array of documents
      res.json(loginerdata); // Return the array as the response
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Internal server error" });
    });
});


app.post('/examinerdata2', async (req, res) => {
  try {
    console.log("Received examiner data:", req.body);
    const { ename, eemail, ephno, eregd,examinerset, correctPoint,subject } = req.body;

    // Validation to ensure required fields are not missing
    if (!ename || !eemail || !ephno || !eregd || correctPoint === undefined) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const realexaminer = new RealExaminer({ ename, eemail, ephno, eregd,examinerset, correctPoint,subject });
    await realexaminer.save();

    res.status(200).json({ message: 'Examiner data saved successfully!' });
  } catch (error) {
    console.error("Error saving examiner data:", error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/getexaminerdata2',(req,res)=>{
  RealExaminer.find()
  .then((examinerdata)=>{
    res.json(examinerdata)
  })
  .catch((err)=>{
    console.log(err);   
  })
}
)
// app.get('/getexaminerdata', async (req, res) => {
//   try {
//     const { examinerSet } = req.query; // Get the examinerSet from query parameters
//     let query = {};

//     console.log(examinerSet, "Type:", typeof examinerSet);
    
//     if (examinerSet) {
//       query.examinerSet = new RegExp(`^${examinerSet.trim()}$`, "i"); // Case-insensitive search
//     }
//     console.log("Query Object Sent to MongoDB:", query);

//     const examinerData = await Examiner.find(query); // Sort in descending order
//     console.log(examinerData)
//     res.json(examinerData);
//   } catch (err) {
//     console.error("Error fetching examiner data:", err);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

const taskSchema = new mongoose.Schema({
  name: String,
});

const Task = mongoose.model('Task', taskSchema);

// API Routes

// Get all tasks
app.get('/getTasks', async (req, res) => {
  try {
      const tasks = await Task.find();
      res.json(tasks);
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});

// Add a task
app.post('/tasks', async (req, res) => {
  try {
      const { task } = req.body;
      const newTask = new Task({ name: task });
      await newTask.save();
      res.status(201).json({ message: 'Task added successfully', task: newTask });
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});

// Delete a task by ID
app.delete('/deleteTask/:id', async (req, res) => {
  try {
      const { id } = req.params;
      await Task.findByIdAndDelete(id);
      res.json({ message: 'Task deleted successfully' });
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});

app.post('/quizdata',(req,res)=>{
  console.log(req.body);
  const {queSettingId,topicName,question,options,rightans,examDuration}= req.body;
  res.status(200).json({ message: 'Quiz data received successfully!' });
  const quize= new Quize({queSettingId,topicName,question,options,rightans,examDuration});
  quize.save().then(()=>{
    console.log("Quiz data saved successfully")
  }).catch((err)=>{
    console.log(err);    
  })
})

app.get('/getquizques',(req,res)=>{
  Quize.find().then((quizdata)=>{
    res.json(quizdata)
    // console.log("quiz data retriwved:-",quizdata);
    
  }).catch(()=>{
    res.json({message:"Error fetching quiz data..."})
  })
})

app.post('/authenticatedusers',(req,res)=>{
  const {  name,email,password,authid}= req.body;
  const authenticated= new Authenticated({  name,email,password,authid})
  authenticated.save()
  .then(res.json({message:'Data Stored Successfully...'}))
  .catch((err)=>console.log(err))
})
app.get('/getauthdatas',(req,res)=>{
  Authenticated.find().then((authdata)=>{
    res.json(authdata)
    // console.log("quiz data retriwved:-",quizdata);
    
  }).catch(()=>{
    res.json({message:"Error fetching quiz data..."})
  })
})

app.post('/userreg',(req,res)=>{
  try{
    const { name, email, password }= req.body;
  // console.log(req.body);
  const userdata = new UserData({ name, email, password })
  userdata.save()
  .then(()=>{console.log("userdata saved");
    res.json({message:'Data Stored Successfully...'})
  })
  .catch((err)=>console.log(err))
  }catch(err){
    console.log(err);
  }
})

app.get('/getUserData',(req,res)=>{
  UserData.find().then((userdata)=>{
    res.json(userdata)
    // console.log(userdata);
    console.log('User data retrived from db');
  }).catch((err)=>{
    console.log(err);
  })
})

app.post('/grdata',(req,res)=>{
  // console.log(req.body)
  const {gname,gcapacity,builder,gdate,grmembers}= req.body;
  const gr= new Group({gname,gcapacity,builder,gdate,grmembers})
  gr.save().then(()=>{
    res.json({message:'Stored Successsfully..'})
  }).catch((err)=>{
    console.log(err);
  })
})

app.get('/getGrData',(req,res)=>{
  Group.find().then((grData)=>{
    res.json(grData)
    // console.log(grData);
    console.log('GROUP data retrived from db');
  }).catch((err)=>{
    console.log(err);
  })
})

app.use(express.static("public"));

  const connectedUsers = {};
  // const rooms = {}; // Store users by room IDs


const RoomSchema = new mongoose.Schema({
  roomId: String,
  roomPassword: String,
  createdAt: {
      type: Date,
      default: Date.now,
      expires: '1d'  // Optional: auto-delete after 1 day
  }
});

const Room = mongoose.model('Room', RoomSchema);

// API to create a room
app.post('/create-room', async (req, res) => {
  const { roomId, roomPassword } = req.body;

  if (!roomId || !roomPassword) {
    return res.status(400).json({ success: false, message: 'Room ID and password are required' });
  }

  try {
    // Check if roomId already exists (optional to prevent duplicates)
    const existingRoom = await Room.findOne({ roomId });
    if (existingRoom) {
      return res.status(409).json({ success: false, message: 'Room ID already exists' });
    }

    // Save new room
    const newRoom = new Room({ roomId, roomPassword });
    await newRoom.save();

    return res.status(201).json({ success: true, message: 'Room created successfully', roomId });
  } catch (error) {
    console.error('Error creating room:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.post('/check-room', async (req, res) => {
  const { roomId, roomPassword } = req.body;
  console.log("roomdtat sent from front", roomId, roomPassword );
  
  // Check if both roomId and password are provided
  if (!roomId || !roomPassword) {
    return res.status(400).json({
      success: false,
      message: 'Room ID and password are required'
    });
  }

  try {
    const room = await Room.findOne({ roomId });

    if (room) {
      console.log("the fetched room is",room);
      
      // Validate password
      if (room.roomPassword === roomPassword) {
        // Room found and password matches
        return res.status(200).json({
          success: true,
          roomId: room.roomId,  // Only send roomId, not password
          message: 'Room verified successfully'
        });
      } else {
        // Incorrect password
        return res.status(401).json({
          success: false,
          message: 'Incorrect password'
        });
      }
    } else {
      // Room does not exist
      return res.status(404).json({
        success: false,
        message: 'Room does not exist'
      });
    }

  } catch (error) {
    console.error("Error fetching room:", error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

const rooms = {};
const users = {};
const rooms2={};

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  
  // socket.on('join-user', (username,roomid,password) => {
  //   connectedUsers[socket.id] = username;
  //   io.emit('joined', connectedUsers,username);
  // });
  // const rooms = {};

// socket.on('join-user', ({ username, roomid, password }) => {
//     if (!rooms[roomid]) {
//         rooms[roomid] = {}; // Initialize room if it doesn't exist
//     }

//     rooms[roomid][socket.id] = { username, roomid, password }; 
//       // ✅ Prevent duplicate usernames in the room
//     //   if (!rooms[roomid].some(user => user.username === username)) {
//     //     rooms[roomid][socket.id] = { username, roomid, password };
//     // }

//   //   if (!rooms[roomid][socket.id]) {
//   //     rooms[roomid][socket.id] = { 
//   //         username, 
//   //         roomid,  // ✅ Make sure roomid is included
//   //         password // (If needed)
//   //     };
//   // }
//     socket.join(roomid); // Join the user to their specific room

//     // Notify only the users in the same room
//     io.to(roomid).emit('joined', rooms[roomid]);
//     console.log("its my log: ",rooms[roomid]);
//     // io.to(roomid).emit('joined', Object.values(rooms[roomid]));
//     // console.log("Users in the room:", Object.values(rooms[roomid]));
    
//     console.log(`User ${username} joined room ${roomid}`);
// });

socket.on('join-user', ({ username, roomid, password }) => {
  if (!rooms[roomid]) {
      rooms[roomid] = {}; // Initialize room if it doesn't exist
  }

  // ✅ Check if the user already exists (prevent duplicate usernames)
  // const existingUserSocketId = Object.keys(rooms[roomid]).find(
  //     (id) => rooms[roomid][id].username === username
  // );

  // if (existingUserSocketId && existingUserSocketId !== socket.id) {
  //   console.log("removing old socket:",existingUserSocketId);
    
  //     // If user exists, remove old entry
  //     delete rooms[roomid][existingUserSocketId];
  // }

  // ✅ Add user with the latest socket ID
  rooms[roomid][socket.id] = { username, roomid, password };

  socket.join(roomid); // Join the user to their specific room

  // Notify only the users in the same room
  io.to(roomid).emit('joined', rooms[roomid]);
  // console.log("Updated Room Data:", rooms[roomid]);

  console.log(`User ${username} joined room ${roomid} with ID: ${socket.id}`);
});



socket.on('register', ({ username, roomid }) => { 
  if (username && roomid) {
    users[username] = socket.id;
    socket.join(roomid);  // Make sure the user joins their room
    rooms2[roomid] = rooms2[roomid] || {};
    // rooms2[roomid][socket.id] = { username ,roomid};
     // ✅ Prevent overwriting an existing entry
  //    if (!rooms2[roomid][socket.id]) {
  //     rooms2[roomid][socket.id] = { username,roomid };
  // }
  if (!rooms2[roomid][username]) {
    rooms2[roomid][username] = { socketId: socket.id, roomid };
  }

    console.log(`Registered user: ${username} with ID: ${socket.id} in Room: ${roomid}`);
  } else {
    console.log("No users have registered..");
  }
});

// socket.on('register', ({ username, roomid }) => {
//   if (username && roomid) {
//       users[username] = socket.id;
//       socket.join(roomid);  

//       // ✅ Only update rooms2 in register
//       if (!rooms[roomid]) {
//           rooms[roomid] = {};
//       }

//       if (!rooms[roomid][socket.id]) {
//           rooms[roomid][socket.id] = { username, roomid };
//       }

//       console.log(`Registered user: ${username} with ID: ${socket.id} in Room: ${roomid}`);
//   } else {
//       console.log("No users have registered..");
//   }
// });

// socket.on('join-user', ({ username, roomid, password }) => {
//   if (rooms[roomid] && rooms[roomid][socket.id]) {
//       // ✅ No need to modify rooms, just notify others
//       io.to(roomid).emit('joined', rooms[roomid]);
//       console.log(`User ${username} rejoined Room ${roomid}`);
//   } else {
//       console.log(`🚨 Error: User ${username} not found in Room ${roomid}`);
//   }
// });



  socket.on('offer', (data) => {
    io.to(data.to).emit('offer', { from: socket.id, offer: data.offer });
  });

  socket.on('answer', (data) => {
    io.to(data.to).emit('answer', { from: socket.id, answer: data.answer });
  });

  socket.on('icecandidate', ({ candidate, to }) => {
    io.to(to).emit('icecandidate', { from: socket.id, candidate });
  });

      // Handle new note
    socket.on("newNoteAdded", ({ note, username, roomId }) => {
      // console.log(`Note from ${username} in ${roomId}: ${note}`);
  
      // Save note
      if (!allNotes[roomId]) allNotes[roomId] = [];
      allNotes[roomId].push(note);
  
      // Broadcast to others in room
      socket.to(roomId).emit("newNoteAdded", { note, username, roomId });
    });

     // 🔹 Handle File Upload Notification
     socket.on("newFileUploaded", ({ roomId, username ,file}) => {
      // console.log(`File uploaded in room ${roomId} by ${username},file ${file.name}`);

       // Save file
    if (!allFiles[roomId]) allFiles[roomId] = [];
    allFiles[roomId].push(file);

      // Notify all users in the same room except the sender
      socket.to(roomId).emit("newFileUploaded", { username , roomId, file});
  });

  socket.on('call-ended', (userId) => {
    io.to(userId).emit('call-ended', { from: socket.id });
  });

  socket.on('disconnect-video', () => {
    delete connectedUsers[socket.id];
    io.emit('joined', connectedUsers);
  });





  
  socket.on('msg-all', ({ message, sender, roomid }) => {
    if (rooms2[roomid] && rooms2[roomid][sender]) {
      socket.to(roomid).emit('message', sender, message);
      // console.log(`Message "${message}" sent from ${sender} to Room ${roomid}`);
    } else {
      console.log(`User ${sender} is not in Room ${roomid} with ID: ${socket.id}`);
    }
  });
  
//   socket.on('msg-all', ({ message, sender, roomid }) => {
//     if (rooms[roomid]) {
//         // Find the sender's socket ID from the stored room data
//         const senderSocketId = Object.keys(rooms[roomid]).find(
//             (socketId) => rooms[roomid][socketId].username === sender
//         );

//         if (senderSocketId) {
//            // Log all sockets in the room before emitting
//            io.in(roomid).fetchSockets().then(sockets => {
//             console.log(`Users in Room ${roomid}:`, sockets.map(s => s.id));
//         });
//             io.to(roomid).emit('message', sender, message);
//             console.log(`Message "${message}" sent from ${sender} to Room ${roomid}`);
//         } else {
//             console.log(`User ${sender} is not in Room ${roomid}`);
//         }
//     } else {
//         console.log(`Room ${roomid} does not exist`);
//     }
// });


// socket.on('register', (username) => {
//   if(username){
//     users[username] = socket.id;
//   console.log(`Registered users:`,users);
  
//   console.log(`Registered user: ${username} with ID: ${socket.id}`);
//   }else{
//    console.log("No users have registerd..");
// }
// });

// Message to all users in the same room
// socket.on('msg-all', ({ message, sender, roomid }) => {
//   if (rooms[roomid]) {
//       io.to(roomid).emit('message', sender, message);
//       console.log(`Message "${message}" sent from ${sender} to Room ${roomid}`);
//   }
// });

// Private message within the same room
socket.on('private-message', ({ target, message, sender, roomid }) => {
  if (rooms[roomid]) {
      const targetSocketId = Object.keys(rooms[roomid]).find(id => rooms[roomid][id].username === target);
      if (targetSocketId) {
          io.to(targetSocketId).emit('message', sender, message);
          console.log(`Message sent from ${sender} to ${target} in Room ${roomid}: ${message}`);
      } else {
          console.log(`User ${target} not found in Room ${roomid}.`);
      }
  }
});

// Group message within the same room
socket.on('group-message', ({ groupMembers, sender, message, roomid }) => {
  if (rooms[roomid]) {
      groupMembers.forEach(target => {
          const targetSocketId = Object.keys(rooms[roomid]).find(id => rooms[roomid][id].username === target);
          if (targetSocketId) {
              io.to(targetSocketId).emit('message', sender, message);
              console.log(`Message sent from ${sender} to ${target} in Room ${roomid}: ${message}`);
          } else {
              console.log(`User ${target} not found in Room ${roomid}.`);
          }
      });
  }
});

// Handle user disconnect
socket.on('disconnect', () => {
  Object.keys(rooms).forEach(roomid => {
      if (rooms[roomid][socket.id]) {
          delete rooms[roomid][socket.id]; // Remove user from room
          const usersList = Object.values(rooms[roomid]).map(user => ({ username: user.username }));
          io.to(roomid).emit('joined', usersList); // Update room users
      }
  });
  console.log(`Client disconnected: ${socket.id}`);

});
});
server.listen(port, () => {
  console.log(`Server running on ${port}`);
});
