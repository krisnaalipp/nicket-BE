const jwt = require('jsonwebtoken');

const secretKey= 'Lisaaaa'

const signToken = (payload) => {
  const access_token = jwt.sign(payload,secretKey)
  return access_token
}

const verifyToken = (access_token) => {
  const payload = jwt.verify(access_token,secretKey)
  return payload
}

module.exports = {signToken,verifyToken}