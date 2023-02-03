//https://socket.io/docs/v4/server-initialization/

const http = require('http').createServer((req, res) => {
    const headers = {
        'Access-Control-Allow-Origin': '*', /* @dev First, read about security */
        'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
        'Access-Control-Max-Age': 2592000, // 30 days
        /** add other headers as per requirement */
    };

    if (req.method === 'OPTIONS') {
        res.writeHead(204, headers);
        res.end();
        return;
    }

    if (['GET', 'POST'].indexOf(req.method) > -1) {
        res.writeHead(200, headers);
        res.end('Hello World');
        return;
    }

    res.writeHead(405, headers);
    res.end(`${req.method} is not allowed for the request.`);
})


const io = require('socket.io')(http);
const port = process.env.PORT || 3000;


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
    console.log(`Socket.IO server running port ${port}`);
});