const crypto = require('crypto')
const bcrypt = require('bcrypt-nodejs');

const secret = process.env.JWT_SECRET
const algorithm = process.env.JWT_ALGORITHM

module.exports = {

  /**
   * Checks is password matches
   * @param {string} password - password
   * @param {Object} user - user object
   * @returns {boolean}
   */
  async checkPassword(password, user) {
    return new Promise((resolve, reject) => {
        if (bcrypt.compareSync(password, user.password)) {
          resolve(true)
        } else {
          resolve(false)
        }
    })
  },

  /**
   * Encrypts text
   * @param {string} text - text to encrypt
   */
  encrypt(text) {
    const cipher = crypto.createCipher(algorithm, secret)
    let crypted = cipher.update(text, 'utf8', 'hex')
    crypted += cipher.final('hex')
    return crypted
  },

  /**
   * Decrypts text
   * @param {string} text - text to decrypt
   */
  decrypt(text) {
    const decipher = crypto.createDecipher(algorithm, secret)
    try {
      let dec = decipher.update(text, 'hex', 'utf8')
      dec += decipher.final('utf8')
      return dec
    } catch (err) {
      return err
    }
  },


}
