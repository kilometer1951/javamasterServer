const bcrypt = require("bcrypt-nodejs");

const encryptPassword = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

module.exports = encryptPassword;
