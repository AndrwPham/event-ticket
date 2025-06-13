import express from 'express';
import PayOS from '@payos/node';

const router = express.Router();

router.post("/create-payment-link", async (req, res) => {
    const orderCode = Date.now();

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
            amount: 2000, // totalAmount
            description: String(orderCode),
            items: orderDetails.tickets,
            returnUrl: `http://localhost:5173/payment/success`,
            cancelUrl: `http://localhost:5173/payment/cancel`,
        };

        const paymentLink = await payOS.createPaymentLink(paymentData);
        console.log("Payment data:", paymentData)
        console.log("Payment link:",  paymentLink)
        res.json(paymentLink);

    } catch (error) {
        console.error("Error creating payment link:", error);
        res.status(500).json({ error: error.message || "Failed to create payment link" });
    }
});

router.post("/cancel", async (req, res) => {
    const { orderCode } = req.body;
    if (!orderCode) {
        return res.status(400).json({ error: "orderCode is required" });
    }
    try {
        const payOS = new PayOS(process.env.PAYOS_CLIENT_ID, process.env.PAYOS_API_KEY, process.env.PAYOS_CHECKSUM_KEY);
        const canceledOrder = await payOS.cancelPaymentLink(orderCode, "User timed out");
        res.json({ error: 0, message: "Canceled successfully", data: canceledOrder });
    } catch (error) {
        console.error("Error canceling payment link:", error);
        res.status(500).json({ error: -1, message: error.message || "Failed to cancel payment link" });
    }
});

router.post("/webhook", express.json(), (req, res) => {
    try {
        const payOS = new PayOS(process.env.PAYOS_CLIENT_ID, process.env.PAYOS_API_KEY, process.env.PAYOS_CHECKSUM_KEY);
        const webhookData = payOS.verifyPaymentWebhookData(req.body);
        console.log("Webhook received and verified:", webhookData);

        //  update your database here
        // if (webhookData.code === "00") { /* Handle PAID status */ }

        res.status(200).json({ error: 0, message: "Webhook received" });
    } catch (error) {
        console.error("Webhook verification failed:", error);
        res.status(400).json({ error: -1, message: "Webhook verification failed" });
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