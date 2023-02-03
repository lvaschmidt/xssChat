var cors = require('cors')
const app = require('express')();



const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 80;

app.options('*', cors())


//run a shell command to encode two qr codes
const { exec } = require("child_process");
const hostname = Object.values(require('os').networkInterfaces()).reduce((r, list) => r.concat(list.reduce((rr, i) => rr.concat(i.family === 'IPv4' && !i.internal && i.address || []), [])), [])
exec(`qrencode -o transfer.png -s 16 "http://${hostname}/QR"`)
exec(`qrencode -o qr.png -s 16 "http://${hostname}"`)



app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    let room = null;
    socket.on('join', requestedRoom => {
        room = requestedRoom;
        socket.join(requestedRoom);
    });
    socket.on('chat', (msg) => {
        io.to(room).emit('chat', msg);
    });
    socket.on('code', (msg) => {
        io.to(room).emit('code', msg);
    });
});

http.listen(port, () => {
    console.log(`Socket.IO server running at http://${hostname}:${port}/`);
});