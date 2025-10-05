const { Pool } = require('pg');
require('dotenv').config();

const DatabaseConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'cash_expense_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

const DatabasePool = new Pool(DatabaseConfig);

DatabasePool.on('connect', () => {
  console.log('✓ Database connected successfully');
});

DatabasePool.on('error', (Err) => {
  console.error('Unexpected database error:', Err);
  process.exit(-1);
});

const QueryDatabase = async (QueryText, QueryParams = []) => {
  const StartTime = Date.now();
  try {
    const Result = await DatabasePool.query(QueryText, QueryParams);
    const Duration = Date.now() - StartTime;
    console.log('Executed query', { QueryText, Duration, Rows: Result.rowCount });
    return Result;
  } catch (error) {
    console.error('Database query error:', error);
    throw new Error(`Database query failed: ${error.message}`);
  }
};

const GetDatabaseClient = async () => {
  const Client = await DatabasePool.connect();
  const QueryMethod = Client.query;
  const ReleaseMethod = Client.release;

  // Set a timeout of 5 seconds
  const Timeout = setTimeout(() => {
    console.error('A client has been checked out for more than 5 seconds!');
  }, 5000);

  // Monkey patch the query method to keep track of the last query executed
  Client.query = (...Args) => {
    Client.lastQuery = Args;
    return QueryMethod.apply(Client, Args);
  };

  Client.release = () => {
    clearTimeout(Timeout);
    Client.query = QueryMethod;
    Client.release = ReleaseMethod;
    return ReleaseMethod.apply(Client);
  };

  return Client;
};

module.exports = {
  DatabasePool,
  QueryDatabase,
  GetDatabaseClient,
};