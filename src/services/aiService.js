const OLLAMA_URL = 'http://127.0.0.1:11434/api/generate';
const MODEL_NAME = 'llama3.2';

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