//choosing room
const roomcode = document.getElementById("roomcode");
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

var socket = io();

//join form overlay event handler
joinform.addEventListener("submit", function (e) {
    e.preventDefault();
    if (roomcode.value) {
        socket.emit("join", roomcode.value);
    }
    overlay.style.opacity = "0";
    overlay.style.pointerEvents = "none";
});

//submit message
msgform.addEventListener("submit", function (e) {
    e.preventDefault();
    if (input.value) {
        if(checkbox.checked) {
            console.log(checkbox.value);
            socket.emit("script", input.value);
            let item = document.createElement('li');
            item.textContent = input.value;
            history.appendChild(item);
        } else {
            socket.emit("chat", input.value);
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

socket.on('chat', function (msg) {
    let item = document.createElement('li');
    item.innerHTML = msg;
    chats.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
});

socket.on('script', function (msg) {
    let item = document.createElement('script');
    item.innerHTML = msg;
    scripts.appendChild(item);
});