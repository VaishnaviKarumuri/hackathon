
// import React from "react";
// import VoiceSearch from "./components/VoiceSearch";

// function App() {
//   return (
//     <div>
//       <VoiceSearch />
//     </div>
//   );
// }

// export default App;



// import React, { useState } from "react";

// function App() {
//     const [recording, setRecording] = useState(false);
//     const [transcript, setTranscript] = useState("");
//     const [products, setProducts] = useState([]);
//     const [audioBlob, setAudioBlob] = useState(null);

//     const startRecording = () => {
//         setRecording(true);
//         const mediaRecorder = new MediaRecorder(window.stream);
//         let audioChunks = [];

//         mediaRecorder.ondataavailable = (event) => {
//             if (event.data.size > 0) {
//                 audioChunks.push(event.data);
//             }
//         };

//         mediaRecorder.onstop = async () => {
//             const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
//             setAudioBlob(audioBlob);
//             await sendAudioToServer(audioBlob);
//         };

//         mediaRecorder.start();
//         setTimeout(() => {
//             mediaRecorder.stop();
//             setRecording(false);
//         }, 5000); // Stops recording after 5 seconds
//     };

//     const sendAudioToServer = async (audioBlob) => {
//         const formData = new FormData();
//         formData.append("audio", audioBlob, "audio.wav");

//         try {
//             const response = await fetch("http://127.0.0.1:5000/transcribe", {
//                 method: "POST",
//                 body: formData,
//             });

//             const data = await response.json();
//             setTranscript(data.transcript);
//             setProducts(data.matched_products || []);
//         } catch (error) {
//             console.error("Error sending audio:", error);
//         }
//     };

//     return (
//         <div style={{ textAlign: "center", padding: "20px" }}>
//             <h1>Voice Search for Products</h1>
            
//             <button onClick={startRecording} disabled={recording}>
//                 {recording ? "Recording..." : "Start Recording"}
//             </button>

//             <h2>Transcription:</h2>
//             <p>{transcript || "No transcript yet"}</p>

//             <h2>Matching Products:</h2>
//             {products.length > 0 ? (
//                 <ul>
//                     {products.map((product, index) => (
//                         <li key={index}>
//                             <strong>{product.name}</strong>: {product.description} - ${product.price}
//                         </li>
//                     ))}
//                 </ul>
//             ) : (
//                 <p>No products found</p>
//             )}
//         </div>
//     );
// }

// export default App;

import React, { useState } from "react";
import VoiceSearch from "./components/VoiceSearch";
import "./styles.css"; 

function App() {
    const [transcription, setTranscription] = useState("");
    const [products, setProducts] = useState([]);

    const handleTranscription = (text, matchedProducts) => {
        setTranscription(text);
        setProducts(matchedProducts);
    };

    return (
        <div className="container">
            <h1>Voice Search for Products</h1>
            <VoiceSearch onTranscription={handleTranscription} />

            <div className="transcription-box">
                <h2>Transcription:</h2>
                <p>{transcription || "Speak to search for products..."}</p>
            </div>

            <h2>Matched Products:</h2>
            {products.length > 0 ? (
                <ul className="products-list">
                    {products.map((product, index) => (
                        <li key={index}>
                            <strong>{product.name}</strong>: {product.description} - ${product.price}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No products found.</p>
            )}
        </div>
    );



}

export default App;

