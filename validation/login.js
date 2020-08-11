const Validator = require("validator");
const isEmpty = require("is-empty");
const { email } = require("../config/config");
module.exports = function validateLoginInput(data) {
  let errors = {};
  // Convert empty fields to an empty string so we can use validator functions
  data.email = !isEmpty(data.email) ? data.email : "";
  //data.mobileno = !isEmpty(data.mobileno) ? data.mobileno : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  //let username = data.mobileno? data.mobileno : data.email;
  // Email checks
  if (Validator.isEmpty(data.email)) {
    errors.username = "Email/mobileno field is required";
  } 
  // Password checks
  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }
  return {
    errors,
    isValid: isEmpty(errors),
  };
};
