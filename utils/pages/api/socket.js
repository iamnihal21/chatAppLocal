import { Server } from "socket.io";
import dbConnect from "../../utils/dbConnect";
import Message from "../../models/message";

export default async function handler(req, res) {
    await dbConnect(); // Connect to MongoDB

    if (!res.socket.server.io) {
        const io = new Server(res.socket.server);
        res.socket.server.io = io;

        io.on("connection", async (socket) => {
            console.log("A user connected");

            // Load previous messages
            const messages = await Message.find({}).sort({ timestamp: 1 });
            socket.emit("load messages", messages);

            // Save and broadcast new messages
            socket.on("chat message", async (msg) => {
                const message = new Message({ text: msg });
                await message.save();
                io.emit("chat message", msg);
            });

            socket.on("disconnect", () => {
                console.log("A user disconnected");
            });
        });
    }
    res.end();
}
