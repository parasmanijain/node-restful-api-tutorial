import { Router } from 'express';
const router = Router();

router.get('/', (_, res) => {
    res.status(200).json({
        message: 'Handling GET requests to /products'
    });
});

router.post('/', (_, res) => {
    res.status(201).json({
        message: 'Handling POST requests to /products'
    });
});

router.get('/:productId', (req, res) => {
    const id = req.params.productId;
    if (id === 'special') {
        res.status(200).json({
            message: 'You discovered the special ID',
            id: id
        });
    } else {
        res.status(200).json({
            message: 'You passed an ID'
        });
    }
});

router.patch('/:productId', (_, res) => {
    res.status(200).json({
        message: 'Updated product!'
    });
});

router.delete('/:productId', (_, res) => {
    res.status(200).json({
        message: 'Deleted product!'
    });
});

export default router;