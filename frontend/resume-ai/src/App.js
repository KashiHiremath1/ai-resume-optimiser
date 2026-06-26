import React from "react";
import { useState } from "react";

function App() {
  const [text, setText] = useState("");
  const [output, setOutput] = useState("");

  const handleSubmit = async () => {
    setOutput("");

    const res = await fetch("http://localhost:5000/stream-summarize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    const reader = res.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      setOutput((prev) => prev + chunk);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>AI Resume Analyzer</h2>

      <textarea
        rows={6}
        cols={60}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <br />

      <button onClick={handleSubmit}>Analyze</button>

      <pre>{output}</pre>
    </div>
  );
}

export default App;