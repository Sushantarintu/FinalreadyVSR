// const express = require('express');
// const { createServer } = require('http');
// const { Server } = require('socket.io');
// const fileURLToPath = require('url');
// const path = require('path');
// const cors = require('cors')

// const app = express();
// const server = createServer(app);
// const io = new Server(server, {
//     cors: {
//         origin: 'http://localhost:3000', // Allow requests from your React app
//         methods: ['GET', 'POST'],       // Allow specific HTTP methods
//     }});
// const allusers = {};

// // Resolve directory path
// // const __dirname = dirname(fileURLToPath(import.meta.url));

// // Serve static files from "public" directory
// app.use(express.static("public"));

// // Route to serve React app
// // app.get("/", (req, res) => {
// //   res.sendFile(path.join(__dirname, "public", "index.html"));
// // });

// // WebSocket handling
// io.on("connection", (socket) => {
//     console.log(`User connected: ${socket.id}`);

//     // Handle user joining
//     socket.on("join-user", (username) => {
//       console.log(`${username} joined`);
//       allusers[username] = { username, id: socket.id };
//       io.emit("joined", allusers); // Notify all users about the new user
//     });
  
//     // Handle call offer
//     socket.on("offer", ({ from, to, offer }) => {
//       console.log(`Offer from ${from} to ${to}`);
//       io.to(allusers[to].id).emit("offer", { from, to, offer });
//     });
  
//     // Handle call answer
//     socket.on("answer", ({ from, to, answer }) => {
//       console.log(`Answer from ${from} to ${to}`);
//       io.to(allusers[from].id).emit("answer", { from, to, answer });
//     });
  
//     // Handle ICE candidates
//     socket.on("icecandidate", (candidate) => {
//       console.log(`ICE candidate received`);
//       socket.broadcast.emit("icecandidate", candidate); // Broadcast to peers
//     });
  
//     // Handle end call
//     socket.on("end-call", ({ from, to }) => {
//       io.to(allusers[to].id).emit("end-call", { from, to });
//     });
  
//     // Handle call ended
//     socket.on("call-ended", (caller) => {
//       const [from, to] = caller;
//       io.to(allusers[from].id).emit("call-ended", caller);
//       io.to(allusers[to].id).emit("call-ended", caller);
//     });
  
//     // Handle user disconnect
//     socket.on("disconnect", () => {
//       console.log(`User disconnected: ${socket.id}`);
//       for (const user in allusers) {
//         if (allusers[user].id === socket.id) {
//           delete allusers[user];
//           break;
//         }
//       }
//       io.emit("joined", allusers); // Update users list
//     });
//   });
  
//   // Start server
//   server.listen(9000, () => {
//     console.log("Server is running on http://localhost:9000");
//   });
  
