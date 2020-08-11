const Validator = require("validator");
const isEmpty = require("is-empty");
module.exports = function validateMobileForOtp(data) {
  let errors = {};
  // Convert empty fields to an empty string so we can use validator functions
  data.countrycode = !isEmpty(data.countrycode) ? data.countrycode : "";
  data.mobileno = !isEmpty(data.mobileno) ? data.mobileno : "";
  // Name checks

  if (Validator.isEmpty(data.countrycode)) {
    errors.countrycode = "Country code field is required";
  }

  // Mobile No checks
  if (Validator.isEmpty(data.mobileno)) {
    errors.mobilenor = "Mobile no field is required";
  }

  return {
    errors:
      errors.mobilenor && errors.countrycode
        ? (errors.warning = "Missing fields")
        : errors,
    isValid: isEmpty(errors),
  };
};
