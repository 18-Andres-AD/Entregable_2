const socket = io();

const chatForm = document.getElementById('chatForm');
const usernameInput = document.getElementById('username');
const messageInput = document.getElementById('message');
const messageLogs = document.getElementById('messageLogs');

// Se usa textContent para que nadie pueda inyectar HTML en el chat
const renderMessage = ({ user, message, time }) => {
    const div = document.createElement('div');
    div.classList.add('msg');

    const strong = document.createElement('strong');
    strong.textContent = `${user}: `;
    const span = document.createElement('span');
    span.textContent = message;
    const small = document.createElement('small');
    small.textContent = time;

    div.append(strong, span, small);
    messageLogs.appendChild(div);
    messageLogs.scrollTop = messageLogs.scrollHeight;
};

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const user = usernameInput.value.trim();
    const message = messageInput.value.trim();
    if (!user || !message) return;

    socket.emit('message', { user, message });
    messageInput.value = '';
    messageInput.focus();
});

// Historial al conectarse
socket.on('messageLogs', (messages) => {
    messageLogs.innerHTML = '';
    messages.forEach(renderMessage);
});

// Mensaje nuevo de cualquier usuario
socket.on('newMessage', renderMessage);
