var cors = require('cors')
const app = require('express')();



const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 80;

app.options('*', cors())

// const { subtle } = globalThis.crypto;
// async function generateEcKey(namedCurve = 'P-521') {
//     const {
//         publicKey,
//         privateKey,
//     } = await subtle.generateKey({
//         name: 'ECDSA',
//         namedCurve,
//     }, true, ['sign', 'verify']);

//     return { publicKey, privateKey };
// }
// generateEcKey().then(console.log)




//run a shell command to encode two qr codes
const { exec } = require("child_process");
const hostname = Object.values(require('os').networkInterfaces()).reduce((r, list) => r.concat(list.reduce((rr, i) => rr.concat(i.family === 'IPv4' && !i.internal && i.address || []), [])), [])
exec(`qrencode -o transfer.png -s 16 "http://${hostname}/QR"`)
exec(`qrencode -o qr.png -s 16 "http://${hostname}"`)



app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/transfer', (req, res) => {
    res.sendFile(__dirname + '/transfer.png');
});

app.get('/QR', (req, res) => {
    res.sendFile(__dirname + '/qr.png');
});

io.on('connection', (socket) => {
    socket.on('chat message', msg => {
        io.emit('chat message', msg);
    });
});

http.listen(port, () => {
    console.log(`Socket.IO server running at http://${hostname}:${port}/`);
});