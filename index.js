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

// redirect any page from http to https


const httpServer = http.createServer((req,res)=>{
  if (process.env.NODE_ENV !== 'development' && process.env.NODE_ENV !== 'test' && !isSecure(req)) {
    res.redirect(301, `https://${req.headers.host}${req.url}`);
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