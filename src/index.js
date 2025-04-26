// src/index.js
require('dotenv').config();
const express = require('express');
const ticketRouter = require('./routes/ticket');
const errorHandler = require('./middleware/errorHandler');

const app = express();
app.use(express.json());

// Mount ticket routes
app.use('/api/tickets', ticketRouter);

// Error handler middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Ticketing API is running on port ${PORT}`);
  console.log('Server is ready to accept requests.');

  console.log('Listening for incoming requests...');
});
  