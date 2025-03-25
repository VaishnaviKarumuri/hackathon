# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import sqlite3
# import whisper
# import io
# from pydub import AudioSegment

# app = Flask(__name__)
# CORS(app)

# # Load Whisper Model Locally
# whisper_model = whisper.load_model("small")

# # Function to Search in SQLite Database
# def search_products_in_db(query):
#     conn = sqlite3.connect("products.db")
#     cursor = conn.cursor()
#     cursor.execute("SELECT name, description, price FROM products WHERE name LIKE ? OR description LIKE ?", (f"%{query}%", f"%{query}%"))
#     results = cursor.fetchall()
#     conn.close()

#     return [{"name": row[0], "description": row[1], "price": row[2]} for row in results]

# @app.route("/transcribe", methods=["POST"])
# def transcribe_audio():
#     """Transcribes real-time audio input using Whisper (local)."""
#     if "audio" not in request.files:
#         return jsonify({"error": "No audio file provided"}), 400

#     audio_file = request.files["audio"]

#     try:
#         # Convert audio to WAV (Whisper requires WAV format)
#         audio = AudioSegment.from_file(io.BytesIO(audio_file.read()))
#         audio = audio.set_channels(1).set_frame_rate(16000)
#         wav_io = io.BytesIO()
#         audio.export(wav_io, format="wav")
#         wav_io.seek(0)

#         # Save audio locally for Whisper
#         with open("temp_audio.wav", "wb") as f:
#             f.write(wav_io.read())

#         # Transcribe using Whisper
#         result = whisper_model.transcribe("temp_audio.wav")

#         return jsonify({"text": result["text"]})

#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

# @app.route("/search", methods=["POST"])
# def search_products():
#     """Searches products in the SQLite database."""
#     data = request.get_json()
#     query = data.get("query", "").lower()

#     if not query:
#         return jsonify({"error": "No search query provided"}), 400

#     results = search_products_in_db(query)

#     return jsonify({"query": query, "results": results})

# if __name__ == "__main__":
#     app.run(debug=True, port=5000)



#works
from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import whisper
import io
from pydub import AudioSegment

app = Flask(__name__)
CORS(app)

# Load Whisper Model Locally
whisper_model = whisper.load_model("small.en")

# Function to Search in SQLite Database
def search_products_in_db(query):
    """Search for products in SQLite database based on the transcription text."""
    conn = sqlite3.connect("products.db")
    cursor = conn.cursor()
    cursor.execute("SELECT name, description, price FROM products WHERE name LIKE ? OR description LIKE ?", 
                   (f"%{query}%", f"%{query}%"))
    results = cursor.fetchall()
    conn.close()

    return [{"name": row[0], "description": row[1], "price": row[2]} for row in results]

@app.route("/transcribe", methods=["POST"])
def transcribe_and_search():
    """Transcribes audio input and searches for matching products."""
    if "audio" not in request.files:
        return jsonify({"error": "No audio file provided"}), 400

    audio_file = request.files["audio"]

    try:
        # Convert audio to WAV (Whisper requires WAV format)
        audio = AudioSegment.from_file(io.BytesIO(audio_file.read()))
        audio = audio.set_channels(1).set_frame_rate(16000)
        wav_io = io.BytesIO()
        audio.export(wav_io, format="wav")
        wav_io.seek(0)

        # Save audio locally for Whisper
        with open("temp_audio.wav", "wb") as f:
            f.write(wav_io.read())

        # Transcribe using Whisper
        result = whisper_model.transcribe("temp_audio.wav")
        transcript_text = result["text"].lower()

        # Search for products using the transcribed text
        matched_products = search_products_in_db(transcript_text)

        return jsonify({
            "transcript": transcript_text,
            "matched_products": matched_products
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)
