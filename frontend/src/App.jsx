import { useState } from "react";
import "./App.css";
import back from "../public/back.png";

function App() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(""); // Add this line

  const isValidYoutubeUrl = (url) => {
    const pattern = /^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+/;
    return pattern.test(url);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError(""); // Reset the error state
    const response = await fetch("http://localhost:5000/convert", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    });

    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const title = response.headers.get("Title");
      a.download = title + ".mp3";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } else {
      console.error("Download failed");
      setError("Download failed"); // Set the error state
    }
    setIsLoading(false);
  };

  return (
    <div className="App">
      <div className="icon-container">
        <img src={back} alt="Back icon" />
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter YouTube URL"
        />
        <div className={`loading-bar ${isLoading ? "loading" : ""}`}></div>
        <button type="submit" disabled={isLoading || !isValidYoutubeUrl(url)}>
          {isLoading ? "Converting..." : "Download MP3"}
        </button>
        {error && <p className="error">{error}</p>} {/* Add this line */}
      </form>
    </div>
  );
}

export default App;
