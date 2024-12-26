// server.js
const express = require('express');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/time', (req, res) => {
    const timezone = req.query.timezone || 'Europe/Paris'; // Default to CEST if no timezone is provided
    const time = new Date().toLocaleString('en-US', { timeZone: timezone, hour12: false });
    res.json({ time: time });
});

io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('uploadFile', (fileContent) => {
        const capitalizedContent = fileContent.toUpperCase();
        socket.emit('fileProcessed', capitalizedContent);
    });

    socket.on('sendMessage', (message) => {
        const logMessage = `${new Date().toISOString()}: ${message}\n`;
        console.log(logMessage);

        // Save the message to a log file
        fs.appendFile('messages.log', logMessage, (err) => {
            if (err) {
                console.error('Failed to save message to log file:', err);
            }
        });
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
