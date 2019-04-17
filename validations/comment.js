const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateCommentInput(data) {
  let errors = {};

  // Convert empty fields to an empty string so we can use validator functions
  data.content = !isEmpty(data.content) ? data.content : ""

  // content checks
  if(!Validator.isLength(data.content, {min: 10})){
    errors.content = 'Content must a min of 10 characters'
  }
  if (Validator.isEmpty(data.content)) {
    errors.content = "Content field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
