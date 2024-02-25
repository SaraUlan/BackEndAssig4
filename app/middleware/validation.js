const bcrypt = require("bcrypt");

function ValidatePassword(hash) {
  bcrypt
    .compare(password, hash)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => console.error(err.message));
}

module.exports = {
  ValidatePassword,
};
