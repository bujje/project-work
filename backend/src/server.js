const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { HandleError, HandleNotFound } = require('./middleware/ErrorMiddleware');
const { SanitizeRequestBody } = require('./middleware/ValidationMiddleware');
const AuthRoutes = require('./routes/AuthRoutes');
const CashRequestRoutes = require('./routes/CashRequestRoutes');
const ExpenseRoutes = require('./routes/ExpenseRoutes');

const App = express();
const PORT = process.env.PORT || 5000;

// Middleware
const AllowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:3000,http://localhost:3001')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

App.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // allow non-browser clients
    if (AllowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error(`CORS blocked for origin: ${origin}`), false);
  },
  credentials: true,
}));

App.use(express.json());
App.use(express.urlencoded({ extended: true }));
App.use(SanitizeRequestBody);

// Health check route
App.get('/health', (Request, Response) => {
  Response.status(200).json({
    Success: true,
    Message: 'Server is running',
    Timestamp: new Date().toISOString(),
  });
});

// API Routes
App.use('/api/auth', AuthRoutes);
App.use('/api/cash-requests', CashRequestRoutes);
App.use('/api/expenses', ExpenseRoutes);

// Error handling
App.use(HandleNotFound);
App.use(HandleError);

// Start server
App.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   Cash Request & Expense Management System API           ║
║                                                           ║
║   Server running on: http://localhost:${PORT}              ║
║   Environment: ${process.env.NODE_ENV || 'development'}                              ║
║                                                           ║
║   API Endpoints:                                          ║
║   - POST /api/auth/register                               ║
║   - POST /api/auth/login                                  ║
║   - POST /api/auth/logout                                 ║
║   - GET  /api/auth/me                                     ║
║   - GET  /api/cash-requests                               ║
║   - POST /api/cash-requests                               ║
║   - GET  /api/expenses                                    ║
║   - POST /api/expenses                                    ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

module.exports = App;