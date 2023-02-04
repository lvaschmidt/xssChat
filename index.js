var cors = require('cors');
const express = require("express");
const app = express();

const https = require("https");
const fs = require("fs");

const privateKey = fs.readFileSync('/etc/letsencrypt/live/xsschat.com/privkey.pem');
const certificate = fs.readFileSync('/etc/letsencrypt/live/xsschat.com/fullchain.pem');
const credentials = { key: privateKey, cert: certificate };

const httpsServer = https.Server(credentials, app);
const io = require('socket.io')(httpsServer);
const port = process.env.PORT || 443;

app.options('*', cors());
app.use(express.static('public'))


io.on('connection', (socket) => {
    let room = null;
    socket.on('join', requestedRoom => {
        room = requestedRoom;
        socket.join(requestedRoom);
    });
    socket.on('chat', (msg) => {
        io.to(room).emit('chat', msg);
    });
    socket.on('script', (msg) => {
        io.to(room).emit('script', msg);
    });
});

httpsServer.listen(port, () => {
    console.log(`Socket.IO server running of port ${port}!`);
});