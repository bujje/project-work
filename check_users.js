require('dotenv').config({ path: './backend/.env' });
const { QueryDatabase } = require('./backend/src/config/Database');

async function checkUsers() {
  try {
    const result = await QueryDatabase('SELECT UserId, Username, Email, FullName FROM Users');
    console.log('Users in database:');
    console.log(result.rows);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkUsers();