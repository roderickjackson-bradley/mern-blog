const Validator = require('validator')
const isEmpty = require('is-empty')

module.exports = function validatProfileInput(data) {
  let errors = {}

  // Convert empty fields to an empty string so we can use validator functions
  data.username = !isEmpty(data.username) ? data.username : "";
  // data.bio = !isEmpty(data.email) ? data.email : "";

  // Username checks
  if (Validator.isEmpty(data.username)) {
    errors.username = "Username field is required";
  }
  if(!Validator.isLength(data.username, {min: 2, max:40 })){
    errors.name = 'Name must be between 2 and 30 characters'
  }

  // Bio checks
  if (Validator.isEmpty(data.bio)) {
    errors.bio = "Bio field is required";
  }
  // if (!Validator.isLength(data.bio, { min: 2, max: 600 })) {
  //   errors.bio = "Bio must be at least 12 characters";
  // }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}