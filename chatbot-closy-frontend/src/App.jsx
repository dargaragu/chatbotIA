import { useState } from "react";
import axios from "axios";
import "./styles.css";

function App() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    const sendMessage = async () => {
        if (!input.trim()) return;

        // Agrega el mensaje del usuario
        const newMessages = [...messages, { text: input, sender: "user" }];
        setMessages(newMessages);

        try {
            const response = await axios.post("http://localhost:3000/api/chat", {
                mensaje: input,
            });

            // Agrega la respuesta del bot después de recibir la respuesta
            setMessages([...newMessages, { text: response.data.respuesta, sender: "bot" }]);
        } catch (error) {
            console.error("Error en la API", error);
        }

        setInput(""); // Limpia el input
    };

    return (
        <div className="chat-container">
            <h1 style={{ textAlign: "center", fontSize: "24px" }}>Chatbot Closy</h1>

            <div className="chat-box">
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.sender === "user" ? "user-message" : "bot-message"}`}>
                        {msg.text}
                    </div>
                ))}
            </div>

            <div className="input-container">
                <input
                    type="text"
                    placeholder="Escribe un mensaje..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                />
                <button onClick={sendMessage}>Enviar</button>
            </div>
        </div>
    );
}

export default App;


