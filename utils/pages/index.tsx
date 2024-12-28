import { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";

let socket: Socket | undefined;

export default function Home() {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<string[]>([]);

    useEffect(() => {
        fetch("/api/socket"); // Initialize the socket server

        socket = io();

        socket.on("chat message", (msg: string) => {
            setMessages((prevMessages) => [...prevMessages, msg]);
        });

        return () => {
            if (socket) {
                socket.disconnect();
            }
        };
    }, []);

    const sendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (message && socket) {
            socket.emit("chat message", message);
            setMessage("");
        }
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", fontFamily: "Arial, sans-serif" }}>
            <h1>Chat App</h1>
            <ul style={{ listStyle: "none", padding: 0, overflowY: "scroll", maxHeight: "60vh", width: "100%", maxWidth: "500px", border: "1px solid #ddd", borderRadius: "8px", marginBottom: "10px" }}>
                {messages.map((msg, index) => (
                    <li key={index} style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>{msg}</li>
                ))}
            </ul>
            <form onSubmit={sendMessage} style={{ display: "flex", width: "100%", maxWidth: "500px" }}>
                <input
                    style={{ flexGrow: 1, padding: "10px", borderRadius: "4px", border: "1px solid #ddd", marginRight: "5px" }}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                />
                <button type="submit" style={{ padding: "10px", borderRadius: "4px", border: "none", backgroundColor: "#007bff", color: "white" }}>
                    Send
                </button>
            </form>
        </div>
    );
}