'use strict'
console.log('[DATABASE_JS_LOG] Starting api/lib/database.js top level script execution');

const P = require('bluebird')
const Mongoose = require('mongoose')
const Chalk = require('chalk')

function connect () {
  console.log('[DATABASE_JS_LOG] MongoDB: connect() function called');
  console.log('[DATABASE_JS_LOG] MongoDB: initializing ..')

  Mongoose.Promise = P
  console.log('[DATABASE_JS_LOG] Mongoose.Promise set to Bluebird');
  // P.promisifyAll(Mongoose); // Not strictly necessary for modern Mongoose
  // P.promisifyAll(Mongoose.Model); // Model methods return promises if no callback
  console.log('[DATABASE_JS_LOG] Mongoose methods should return promises by default.');

  const isTest = process.env.NODE_ENV === 'test'
  console.log(`[DATABASE_JS_LOG] isTest environment (NODE_ENV === 'test'): ${isTest}`);
  console.log(`[DATABASE_JS_LOG] CITYLIGHTS_API_SECRET length: ${process.env.CITYLIGHTS_API_SECRET ? process.env.CITYLIGHTS_API_SECRET.length : 'Not Set'}`);


  let host = process.env.CITYLIGHTS_MONGO_HOST || 'localhost'
  let port = process.env.CITYLIGHTS_MONGO_PORT || '27017'
  let dbName = isTest ? 'test_dev' : process.env.CITYLIGHTS_MONGO_DB || 'test_dev' // Renamed db to dbName
  console.log(`[DATABASE_JS_LOG] MongoDB connection params: host=${host}, port=${port}, db=${dbName}`);
  let mongoUser = process.env.CITYLIGHTS_MONGO_USER
  let mongoPass = process.env.CITYLIGHTS_MONGO_PASS

  let url = `mongodb://${host}:${port}/${dbName}`

  // Simplified options for Mongoose 5.x+ / 6.x+
  // Older options like `db` and `server` sub-objects are deprecated.
  const opts = {
    // useNewUrlParser: true, // No longer needed in Mongoose 6+
    // useUnifiedTopology: true, // No longer needed in Mongoose 6+
  };
  // Retain auth options if present
  if (mongoUser && mongoPass) {
    console.log(`[DATABASE_JS_LOG] Using MongoDB authentication for user: ${mongoUser}`);
    opts.authSource = process.env.CITYLIGHTS_MONGO_AUTH_DB || 'admin';
    opts.user = mongoUser;
    opts.pass = mongoPass;
    // Mongoose handles URL encoding for user/pass if they are in options.
    // The URL can remain simple.
    // url = `mongodb://${mongoUser}:${mongoPass}@${host}:${port}/${dbName}?authSource=${opts.authSource}`;
  } else {
    console.log(Chalk.bgYellow.black('[DATABASE_JS_LOG] MongoDB is NOT using authentication'))
  }
  console.log('[DATABASE_JS_LOG] Final MongoDB URL for connection attempt:', url);
  console.log('[DATABASE_JS_LOG] Final Mongoose options for connection attempt:', JSON.stringify(opts));

  Mongoose.set('debug', process.env.MONGOOSE_DEBUG === 'true' || false);

  const conn = Mongoose.connection;
  conn.on('error', (err) => {
    console.error('[DATABASE_JS_LOG] MongoDB: Mongoose connection "error" event:', err.message);
    // Stack trace might be too verbose for here, but useful for deeper debugging
    // console.error(err.stack);
  });
  conn.once('open', () => {
    // Mongoose.connections[0].client.s.url might be internal and change.
    // Using Mongoose.connection.host, port, name is safer.
    console.log(`[DATABASE_JS_LOG] MongoDB: Mongoose connection "open" event. Connected to db: ${conn.name}`);
  });
  conn.on('disconnected', () => {
    console.log('[DATABASE_JS_LOG] MongoDB: Mongoose "disconnected" event');
  });
  conn.on('reconnected', () => {
    console.log('[DATABASE_JS_LOG] MongoDB: Mongoose "reconnected" event');
  });
  conn.on('connecting', () => {
    console.log('[DATABASE_JS_LOG] MongoDB: Mongoose "connecting" event for URL:', url);
  });
   conn.on('close', () => {
    console.log('[DATABASE_JS_LOG] MongoDB: Mongoose "close" event');
  });

  console.log('[DATABASE_JS_LOG] Attempting Mongoose.connect() call...');
  // Mongoose.connect() returns a Promise.
  Mongoose.connect(url, opts)
    .then(() => {
      console.log('[DATABASE_JS_LOG] Mongoose.connect() promise successfully resolved.');
    })
    .catch(err => {
      console.error('[DATABASE_JS_LOG] Mongoose.connect() promise rejected during initial connection attempt:', err.message, err.stack);
      // This is a critical error for the app. It should probably exit or retry.
      // For tests, this might mean the DB isn't available.
      // console.error(err.stack); // For more detail if needed
    });
  console.log('[DATABASE_JS_LOG] Mongoose.connect() call made (this is an asynchronous operation).');
}

module.exports = connect
console.log('[DATABASE_JS_LOG] api/lib/database.js script body finished execution.');
