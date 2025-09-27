const OLLAMA_URL = 'http://127.0.0.1:11434/api/generate';
const MODEL_NAME = 'llama3.2';

// Original non-streaming function (keep for fallback)
export const sendMessageToAI = async (prompt) => {
  try {
    const response = await fetch(OLLAMA_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: MODEL_NAME,
        prompt: prompt,
        stream: false
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('AI Service Error:', error);
    throw error;
  }
};

// NEW: Streaming function with callback
export const sendMessageToAIStreaming = async (prompt, onChunk, onComplete, onError) => {
  try {
    const response = await fetch(OLLAMA_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: MODEL_NAME,
        prompt: prompt,
        stream: true // Enable streaming
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullResponse = '';

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n').filter(line => line.trim());
      
      for (const line of lines) {
        try {
          const parsed = JSON.parse(line);
          
          if (parsed.response) {
            fullResponse += parsed.response;
            // Call the callback with the new chunk
            onChunk(parsed.response, fullResponse);
          }
          
          // Check if this is the final chunk
          if (parsed.done) {
            onComplete(fullResponse);
            return fullResponse;
          }
        } catch (e) {
          // Skip invalid JSON lines
          continue;
        }
      }
    }

    onComplete(fullResponse);
    return fullResponse;
  } catch (error) {
    console.error('AI Service Streaming Error:', error);
    onError(error);
    throw error;
  }
};

// Future: Add more AI service functions
export const checkOllamaStatus = async () => {
  try {
    const response = await fetch('http://127.0.0.1:11434/api/tags');
    return response.ok;
  } catch {
    return false;
  }
};

export const getAvailableModels = async () => {
  try {
    const response = await fetch('http://127.0.0.1:11434/api/tags');
    const data = await response.json();
    return data.models || [];
  } catch {
    return [];
  }
};