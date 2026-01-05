import { Router } from 'express';
const router = Router();

router.get('/', (_, res) => {
    res.status(200).json({
        message: 'Orders were fetched'
    });
});

router.post('/', (_, res) => {
    res.status(201).json({
        message: 'Order was created'
    });
});

router.get('/:orderId', (req, res) => {
    res.status(200).json({
        message: 'Order details',
        orderId: req.params.orderId
    });
});

router.delete('/:orderId', (req, res) => {
    res.status(200).json({
        message: 'Order deleted',
        orderId: req.params.orderId
    });
});

export default router;