import 'dotenv/config';
import http from 'http';
import app from './src/app.js';
import { connectDB } from './src/config/db.js';
import { ensureDefaultUsers } from './src/controllers/authController.js';

const PORT = process.env.PORT || 5000;

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    await connectDB();
    await ensureDefaultUsers();
    const server = http.createServer(app);

    server.listen(PORT, () => {
      console.log(`=======================================================`);
      console.log(`🚀 SLN Engineers Projects Platform Backend API`);
      console.log(`📡 Server running in [${process.env.NODE_ENV || 'development'}] mode on port ${PORT}`);
      console.log(`🔗 API Base: http://localhost:${PORT}/api`);
      console.log(`🔗 Health Check: http://localhost:${PORT}/api/health`);
      console.log(`=======================================================`);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err) => {
      console.error('[UnhandledRejection] Shutting down server:', err);
      server.close(() => process.exit(1));
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
