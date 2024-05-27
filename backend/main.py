from flask import Flask, request, jsonify
import os
import pytube
from moviepy.editor import AudioFileClip

app = Flask(__name__)


def download_youtube_video(url):
    youtube = pytube.YouTube(url)
    audio = youtube.streams.filter(only_audio=True).first()
    audio_path = audio.download(filename="temp_audio.webm")
    return audio_path, youtube.title


def convert_to_mp3(audio_path, title):
    audio = AudioFileClip(audio_path)
    mp3_path = os.path.join(os.path.dirname(audio_path), title + ".mp3")
    audio.write_audiofile(mp3_path)
    os.remove(audio_path)  # remove the original audio file
    return mp3_path


@app.route("/convert", methods=["POST"])
def convert():
    data = request.get_json()
    youtube_link = data["url"]
    audio_path, title = download_youtube_video(youtube_link)
    mp3_path = convert_to_mp3(audio_path, title)
    return jsonify(
        {
            "status": "success",
            "message": "Audio downloaded and converted to MP3 successfully!",
            "mp3_path": mp3_path,
        }
    )


if __name__ == "__main__":
    app.run(debug=True)
