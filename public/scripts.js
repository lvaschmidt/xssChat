//choosing room
const roomcode = document.getElementById("roomcode");
const namefield = document.getElementById("namefield");
const joinform = document.getElementById("joinform");
const overlay = document.getElementById("overlay");

//content
const chats = document.getElementById("chats");
const scripts = document.getElementById("scripts");
const history = document.getElementById("scripthistory");

//inputs
const msgform = document.getElementById("msgform");
const input = document.getElementById("message");
const checkbox = document.getElementById("toggle");

//read url params
let params = new URLSearchParams(window.location.search);
roomcode.value = params.get("room");

var socket = io();
var username = "Anonymous";

//join form overlay event handler
joinform.addEventListener("submit", function (e) {
    e.preventDefault();
    if(namefield.value) {
        username = namefield.value;
    }
    if (roomcode.value) {
        socket.emit("join", {room: roomcode.value, name: username});
        overlay.style.opacity = "0";
        overlay.style.pointerEvents = "none";

        let url = new URL(window.location.href);
        url.searchParams.set("room", roomcode.value);
        window.history.replaceState(null, null, url);
    }
});

//submit message
msgform.addEventListener("submit", function (e) {
    e.preventDefault();
    if (input.value) {
        if(checkbox.checked) {
            console.log(checkbox.value);
            socket.emit("message", {type: "script", name: username, value: input.value});
            let item = document.createElement('li');
            item.textContent = input.value;
            history.appendChild(item);
        } else {
            socket.emit("message", {type: "chat", name: username, value: input.value});
        }
        input.value = '';
    }
});

//tab for element completion
msgform.addEventListener("keydown", function (e) {
    if(e.code=="Tab") {
        e.preventDefault();
        let message = input.value;
        let cursorPosition = input.selectionStart;
        let elemName = message.substring(0,cursorPosition).split(" ").pop().split(">").pop();
        let insertIndex = cursorPosition - elemName.length;
        try {
            if(document.createElement(elemName.toLowerCase()).toString() == "[object HTMLUnknownElement]") {
                return;
            }
            
        } catch(e){
            console.log(e);
            input.focus();
            return;
        }
        let elem = `<${elemName}></${elemName}>`;
        let newInput = message.slice(0, insertIndex)+elem+message.slice(cursorPosition);
        input.value = newInput;
        cursorPosition = (message.slice(0, insertIndex)+elem).length - `</${elemName}>`.length;
        input.setSelectionRange(cursorPosition, cursorPosition);
    }
});

socket.on('message', function (msg) {
    if(msg.type==script) {
        let item = document.createElement('script');
        item.innerHTML = msg.value;
        scripts.appendChild(item);
    } else {
        let item = document.createElement('li');
        item.innerHTML = `<b>${msg.name}</b>: ${msg.value}`;
        chats.appendChild(item);
        item.scrollIntoView(false);
    }
});

socket.on('join', function (name) {
    let item = document.createElement('li');
    item.innerHTML = `<b>${name}</b> has joined.`;
    chats.appendChild(item);
    item.scrollIntoView(false);
});