const bcrypt = require('bcryptjs');

function hashPassword(password){
  const hash = bcrypt.hashSync(password)
  return hash
}

module.exports = hashPassword