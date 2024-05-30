import { useState } from "react";
import "./App.css";

function App() {
  const [url, setUrl] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
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
      console.log("Title:", title); // Debugging line
      a.download = title + ".mp3";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } else {
      console.error("Download failed");
    }
  };

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter YouTube URL"
        />
        <button type="submit">Convert</button>
      </form>
    </div>
  );
}

export default App;
