require("dotenv/config");
var cors = require("cors");
const express = require("express");
const compression = require("compression"); //depends on: compression
const app = express();
var privateKey = null;
var certificate = null;
const options = {
  maxHttpBufferSize: 1e8,
};
const fs = require("fs");
app.use(compression());
const https = require("https");

//Differentiate between development and production
if (process.env.NODE_ENV == "development") {
  privateKey = fs.readFileSync("certs/localhost.decrypted.key");
  certificate = fs.readFileSync("certs/localhost.crt");
} else {
  privateKey = fs.readFileSync("/etc/letsencrypt/live/xsschat.com/privkey.pem");
  certificate = fs.readFileSync(
    "/etc/letsencrypt/live/xsschat.com/fullchain.pem"
  );
}

const credentials = { key: privateKey, cert: certificate };
const httpsServer = https.Server(credentials, app);

const io = require("socket.io")(httpsServer, options);
const port = process.env.PORT || 443;

// redirect any page from http to https
const http = require("http");
const httpServer = http
  .createServer((req, res, next) => {
    res.writeHead(301, { Location: `https://${req.headers.host}${req.url}` });
    res.end();
  })
  .listen(80);

app.disable("x-powered-by");
app.use(express.static("public"));
app.use(cors({
  origin: ["https://xsschat.com", "https://beta.xsschat.com"]
}));

app.disable("x-powered-by");
app.options("*", cors(corsOptions));
app.use(express.static("public"));

io.on("connection", (socket) => {
  let room = null;
  socket.on("join", (data) => {
    room = data.room;
    socket.join(room);
    io.to(room).emit("join", data.name);
  });
  socket.on("message", (msg) => {
    io.to(room).emit("message", msg);
  });
});

httpsServer.listen(port, () => {
  console.log(`Socket.IO server running of port ${port}!`);
});
