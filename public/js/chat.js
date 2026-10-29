const socket = io();

const chatForm = document.getElementById('chatForm');
const usernameInput = document.getElementById('username');
const messageInput = document.getElementById('message');
const messageLogs = document.getElementById('messageLogs');
const themeToggle = document.getElementById('themeToggle');

const updateThemeButton = () => {
    const isLight = document.documentElement.dataset.theme === 'light';
    themeToggle.textContent = isLight ? 'Modo oscuro' : 'Modo claro';
};

themeToggle.addEventListener('click', () => {
    const root = document.documentElement;
    if (root.dataset.theme === 'light') {
        delete root.dataset.theme;
        localStorage.setItem('theme', 'dark');
    } else {
        root.dataset.theme = 'light';
        localStorage.setItem('theme', 'light');
    }
    updateThemeButton();
});

updateThemeButton();

const renderMessage = ({ user, message, time }) => {
    const div = document.createElement('div');
    div.classList.add('msg');
    if (user === usernameInput.value.trim()) div.classList.add('own');

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

messageInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        chatForm.requestSubmit();
    }
});

socket.on('messageLogs', (messages) => {
    messageLogs.innerHTML = '';
    messages.forEach(renderMessage);
});

socket.on('newMessage', renderMessage);
