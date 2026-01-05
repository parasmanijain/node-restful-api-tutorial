import express from 'express';
const app = express();
import morgan from 'morgan';
import productRoutes from './api/routes/products.js';
import orderRoutes from './api/routes/orders.js';

app.use(morgan('dev'));

// Routes which should handle requests
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

app.use((_, _2, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
})

app.use((error, _, res) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

export default app;