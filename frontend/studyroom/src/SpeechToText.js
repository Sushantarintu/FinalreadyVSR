import React, { useState } from "react";
import { ReactMic } from "react-mic";
import axios from "axios";

const SpeechToText = () => {
    const [recording, setRecording] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [audioBlob, setAudioBlob] = useState(null);

    // Start Recording
    const startRecording = () => {
        setRecording(true);
    };

    // Stop Recording
    const stopRecording = () => {
        setRecording(false);
    };

    // Handle Audio Data
    const onStop = (recordedBlob) => {
        console.log("Recorded Blob:", recordedBlob);
        setAudioBlob(recordedBlob.blob);
    };

    // Send Audio to Backend
    const sendAudioToBackend = async () => {
        if (!audioBlob) {
            alert("No audio recorded!");
            return;
        }

        const formData = new FormData();
        formData.append("audio", audioBlob, "audio.wav");

        try {
            const response = await axios.post(
                "http://localhost:10000/api/speech-to-text",
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            setTranscript(response.data.text);
        } catch (error) {
            console.error("Error converting speech:", error);
            setTranscript("Error processing speech.");
        }
    };

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h2>Speech-to-Text Converter</h2>

            <ReactMic
                record={recording}
                onStop={onStop}
                mimeType="audio/wav"
                strokeColor="#000000"
                backgroundColor="#f3f3f3"
            />

            <div style={{ marginTop: "10px" }}>
                <button onClick={startRecording} disabled={recording}>🎤 Start Recording</button>
                <button onClick={stopRecording} disabled={!recording}>🛑 Stop Recording</button>
                <button onClick={sendAudioToBackend} disabled={!audioBlob}>📤 Convert Speech</button>
            </div>

            {transcript && (
                <div style={{ marginTop: "20px", fontSize: "18px" }}>
                    <strong>Transcription:</strong>
                    <p>{transcript}</p>
                </div>
            )}
        </div>
    );
};

export default SpeechToText;
