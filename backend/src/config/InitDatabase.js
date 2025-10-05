const { QueryDatabase } = require('./Database');

const InitializeDatabaseTables = async () => {
  try {
    console.log('Starting database initialization...');

    // Create Users table
    await QueryDatabase(`
      CREATE TABLE IF NOT EXISTS Users (
        UserId SERIAL PRIMARY KEY,
        Username VARCHAR(100) UNIQUE NOT NULL,
        Email VARCHAR(255) UNIQUE NOT NULL,
        PasswordHash VARCHAR(255) NOT NULL,
        FullName VARCHAR(255) NOT NULL,
        Department VARCHAR(100),
        CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Users table created');

    // Create CashRequests table
    await QueryDatabase(`
      CREATE TABLE IF NOT EXISTS CashRequests (
        CashRequestId SERIAL PRIMARY KEY,
        UserId INTEGER NOT NULL REFERENCES Users(UserId) ON DELETE CASCADE,
        AmountUsedEncrypted TEXT NOT NULL,
        Department VARCHAR(100) NOT NULL,
        DateOfNeeded DATE NOT NULL,
        Description TEXT NOT NULL,
        ExpenseType VARCHAR(50) NOT NULL,
        Status VARCHAR(20) DEFAULT 'Pending',
        CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ CashRequests table created');

    // Create Expenses table
    await QueryDatabase(`
      CREATE TABLE IF NOT EXISTS Expenses (
        ExpenseId SERIAL PRIMARY KEY,
        UserId INTEGER NOT NULL REFERENCES Users(UserId) ON DELETE CASCADE,
        LinkedCashRequestId INTEGER REFERENCES CashRequests(CashRequestId) ON DELETE SET NULL,
        AmountEncrypted TEXT NOT NULL,
        Department VARCHAR(100) NOT NULL,
        DateConsumed DATE NOT NULL,
        Description TEXT NOT NULL,
        ExpenseType VARCHAR(50) NOT NULL,
        CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Expenses table created');

    // Create indexes for better performance
    await QueryDatabase(`
      CREATE INDEX IF NOT EXISTS idx_cash_requests_user_id ON CashRequests(UserId)
    `);
    await QueryDatabase(`
      CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON Expenses(UserId)
    `);
    await QueryDatabase(`
      CREATE INDEX IF NOT EXISTS idx_expenses_cash_request_id ON Expenses(LinkedCashRequestId)
    `);
    console.log('✓ Indexes created');

    console.log('✅ Database initialization completed successfully!');
    process.exit(0);
  } catch (Err) {
    console.error('❌ Database initialization failed:', Err);
    process.exit(1);
  }
};

InitializeDatabaseTables();