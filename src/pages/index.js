import { useEffect, useState } from "react"


function MessageItem({message}) {
  const [text, setText] = useState(message.author === "human" ? message.text : "");

  useEffect(() => {
    setTimeout(() => {
      setText(message.text.slice(0, text.length + 1));
    }, 10);
  }, [text, message.text]);

  return (
    <div className="answer">
      <div className={`author author-${message.author}`}>
        {message.author}:
      </div>
      <div className="message">
        {text}
      </div>
    </div>
  )
}

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);

  const handleSubmit = async () => {
    if (prompt.trim().length === 0) {
      return;
    }

    setMessages((messages) => [...messages, {
      text: prompt.trim(),
      id: new Date().toISOString(),
      author: "human"
    }]);

    setPrompt("");
    const response =  await fetch("/api/completion", {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify({prompt: prompt.trim()})
    });

    const json = await response.json();

    if (response.ok) {
      console.log(json.result);

      setMessages((messages) => [...messages, {
        text: json.result,
        id: new Date().toISOString(),
        author: "ai"
      }]);
    } else {
      console.warn(json?.error?.message);
    }
  }

  return (
    <div className="container">
      <div className="inputContainer">
        <textarea
          onChange={(e) => {
            setPrompt(e.target.value);
          }} 
          value={prompt}
          placeholder="Ask a question" 
          rows={3} 
        />
        <button 
          onClick={handleSubmit}
          className="submit">Submit
        </button>
      </div>
      <div className="answers">
        {messages.map(message => 
          <MessageItem 
            key={message.id} 
            message={message} 
          />
        )}
      </div>
    </div>
  )
}
