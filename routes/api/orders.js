const express = require('express');
const router = express.Router();
const dataLayer = require('../../dal/orders');

router.get('/', async function (req, res) {
    // Get all orders made by user
    const userId = req.user.id;
    try {
        const orders = await dataLayer.getOrdersByUserId(userId);
        res.status(201).json({ orders });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;