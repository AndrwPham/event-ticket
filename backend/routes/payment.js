import express from 'express';
import PayOS from '@payos/node';

const router = express.Router();

router.post("/create-payment-link", async (req, res) => {
    const orderCode = Number(String(Date.now()).slice(-6));

    try {
        const payOS = new PayOS(
            process.env.PAYOS_CLIENT_ID,
            process.env.PAYOS_API_KEY,
            process.env.PAYOS_CHECKSUM_KEY
        );

        const { orderDetails } = req.body;

        if (!orderDetails || !orderDetails.tickets || !Array.isArray(orderDetails.tickets) || orderDetails.tickets.length === 0) {
            return res.status(400).json({ error: 'Missing or malformed order details' });
        }

        const totalAmount = orderDetails.tickets.reduce(
            (acc, ticket) => acc + ticket.price * ticket.quantity,
            0
        );

        if (totalAmount <= 0) {
            return res.status(400).json({ error: 'Invalid total amount' });
        }

        const paymentData = {
            orderCode: orderCode,
            amount: totalAmount,
            description: String(orderCode),
            items: orderDetails.tickets,
            returnUrl: `http://localhost:5173/payment/success`,
            cancelUrl: `http://localhost:5173/payment/cancel`,
        };

        const paymentLink = await payOS.createPaymentLink(paymentData);

        res.json(paymentLink);

    } catch (error) {
        console.error("Error creating payment link:", error);
        res.status(500).json({ error: error.message || "Failed to create payment link" });
    }
});

router.get('/order/:orderCode', async (req, res) => {
    try {
        const payOS = new PayOS(
            process.env.PAYOS_CLIENT_ID,
            process.env.PAYOS_API_KEY,
            process.env.PAYOS_CHECKSUM_KEY,
        );
        const { orderCode } = req.params;
        const order = await payOS.getPaymentLinkInformation(Number(orderCode));

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.json({
            error: 0,
            message: 'Success',
            data: order,
        });

    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({
            error: -1,
            message: error.message || 'Failed to fetch order information',
            data: null
        });
    }
});

export default router;