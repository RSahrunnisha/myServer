const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create Schema
const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
 /*  countrycode:{
      type: String
  },
  mobileno:{
      type: String
  }, */
  /* otp:{
      type: String,
      required: true
  }, */
  password: {
    type: String,
    required: true
  },
  creationDate: {
    type: Date,
    default: Date.now
  },
  updatedDate:{
    type: Date,
    default: Date.now
  },
  isVerified:{
      type: Boolean,
      default: false
  },
  verficationDate : {
    type:Date,
    default:null
  },
  role:{
    type: String,
    default: 'User',
},
  enabled:{
      type: Boolean,
      default: true
  },
  passwordResetToken: String,
  passwordResetExpires: Date,

});

const tokenSchema = new mongoose.Schema({
  _userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  token: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now, expires: 30 }
});
module.exports = {
  User : mongoose.model("Userauth", UserSchema, 'usersAuth'),
  Token: mongoose.model("Tokenauth", tokenSchema, 'tokenAuth'),
};