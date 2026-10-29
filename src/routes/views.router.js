import { Router } from 'express';

const router = Router();

// GET / -> vista del chat
router.get('/', (req, res) => {
    res.render('chat', { title: 'Chat Grupo 10' });
});

export default router;
