//choosing room
const roomcode = document.getElementById("roomcode");
const joinform = document.getElementById("joinform");
const overlay = document.getElementById("overlay");

//content
const chats = document.getElementById("chats");
const history = document.getElementById("scripthistory");

//inputs
const msgform = document.getElementById("msgform");
const input = document.getElementById("message");
const checkbox = document.getElementById("toggle");

var socket = io();

//join form overlay event handler
joinform.addEventListener('submit', function (e) {
    e.preventDefault();
    if (roomcode.value) {
        socket.emit("join", roomcode.value);
    }
    overlay.style.opacity = "0";
    overlay.style.pointerEvents = "none";
});

msgform.addEventListener('submit', function (e) {
    e.preventDefault();
    if (input.value) {
        if(checkbox.checked) {
            console.log(checkbox.value);
            socket.emit("script", input.value);
            let item = document.createElement('li');
            item.innerHTML = input.value;
            history.appendChild(item);
        } else {
            socket.emit("chat", input.value);
        }
        input.value = '';
    }
});

socket.on('chat', function (msg) {
    let item = document.createElement('li');
    item.innerHTML = msg;
    chats.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
});

socket.on('script', function (msg) {
    let item = document.createElement('script');
    item.innerHTML = msg;
    body.appendChild(item);
});

addEventListener("submit", (e)=>e.preventDefault());