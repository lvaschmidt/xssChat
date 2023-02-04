var cors = require('cors')
const app = require('express')();



const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 80;

app.options('*', cors())

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
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