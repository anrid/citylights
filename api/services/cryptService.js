'use strict'

const P = require('bluebird')
const argon2 = require('argon2')
const Crypto = require('crypto')
const Boom = require('@hapi/boom') // Assuming Boom was updated in a previous step

// Argon2 produces a hash that includes the salt and parameters.
// We no longer store salt separately.

async function createNewId () {
  // Using a timestamp-based "password" for ID generation.
  // Argon2 hashes are long, so substring might still be too long or short depending on need.
  // For a 24-char ID, a simpler random hex string might be more appropriate if cryptographic properties aren't essential for the ID itself.
  // However, sticking to a similar pattern as original:
  const hashForId = await createPassword(String(Date.now() + Math.random())) // Add randomness
  // Argon2 hashes look like: $argon2id$v=19$m=65536,t=3,p=4$salt$hash
  // Taking a part of the actual hash section.
  return hashForId.split('$').pop().substr(0, 24);
}

async function createRandomPassword () {
  const randomPassword = Crypto.randomBytes(32).toString('hex')
  // createPassword now returns the hash directly
  const hash = await createPassword(randomPassword)
  // The function signature implicitly expected an object { hash, salt }
  // To maintain some compatibility or if the caller expects an object:
  // However, the salt is now part of the hash.
  // For now, let's return the hash, and adjust if UserPassword model needs an object.
  // The original function was used by UserPassword.createRandomPassword which then stored hash and salt.
  // This suggests UserPassword model needs to change to store only the argon2 hash string.
  // For now, we adapt this service, and UserPassword model will be the next point of failure/refactor.
  return { hash: hash, salt: null }; // Salt is null as it's embedded in the hash
}

async function createPassword (password) {
  if (!password) {
    throw Boom.badRequest('Password cannot be empty');
  }
  try {
    const hash = await argon2.hash(password, {
      type: argon2.argon2id, // Recommended type
      // Default options for timeCost, memoryCost, parallelism are usually good.
      // timeCost: 3, (argon2 default)
      // memoryCost: 4096, (argon2 default is 4096 (4MB), consider 65536 (64MB) for better security if server can handle)
      // parallelism: 1 (argon2 default)
    });
    return hash; // This is the full hash string e.g., $argon2id$v=19$m=4096,t=3,p=1$ μιαςz5ZftN4$XoB5N2h...
  } catch (err) {
    console.error("Error hashing password with Argon2:", err);
    throw Boom.internal('Password hashing failed');
  }
}

async function verifyPassword (password, storedHash) {
  // The 'salt' parameter is no longer needed as it's part of storedHash for argon2
  if (!password || !storedHash) {
    throw Boom.badRequest('Password and stored hash are required for verification.');
  }
  try {
    if (await argon2.verify(storedHash, password)) {
      return true; // Passwords match
    } else {
      throw Boom.unauthorized('Invalid credentials'); // Passwords do not match
    }
  } catch (err) {
    // Log internal errors, but for client, treat as unauthorized.
    console.error("Error verifying password with Argon2:", err);
    // If err is already a Boom error from argon2.verify (e.g., malformed hash), rethrow or wrap.
    // argon2.verify throws if hash is malformed or password doesn't match.
    // It doesn't throw Boom errors directly, but its errors should be treated as unauthorized for security.
    throw Boom.unauthorized('Invalid credentials or verification process failed');
  }
}

// _encrypt function is no longer needed as argon2.hash handles it.

module.exports = {
  createRandomPassword,
  createPassword,
  createNewId,
  verifyPassword
}
