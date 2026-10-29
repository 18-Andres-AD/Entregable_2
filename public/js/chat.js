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

const emojiBtn = document.getElementById('emojiBtn');
const emojiPanel = document.getElementById('emojiPanel');

const emojis = [
    '😀', '😂', '🤣', '😊', '😍', '🥰', '😘', '😎',
    '🤔', '😅', '😉', '😇', '🤗', '🤩', '🥳', '😴',
    '🙄', '😢', '😭', '😡', '😱', '🤯', '😬', '🤐',
    '👍', '👎', '👏', '🙌', '🙏', '💪', '👋', '🤝',
    '❤️', '💙', '💜', '🔥', '✨', '🎉', '💯', '✅',
    '❌', '⭐', '☕', '🍕', '🎂', '📩', '💬', '🚀'
];

const insertEmoji = (emoji) => {
    const { selectionStart, selectionEnd, value } = messageInput;
    messageInput.value = value.slice(0, selectionStart) + emoji + value.slice(selectionEnd);
    const cursor = selectionStart + emoji.length;
    messageInput.setSelectionRange(cursor, cursor);
    messageInput.focus();
};

emojis.forEach((emoji) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = emoji;
    button.addEventListener('click', () => insertEmoji(emoji));
    emojiPanel.appendChild(button);
});

const closeEmojiPanel = () => emojiPanel.classList.remove('abierto');

emojiBtn.addEventListener('click', () => {
    emojiPanel.classList.toggle('abierto');
});

document.addEventListener('click', (e) => {
    if (!emojiPanel.contains(e.target) && !emojiBtn.contains(e.target)) closeEmojiPanel();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeEmojiPanel();
});

chatForm.addEventListener('submit', closeEmojiPanel);

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

const personaje = document.getElementById('personaje');

socket.on('newMessage', (data) => {
    renderMessage(data);
    personaje.classList.remove('saltar');
    void personaje.offsetWidth;
    personaje.classList.add('saltar');
});
