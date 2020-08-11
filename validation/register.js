const Validator = require("validator");
const isEmpty = require("is-empty");
module.exports = function validateRegisterInput(data) {
  let errors = {};
  // Convert empty fields to an empty string so we can use validator functions
  data.email = !isEmpty(data.email) ? data.email : "";
  //	data.countrycode = !isEmpty(data.countrycode) ? data.countrycode : "";
  //data.mobileno = !isEmpty(data.mobileno) ? data.mobileno : "";
  //data.otp = !isEmpty(data.otp) ? data.otp : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.password2 = !isEmpty(data.password2) ? data.password2 : "";
  // Name checks
  /* if (Validator.isEmpty(data.countrycode)) {
    errors.countrycode = "Country code field is required";
  } */
  // Email checks
  //   if (Validator.isEmpty(data.email)) {
  //     errors.email = "Email field is required";
  //   } else if (!Validator.isEmail(data.email)) {
  //     errors.email = "Email is invalid";
  //   }
  // Password checks
  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }
  // Mobile No checks
  /* if (Validator.isEmpty(data.mobileno)) {
    errors.mobileno = "Mobile no field is required";
  } */

  if (Validator.isEmpty(data.password2)) {
    errors.password2 = "Confirm password field is required";
  }
  /* if (Validator.isEmpty(data.otp)) {
    errors.otp = "OTP field is required";
  } */
  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = "Password must be at least 6 characters";
  }
  if (!Validator.equals(data.password, data.password2)) {
    errors.password2 = "Passwords must match";
  }
  return {
    errors,
    isValid: isEmpty(errors),
  };
};
