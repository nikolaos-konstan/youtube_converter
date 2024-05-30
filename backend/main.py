from flask import Flask, request, jsonify, send_file, make_response
from flask_cors import CORS
import os
import pytube
from moviepy.editor import AudioFileClip

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})


def download_youtube_video(url):
    youtube = pytube.YouTube(url)
    audio = youtube.streams.filter(only_audio=True).first()
    audio_path = audio.download(filename="temp_audio.webm")
    return audio_path, youtube.title


def convert_to_mp3(audio_path, title):
    audio = AudioFileClip(audio_path)
    mp3_path = title + ".mp3"
    audio.write_audiofile(mp3_path)
    os.remove(audio_path)
    return mp3_path


@app.route("/convert", methods=["POST"])
def convert():
    data = request.get_json()
    youtube_link = data["url"]
    audio_path, title = download_youtube_video(youtube_link)
    mp3_path = convert_to_mp3(audio_path, title)
    response = make_response(send_file(mp3_path, as_attachment=True))
    print("Title", title)
    response.headers["Title"] = title
    response.headers["Access-Control-Expose-Headers"] = "Title"
    return response


if __name__ == "__main__":
    app.run(debug=True)
