const crypto = require('crypto')



const encrypt = (password, key) => {
    const iv = crypto.randomBytes(16)
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key, 'base64'), iv)
    let encrypted = cipher.update(password)
    encrypted = Buffer.concat([encrypted, cipher.final()])
    return {iv: iv.toString('hex'), encrypted: encrypted.toString('hex')}
}

const decrypt = (data, key) => {
    const iv = Buffer.from(data.iv, 'hex')
    const encrypted = Buffer.from(data.encrypted, 'hex')
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key, 'base64'), iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted.toString()
}

module.exports = {encrypt, decrypt}