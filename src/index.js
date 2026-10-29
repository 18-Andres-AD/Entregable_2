import path from 'path';
import { createServer } from 'http';
import express from 'express';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import { __dirname } from './utils.js';
import viewsRouter from './routes/views.router.js';

const app = express();
const PORT = 3000;

const httpServer = createServer(app);
const io = new Server(httpServer);

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '..', 'views'));

app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/', viewsRouter);

const messages = [];

io.on('connection', (socket) => {
    console.log('Nuevo usuario conectado:', socket.id);

    socket.emit('messageLogs', messages);

    socket.on('message', ({ user, message }) => {
        if (!user || !message) return;
        const newMessage = { user, message, time: new Date().toLocaleTimeString('es-CO') };
        messages.push(newMessage);
        io.emit('newMessage', newMessage);
    });

    socket.on('disconnect', () => {
        console.log('Usuario desconectado:', socket.id);
    });
});

httpServer.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
