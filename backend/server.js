import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import paymentRoutes from './routes/payment.js'; // Import the new payment router

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Server running!");
});

app.use('/api/payment', paymentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));