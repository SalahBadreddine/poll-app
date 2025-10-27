import sql from './config/database.js';
import dotenv from 'dotenv';

dotenv.config();

async function testConnection() {
  try {
    console.log('Testing database connection...');
    console.log('DATABASE_URL:', process.env.DATABASE_URL?.substring(0, 50) + '...');
    
    // Test basic query
    const result = await sql`SELECT NOW() as current_time`;
    console.log('✅ Database connection successful!');
    console.log('Current time:', result[0].current_time);
    
    // Check if users table exists
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    
    console.log('\n📊 Existing tables:');
    tables.forEach(row => console.log('  -', row.table_name));
    
    if (tables.length === 0) {
      console.log('\n⚠️  No tables found! You need to run database/schema.sql');
    } else {
      console.log('\n✅ Database is ready!');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Database connection failed!');
    console.error('Error:', error.message);
    process.exit(1);
  }
}

testConnection();

