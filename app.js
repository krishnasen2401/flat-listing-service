const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const flatsRoute = require('./routes/flats');
const userRoutes = require('./routes/users');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const cors = require('cors');

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors({ origin: 'http://localhost:8889' }));

// Retry logic for MongoDB connection
async function connectWithRetry(retries = 10, delay = 5000) {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.error('MONGO_URI is not defined in environment variables.');
    process.exit(1);
  }

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await mongoose.connect(mongoUri);
      console.log('MongoDB connected');
      return;
    } catch (err) {
      console.error(`MongoDB connection failed (Attempt ${attempt}/${retries}): ${err.message}`);
      if (attempt < retries) {
        console.log(`Retrying in ${delay / 1000} seconds...`);
        await new Promise(res => setTimeout(res, delay));
      } else {
        console.error('Max retry attempts reached. Exiting...');
        process.exit(1);
      }
    }
  }
}

(async () => {
  await connectWithRetry();

  const swaggerOptions = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Flat Listing Service API',
        version: '1.0.0',
      },
    },
    apis: ['./routes/*.js'],
  };

  const swaggerSpec = swaggerJsdoc(swaggerOptions);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.get('/api-docs.json', (req, res) => {
    res.json(swaggerSpec);
  });

  app.use('/flats', flatsRoute);
  app.use('/api/users', userRoutes);
  app.get('/health', (req, res) => {
    res.status(200).send('OK');
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})();
