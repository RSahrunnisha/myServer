
const controller = require("./users.controller");

const userConfig =[
        {
            "path": "/sendotp",
            "roles" :[],
            "type": "post",
            "controller": controller.sendotp,
            "authorize": false
        },
    
        {
            "path": "/register",
            "roles": [],
            "controller": controller.register,
            "type": "post",
            "authorization": false
    
        },
         {
            "path": "/login",
            "roles": [],
            "controller": controller.login,
            "type": "post",
            "authorization": false
        },
         {
            "path": "/confirmation",
            "roles": [],
            "controller": controller.confirmEmail,
            "type": "get",
            "authorization": false
        },
         {
            "path": "/me",
            "roles": ["User","Admin", "Retailer", "Reviewer"],
            "controller": controller.me,
            "type": "get",
            "authorization": true

        
        },
         {
            "path": "/",
            "roles": [],
            "controller": controller.text,
            "type": "get",
            "authorization": false

        }
    ]
module.exports = userConfig;