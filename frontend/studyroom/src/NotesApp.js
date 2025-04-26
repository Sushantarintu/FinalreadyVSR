import React, { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("https://readyvsr.onrender.com"); // Connect to your socket server

const NotesApp = ({ roomId, username, setHasNewFile }) => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  // ---------- Real-time Listeners ----------
  useEffect(() => {
    // Listen for new files
    socket.on("newFileUploaded", ({ username: uploaderName, roomId: uploadedRoomId, file }) => {
      if (uploadedRoomId === roomId && uploaderName !== username) {
        console.log(`New file uploaded by ${uploaderName}: ${file.name}`);
        setFiles((prevFiles) => [...prevFiles, file]); // Add new file to state
        setHasNewFile(true); // Notify parent about new file
      }
    });

    // Listen for new notes
    socket.on("newNoteAdded", ({ note, username: senderName, roomId: senderRoomId }) => {
      if (senderRoomId === roomId && senderName !== username) {
        console.log(`New note added by ${senderName}: ${note}`);
        setNotes((prevNotes) => [...prevNotes, note]); // Add new note to state
      }
    });

    // Optional: Fetch existing files and notes when room is loaded
    fetchFiles();
    fetchNotes();

    // Clean up listeners on unmount
    return () => {
      socket.off("newFileUploaded");
      socket.off("newNoteAdded");
    };
  }, [roomId, setHasNewFile, username]);

  // ---------- Add New Note ----------
  const addNote = () => {
    if (newNote.trim() !== "") {
      const noteData = { note: newNote, username, roomId };
      setNotes((prevNotes) => [...prevNotes, newNote]); // Add to own state
      socket.emit("newNoteAdded", noteData); // Emit note to others
      setNewNote(""); // Clear input
    }
  };

  // ---------- Handle File Upload ----------
  const handleFileUpload = async (event) => {
    const uploadedFiles = Array.from(event.target.files);
    if (!uploadedFiles.length) return;

    setIsUploading(true);
    for (const uploadedFile of uploadedFiles) {
      const formData = new FormData();
      formData.append("file", uploadedFile);

      try {
        const response = await axios.post("https://readyvsr.onrender.com/upload-file", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (response.data && response.data.fileUrl && response.data.fileName) {
          const fileData = { name: response.data.fileName, url: response.data.fileUrl };

          setFiles((prevFiles) => [...prevFiles, fileData]); // Add to own state

          // Emit file to other users in room
          socket.emit("newFileUploaded", { roomId, username, file: fileData });

          console.log("File uploaded and emitted:", response.data.fileName);
        }
      } catch (error) {
        console.error("File upload failed:", error);
      }
    }
    setIsUploading(false);
  };

  // ---------- Fetch Existing Files (Optional) ----------
  const fetchFiles = async () => {
    try {
      const response = await axios.get(`https://readyvsr.onrender.com/files?roomId=${roomId}`);
      if (response.data) setFiles(response.data);
    } catch (error) {
      console.error("Failed to fetch files:", error);
    }
  };

  // ---------- Fetch Existing Notes (Optional) ----------
  const fetchNotes = async () => {
    try {
      const response = await axios.get(`https://readyvsr.onrender.com/notes?roomId=${roomId}`);
      if (response.data) setNotes(response.data);
    } catch (error) {
      console.error("Failed to fetch notes:", error);
    }
  };

  // ---------- Render ----------
  return (
    <div className="p-4 max-w-lg mx-auto">
      <div className="p-4 border rounded-lg shadow-md bg-white">
        {/* Notes Section */}
        <h2 className="text-xl font-bold mb-4">Notes</h2>
        <input
          type="text"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          className="border p-2 w-full mb-2 rounded"
          placeholder="Write a note..."
        />
        <button
          onClick={addNote}
          className="mb-4 w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded"
        >
          Add Note
        </button>
        <ul className="mb-4 max-h-40 overflow-y-auto">
          {notes.map((note, index) => (
            <li key={index} className="border p-2 mb-2 rounded" style={{color:"black"}}>{note}</li>
          ))}
        </ul>

        {/* File Sharing Section */}
        <h2 className="text-xl font-bold mb-4">File Sharing</h2>
        <input
          type="file"
          multiple
          onChange={handleFileUpload}
          className="mb-4"
        />
        {isUploading && <p className="text-gray-500 mb-2">Uploading...</p>}
        <ul className="max-h-40 overflow-y-auto">
          {files.map((file, index) => (
            <li key={index} className="border p-2 mb-2 rounded flex justify-between items-center">
              <a
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{color:"blue"}}
                className="text-blue-500 underline"
              >
                {file.name|| "Unnamed File"}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default NotesApp;
