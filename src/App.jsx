import React, {useState} from 'react';
const App = () => {
    const [input,setInput] = useState('');
    const [response, setResponse] = useState('');

    const handleSend = () => {
        setResponse(`You said: ${input}`);
        setInput('');
    };

  return (
    <div style={{padding:'20x' , fontFamily: 'Arial'}}>
      <h1>AI tutor</h1>
      <div>
        <textarea
            rows="4"
            cols="50"
            placeholder="Type your question here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
        />
        <br />
        <div style={{marginTop:'10x'}}>
            <button onClick={handleSend}>Send</button>
        </div>
        <div style={{ marginTop: '20px', whiteSpace: 'pre-wrap' }}>
            <strong>AI Response:</strong>
        <div>{response}</div>
      </div>
      </div>
    </div>
  );
}
export default App;