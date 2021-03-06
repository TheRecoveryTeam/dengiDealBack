var crypto = require('crypto');

// larger numbers mean better security, less
var config = {
    // size of the generated hash
    hashBytes: 32,
    // larger salt means hashed passwords are more resistant to rainbow table, but
    // you get diminishing returns pretty fast
    saltBytes: 16,
    // more iterations means an attacker has to take longer to brute force an
    // individual password, so larger is better. however, larger also means longer
    // to hash the password. tune so that hashing the password takes about a
    // second
    iterations: 872791
};

/**
 * Hash a password using Node's asynchronous pbkdf2 (key derivation) function.
 *
 * Returns a self-contained buffer which can be arbitrarily encoded for storage
 * that contains all the data needed to verify a password.
 *
 * @param {!String} password
 * @param {!function(?Error, ?Buffer=)} callback
 */
function hashPassword(password, callback) {
    return new Promise((resolve, reject) => {
        // generate a salt for pbkdf2
        crypto.randomBytes(config.saltBytes, function(error, salt) {
            if (error) {
                return resolve({ error });
            }

            crypto.pbkdf2(password, salt, config.iterations, config.hashBytes, 'sha1',
                function(error, hash) {

                    if (error) {
                        return resolve({ error });
                    }

                    var combined = new Buffer(hash.length + salt.length + 8);

                    // include the size of the salt so that we can, during verification,
                    // figure out how much of the hash is salt
                    combined.writeUInt32BE(salt.length, 0, true);
                    // similarly, include the iteration count
                    combined.writeUInt32BE(config.iterations, 4, true);

                    salt.copy(combined, 8);
                    hash.copy(combined, salt.length + 8);
                    resolve({ response: combined });
                });
        });
    });
}

/**
 * Verify a password using Node's asynchronous pbkdf2 (key derivation) function.
 *
 * Accepts a hash and salt generated by hashPassword, and returns whether the
 * hash matched the password (as a boolean).
 *
 * @param {!String} password
 * @param {!Buffer} combined Buffer containing hash and salt as generated by
 *   hashPassword.
 * @param {!function(?Error, !boolean)}
 */
function verifyPassword(password, combined) {
    // extract the salt and hash from the combined buffer
    var saltBytes = combined.readUInt32BE(0);
    var hashBytes = combined.length - saltBytes - 8;
    var iterations = combined.readUInt32BE(4);
    var salt = combined.slice(8, saltBytes + 8);
    var hash = combined.toString('binary', saltBytes + 8);

    // verify the salt and hash against the password

    return new Promise((resolve, reject) => {
        crypto.pbkdf2(password, salt, iterations, hashBytes, 'sha1', function(err, verify) {
            if (err) {
                return resolve({ error });
            }

            const verified = verify.toString('binary') === hash;

            return resolve({ response: verified });
        });
    })
}

module.exports = {
    hashPassword,
    verifyPassword
};