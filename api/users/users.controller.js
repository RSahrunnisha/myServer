const axios = require("axios");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const keys = require("../../config/config");
const validateLoginInput = require("../../validation/login");
const validateMobileForOtp = require("../../validation/sendOtp");
const validateRegisterInput = require("../../validation/register");
const { User, Token } = require("../../helper/db");
const otpApiKey = keys.otpApiKey;

const express = require("express");
const router = express.Router();


var self = (module.exports = {
  sendotp: (req, res) => {
    const { errors, isValid } = validateMobileForOtp(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    User.findOne({
      mobileno: req.body.mobileno,
      countrycode: req.body.countrycode,
    }).then((user) => {
      if (user) {
        return res.status(200).json({ isRegister: true });
      } else {
        //return res.status(200).json({ isRegister: false });
        axios
          .get(
            `http://2factor.in/API/V1/${otpApiKey}/SMS/${req.body.mobileno}/AUTOGEN`
          )
          .then((response) => {
            return res.status(200).json({ session: response.data.Details });
          })
          .catch((error) => {
            return res
              .status(error.response.status)
              .json({ message: error.response.data.Details });
          });
      }
    });
  },
  verifyOtp: (data) => {
    return axios
      .get(
        `https://2factor.in/API/V1/${otpApiKey}/SMS/VERIFY/${data.session_id}/${data.otp}`
      )
      .then((response) => {
        // returning the data here allows the caller to get it through another .then(...)
        return response.data;
      });
  },
  sendVerificationEmail: (data, header, res) => {

    const _emailtoken = new Token({ _userId: data._id, token: crypto.randomBytes(16).toString('hex') });
    _emailtoken.save(function (err) {
      if (err) { return res.status(500).send({ message: err.message }); }
        var transporter = nodemailer.createTransport({
          service:'gmail',
          host: "smtp.gmail.com",
          //service: "Sendgrid",
          auth: {
            user: keys.email.smtpOptions.auth.user,
            pass: keys.email.smtpOptions.auth.pass
          },
        });
        var mailOptions = {
          from: "no-reply@yourwebapplication.com",
          to: data.email,
          subject: "Account Verification Token",
          text:
            "Hello,\n\n" +
            "Please verify your account by clicking the link: \nhttp://" +
            header +
            "/api/users/confirmation?token=" +
            _emailtoken.token +
            ".\n",
        };
        transporter.sendMail(mailOptions, function (err) {
          if (err) {
            return res.status(500).send({ message: err.message });
          }
          res
            .status(200)
            .send({message: `Verification Email have been sent to ${data.email}`});
        });
    });
  },
  register: (req, res) => {
    const { errors, isValid } = validateRegisterInput(req.body);
    // Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }
    User.findOne({
      email: req.body.email
    }).then((user) => {
      if (user) { 
        return res
          .status(400)
          .json({ message: "The email address you have entered is already associated with another account." });
      } else {
          const newUser = new User({
            email: req.body.email,
            password: req.body.password,
          });
          // Hash password before saving in database
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              newUser
              .save()
                .then((user) => {
                  self.sendVerificationEmail(user, req.headers.host, res);
                })
            });
          });
      }
    });
  },
  login: (req, res) => {
    // Form validation
    const { errors, isValid } = validateLoginInput(req.body);
    // Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }
    const mobileno = req.body.mobileno;
    const email = req.body.email;
    const password = req.body.password;
    // Find user by email
    User.findOne({ $or: [{ mobileno }, { email }] }).then((user) => {
      // Check if user exists
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      // Check password
      bcrypt.compare(password, user.password).then((isMatch) => {
        if (isMatch) {
          // User matched
          // Create JWT Payload
          const payload = {
            id: user.id,
            isVerified: user.isVerified,
            email: user.email,
            mobileno: user.mobileno,
            role : user.role
          };
          // Sign token
          jwt.sign(
            payload,
            keys.secretOrKey,
            {
              expiresIn: 31556926, // 1 year in seconds
            },
            (err, token) => {
              res.json({
                success: true,
                token: "Bearer " + token,
              });
            }
          );
        } else {
          return res.status(400).json({ message: "Password incorrect" });
        }
      });
    });
  },
  confirmEmail:(req, res) =>{
    Token.findOne({ token : req.query.token }).then((data) => {
      // Check if user exists
      if (!data) {
        res.redirect('http://google.com/Verificaonpage')
        return false;
      }
      let query = {_id : data._userId};
      let newVal = {$set :{isVerified: true}};
      User.findOneAndUpdate(query, newVal , function (err, doc){
        if (err){
          console.log("update document error");
          return res.status(400).json({ message: "Something went wrong" });

        }else {
          // console.log(data)
          // data.token = null;
           data.remove();
           res.redirect('http://google.com/login')
           return false;
          // return res.status(200).json({ message: "User verified" });
        }
      })
    })
    // req.assert('email', 'Email is not valid').isEmail();
    // req.assert('email', 'Email cannot be blank').notEmpty();
    // req.assert('token', 'Token cannot be blank').notEmpty();
    // req.sanitize('email').normalizeEmail({ remove_dots: false });
  },
  me:(req, res) =>{
   
    // console.log(req.decoded)
    return res.status(200).json( req.decoded)
  }
});
