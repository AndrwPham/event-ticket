import express from 'express';
import PayOS from '@payos/node';

const router = express.Router();

router.post("/create-payment-link", async (req, res) => {
    try {
        const payOS = new PayOS(
            process.env.PAYOS_CLIENT_ID,
            process.env.PAYOS_API_KEY,
            process.env.PAYOS_CHECKSUM_KEY
        );

        const { orderDetails, eventDetails } = req.body;

        if (!orderDetails || !orderDetails.tickets) {
            return res.status(400).json({ error: 'Missing or malformed order details' });
        }

        const totalAmount = orderDetails.tickets.reduce(
            (acc, ticket) => acc + ticket.price * ticket.quantity,
            0,
        );

        const paymentData = {
            orderCode: Date.now(),
            amount: 2000, // totalAmount
            // FIX: Use a short, static description to meet the 25-character limit.
            description: "Ticket Payment",
            items: orderDetails.tickets.map(ticket => ({
                name: ticket.name,
                quantity: ticket.quantity,
                price: ticket.price
            })),
            returnUrl: `http://localhost:3000/payment/success`,
            cancelUrl: `http://localhost:3000/payment/cancel`,
        };

        console.log("Creating payment link with data:", paymentData)
        const paymentLink = await payOS.createPaymentLink(paymentData);
        console.log("payment: ", paymentLink)
        res.json(paymentLink);

    } catch (error) {
        console.error("Error creating payment link:", error);
        // Ensure the error message from PayOS is sent to the client
        res.status(500).json({ error: error.message || "Failed to create payment link" });
    }
});

export default router;