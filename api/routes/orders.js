import { Router } from 'express';
const router = Router();

// Handle incoming GET requests to /orders
router.get('/', (_, res, _2) => {
    res.status(200).json({
        message: 'Orders were fetched'
    });
});

router.post('/', (req, res, _) => {
    const order = {
        productId: req.body.productId,
        quantity: req.body.quantity
    };
    res.status(201).json({
        message: 'Order was created',
        order: order
    });
});

router.get('/:orderId', (req, res, _) => {
    res.status(200).json({
        message: 'Order details',
        orderId: req.params.orderId
    });
});

router.delete('/:orderId', (req, res, _) => {
    res.status(200).json({
        message: 'Order deleted',
        orderId: req.params.orderId
    });
});

export default router;