import React, { useState } from 'react';
// Import fetch

const App = () => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');

  const handleSend = async () => {
    if (input.trim() === '') return;

    setResponse('Thinking...');

    try {
      const res = await fetch('http://127.0.0.1:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama3.2',  // or your pulled model
          prompt: input,
          stream: false
        })
      });

      const data = await res.json();
      setResponse(data.response);
    } catch (err) {
      console.error(err);
      setResponse('Error contacting AI model. Is Ollama running?');
    }

    setInput('');
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>AI Tutor</h1>

      <textarea
        rows="4"
        cols="50"
        placeholder="Ask your question..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <div style={{ marginTop: '10px' }}>
        <button onClick={handleSend}>Send</button>
      </div>

      <div style={{ marginTop: '20px', whiteSpace: 'pre-wrap' }}>
        <strong>AI Response:</strong>
        <div>{response}</div>
      </div>
    </div>
  );
};

export default App;
