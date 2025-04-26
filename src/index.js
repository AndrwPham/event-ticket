require('dotenv').config();
const express = require('express');
const ticketRouter = require('./routes/ticket');
const errorHandler = require('./middleware/errorHandler');

// Import the Google Wallet module
const { createPassClass } = require('./services/googleWalletService'); // I assume you saved your Wallet code as walletService.js under src/services

const app = express();
app.use(express.json());

// Mount ticket routes
app.use('/api/tickets', ticketRouter);

// Error handler middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`✅ Ticketing API is running on port ${PORT}`);
  console.log('Server is ready to accept requests.');

  try {
    await createPassClass();
    console.log('✅ Google Wallet class check/init complete.');
  } catch (err) {
    console.error('❌ Failed to create/check Google Wallet class.', err);
  }

  console.log('Listening for incoming requests...');
});