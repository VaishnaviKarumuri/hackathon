// import React, { useState, useRef } from "react";
// import axios from "axios";

// const VoiceSearch = () => {
//   const [transcript, setTranscript] = useState("");
//   const [products, setProducts] = useState([]);
//   const [isRecording, setIsRecording] = useState(false);
//   const mediaRecorderRef = useRef(null);
//   const audioChunksRef = useRef([]);

//   const startRecording = async () => {
//     setIsRecording(true);
//     audioChunksRef.current = [];

//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       mediaRecorderRef.current = new MediaRecorder(stream);

//       mediaRecorderRef.current.ondataavailable = (event) => {
//         if (event.data.size > 0) {
//           audioChunksRef.current.push(event.data);
//         }
//       };

//       mediaRecorderRef.current.onstop = async () => {
//         const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
//         const formData = new FormData();
//         formData.append("audio", audioBlob);

//         try {
//           // Send audio to Flask backend for transcription
//           const response = await axios.post("http://127.0.0.1:5000/transcribe", formData);
//           setTranscript(response.data.text);

//           // Search products using the transcribed text
//           const searchResponse = await axios.post("http://127.0.0.1:5000/search", {
//             query: response.data.text,
//           });

//           setProducts(searchResponse.data.results);
//         } catch (error) {
//           console.error("Error:", error);
//         }
//       };

//       mediaRecorderRef.current.start();
//     } catch (error) {
//       console.error("Error accessing microphone:", error);
//       setIsRecording(false);
//     }
//   };

//   const stopRecording = () => {
//     setIsRecording(false);
//     if (mediaRecorderRef.current) {
//       mediaRecorderRef.current.stop();
//     }
//   };

//   return (
//     <div style={{ textAlign: "center", marginTop: "50px" }}>
//       <h2>AI Voice Search</h2>
//       <button onClick={isRecording ? stopRecording : startRecording} style={{ fontSize: "18px", padding: "10px" }}>
//         {isRecording ? "Stop Recording" : "Start Recording"}
//       </button>
//       <p><strong>Transcript:</strong> {transcript}</p>
      
//       <h3>Search Results:</h3>
//       {products.length > 0 ? (
//         <ul>
//           {products.map((product, index) => (
//             <li key={index}>
//               <strong>{product.name}</strong> - {product.description} (${product.price})
//             </li>
//           ))}
//         </ul>
//       ) : (
//         <p>No products found</p>
//       )}
//     </div>
//   );
// };          #this code is with 2 endpoints separately for search in db




// export default VoiceSearch;

// import React, { useState } from "react";

// const VoiceSearch = ({ onTranscription }) => {
//     const [isRecording, setIsRecording] = useState(false);
//     let mediaRecorder;
//     let audioChunks = [];

//     const startRecording = async () => {
//         try {
//             const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//             mediaRecorder = new MediaRecorder(stream);

//             mediaRecorder.ondataavailable = (event) => {
//                 audioChunks.push(event.data);
//             };

//             mediaRecorder.onstop = async () => {
//                 const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
//                 const formData = new FormData();
//                 formData.append("audio", audioBlob, "recording.wav");

//                 // Send to Flask API
//                 const response = await fetch("http://127.0.0.1:5000/transcribe", {
//                     method: "POST",
//                     body: formData,
//                 });

//                 const result = await response.json();
//                 onTranscription(result.transcript || "No transcription available", result.matched_products || []);
//             };

//             mediaRecorder.start();
//             setIsRecording(true);
//             console.log("Recording started...");
//         } catch (error) {
//             console.error("Error accessing microphone:", error);
//         }
//     };

//     const stopRecording = () => {
//         if (mediaRecorder) {
//             mediaRecorder.stop();
//             setIsRecording(false);
//             console.log("Recording stopped.");
//         }
//     };

//     return (
//         <div style={{ textAlign: "center", padding: "20px" }}>
//             <button onClick={isRecording ? stopRecording : startRecording} style={{ padding: "10px 20px", fontSize: "16px" }}>
//                 {isRecording ? "Stop Recording" : "Start Recording"}
//             </button>
//         </div>
//     );
// };

//export default VoiceSearch;

import React, { useState, useRef } from "react";

const VoiceSearch = ({ onTranscription }) => {
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                audioChunksRef.current.push(event.data);
            };

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
                sendAudioToBackend(audioBlob);
            };

            mediaRecorder.start();
            setIsRecording(true);
        } catch (error) {
            console.error("Error accessing microphone:", error);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const sendAudioToBackend = async (audioBlob) => {
        const formData = new FormData();
        formData.append("audio", audioBlob, "recording.wav");

        try {
            const response = await fetch("http://127.0.0.1:5000/transcribe", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            if (data.transcript) {
                onTranscription(data.transcript, data.matched_products);
            } else {
                onTranscription("No transcription available", []);
            }
        } catch (error) {
            console.error("Error sending audio:", error);
        }
    };

    return (
        <div>
            {isRecording ? (
                <button onClick={stopRecording}>Stop Recording</button>
            ) : (
                <button onClick={startRecording}>Start Recording</button>
            )}
        </div>
    );
    

};

export default VoiceSearch;


// import React, { useState, useRef } from "react";

// const VoiceSearch = ({ onTranscription }) => {
//     const [isRecording, setIsRecording] = useState(false);
//     const mediaRecorderRef = useRef(null);
//     const audioChunksRef = useRef([]);

//     const startRecording = async () => {
//         try {
//             const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//             const mediaRecorder = new MediaRecorder(stream);
//             mediaRecorderRef.current = mediaRecorder;

//             mediaRecorder.ondataavailable = async (event) => {
//                 if (event.data.size > 0) {
//                     sendAudioToBackend(event.data);  // Send audio while recording
//                 }
//             };

//             mediaRecorder.start(1000);  // Capture audio every 1 second
//             setIsRecording(true);
//         } catch (error) {
//             console.error("Error accessing microphone:", error);
//         }
//     };

//     const stopRecording = () => {
//         if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
//             mediaRecorderRef.current.stop();
//             setIsRecording(false);
//         }
//     };

//     const sendAudioToBackend = async (audioChunk) => {
//         const formData = new FormData();
//         formData.append("audio", audioChunk, "chunk.wav");

//         try {
//             const response = await fetch("http://127.0.0.1:5000/transcribe", {
//                 method: "POST",
//                 body: formData,
//             });

//             const data = await response.json();
//             if (data.transcript) {
//                 onTranscription(data.transcript, data.matched_products);
//             }
//         } catch (error) {
//             console.error("Error sending audio:", error);
//         }
//     };

//     return (
//         <div>
//             {isRecording ? (
//                 <button onClick={stopRecording}>Stop Recording</button>
//             ) : (
//                 <button onClick={startRecording}>Start Recording</button>
//             )}
//         </div>
//     );
// };

// export default VoiceSearch;

