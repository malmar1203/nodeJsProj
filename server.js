// server.js
const express = require('express');
const app = express();
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/time', (req, res) => {
    const cestTime = new Date().toLocaleString('en-US', { timeZone: 'Europe/Paris', hour12: false });
    res.json({ time: cestTime });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

