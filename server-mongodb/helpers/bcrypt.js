const bcrypt = require('bcryptjs');

function hashPassword(password){
  const hash = bcrypt.hashSync(password)
  return hash
}

function comparePassword(hash,password){
  const isValid = bcrypt.compareSync(password,hash)
  return isValid
}

module.exports = {hashPassword,comparePassword}