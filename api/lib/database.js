import mongoose from 'mongoose'
import chalk from 'chalk'

async function connect() {
  console.log('MongoDB: initializing ..')

  const isTest = process.env.NODE_ENV === 'test'

  // Modern environment variable handling for Railway
  const mongoUrl = process.env.MONGO_URL || process.env.DATABASE_URL
  
  if (mongoUrl) {
    // Use Railway's MongoDB URL if available
    console.log('Using DATABASE_URL from Railway')
    try {
      await mongoose.connect(mongoUrl)
      console.log('MongoDB: connected via Railway')
    } catch (error) {
      console.error('MongoDB connection failed:', error)
      throw error
    }
  } else {
    // Fallback to local MongoDB
    let host = process.env.CITYLIGHTS_MONGO_HOST || 'localhost'
    let port = process.env.CITYLIGHTS_MONGO_PORT || '27017'
    let db = isTest ? 'test_dev' : process.env.CITYLIGHTS_MONGO_DB || 'test_dev'
    let user = process.env.CITYLIGHTS_MONGO_USER
    let pass = process.env.CITYLIGHTS_MONGO_PASS

    let url = `mongodb://${host}:${port}/${db}`

    if (user && pass) {
      url = `mongodb://${user}:${pass}@${host}:${port}/${db}`
      if (user === 'admin') {
        url += '?authSource=admin'
      }
    } else {
      console.log(chalk.bgYellow.black('MongoDB is NOT using authentication'))
    }

    // Modern Mongoose 8 connection
    mongoose.set('debug', false)
    mongoose.connection.on('error', (error) => {
      console.error('MongoDB: connection error,', error)
    })
    mongoose.connection.once('open', () => {
      console.log('MongoDB: connected to', url)
    })

    try {
      await mongoose.connect(url)
    } catch (error) {
      console.error('MongoDB connection failed:', error)
      throw error
    }
  }
}

export default connect
