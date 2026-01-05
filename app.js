import express from 'express';
const app = express();

app.use((_, res, _2) => {
    res.status(200).json({
        message: 'It works!'
    });
});

export default app;