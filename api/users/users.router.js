const express = require("express");
const router = express.Router();
// Load input validation
const authorize = require('../../helper/utils');
const controller = require("./users.controller");
const userConfig = require("./user.config");

userConfig.map(route =>{
    if(route.type == 'post'){
      router.route(route.path).post(authorize(route.roles, route.authorization), route.controller );
    }
    else if(route.type == 'get'){
      router.route(route.path).get(authorize(route.roles, route.authorization), route.controller)
    }

  })

module.exports = router;

