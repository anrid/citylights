// Development script to create test user
import 'dotenv/config'
import connect from './api/lib/database.js'
import { signup } from './api/endpoints/authEndpoints.js'

console.log('🚀 Creating test user for development...')

// Create the test user using the signup flow
async function createTestUser() {
  try {
    // Connect to database first
    await connect()
    
    const result = await signup({
      companyName: 'Test Company',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      password: 'test123'
    })
    
    console.log('✅ Test user created successfully!')
    console.log('📧 Email: test@example.com')
    console.log('🔑 Password: test123')
    console.log('🏢 Company: Test Company')
    console.log('Result:', result)
    
    process.exit(0)
  } catch (error) {
    console.error('❌ Failed to create test user:', error.message)
    console.error('Full error:', error)
    process.exit(1)
  }
}

createTestUser()