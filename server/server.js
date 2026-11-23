import 'dotenv/config';
import http from 'http';
import app from './src/app.js';
import { connectDB } from './src/config/db.js';
import { ensureDefaultUsers } from './src/controllers/authController.js';

const PORT = parseInt(process.env.PORT, 10) || 5000;
const HOST = '0.0.0.0';

// Start server listening on 0.0.0.0 immediately for cloud deployments (Railway/Docker)
const server = http.createServer(app);

server.listen(PORT, HOST, async () => {
  console.log(`=======================================================`);
  console.log(`🚀 SLN Engineers Projects Platform Backend API`);
  console.log(`📡 Server running on ${HOST}:${PORT}`);
  console.log(`🔗 Health Check: /api/health`);
  console.log(`=======================================================`);

  try {
    await connectDB();
    await ensureDefaultUsers();
  } catch (error) {
    console.error('[Startup Error]:', error.message);
  }
});

// Handle process termination gracefully
process.on('SIGTERM', () => {
  console.log('[SIGTERM] Shutting down gracefully...');
  server.close(() => process.exit(0));
});

process.on('unhandledRejection', (err) => {
  console.error('[UnhandledRejection]:', err);
});

