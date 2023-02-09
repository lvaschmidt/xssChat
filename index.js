var cors = require('cors');
const express = require("express");
const compression = require('compression'); //depends on: compression
const app = express();
app.use(compression());

const https = require("https");
const fs = require("fs");

const privateKey = fs.readFileSync('/etc/letsencrypt/live/xsschat.com/privkey.pem');
const certificate = fs.readFileSync('/etc/letsencrypt/live/xsschat.com/fullchain.pem');
const credentials = { key: privateKey, cert: certificate };

const httpsServer = https.Server(credentials, app);
const io = require('socket.io')(httpsServer);
const port = process.env.PORT || 443;

// redirect any page from http to https
const http = require('http')

const httpServer = http.createServer((req, res, next) => {
    if (process.env.NODE_ENV !== 'development' && process.env.NODE_ENV !== 'test') {
        res.writeHead(301, { Location: `https://${req.headers.host}${req.url}` });
        res.end()
    } else {
        next();
    }
}).listen(80);

app.options('*', cors());
app.use(express.static('public'))


io.on('connection', (socket) => {
    let room = null;
    socket.on('join', data => {
        room = data.room;
        socket.join(room);
        io.to(room).emit('join', data.name);
    });
    socket.on('message', (msg) => {
        io.to(room).emit('message', msg);
    });
});

httpsServer.listen(port, () => {
    console.log(`Socket.IO server running of port ${port}!`);
});
