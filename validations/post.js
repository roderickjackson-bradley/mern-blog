const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validatePostInput(data) {
  let errors = {};

  // Convert empty fields to an empty string so we can use validator functions
  data.title = !isEmpty(data.title) ? data.title : ""
  data.content = !isEmpty(data.content) ? data.content : ""

  // title checks
  if(!Validator.isLength(data.title, {min: 1, max: 300})){
    errors.title = 'Title must be between 1 and 300 characters'
  }
  if (Validator.isEmpty(data.title)) {
    errors.title = "Title field is required";
  }
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
