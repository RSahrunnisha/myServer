const jwt = require('jsonwebtoken');
const keys = require("../config/config");
const secretOrKey = keys.secretOrKey;

module.exports = authorize;

function authorize(authroles = [], checkAuth) {
  // roles param can be a single role string (e.g. Role.User or 'User') 
  // or an array of roles (e.g. [Role.Admin, Role.User] or ['Admin', 'User'])

  if (typeof authroles === 'string') {
    authroles = [authroles];
  }

  return async (req, res, next) => {
    if(checkAuth){
      const authorizationHeader = req.headers.authorization;
      let result;
      if (authorizationHeader) {
        const token = req.headers.authorization.split(' ')[1]; // Bearer <token>
        const options = {
          expiresIn: '31556926'
        };
        try {
          // verify makes sure that the token hasn't expired and has been issued by us
          result = jwt.verify(token, secretOrKey, options);

          if(!authroles.includes(result.role)){
            result = { 
              error: `Unauthorized request.`,
              status: 401
            };
            res.status(401).send(result);
          }
          else{
            req.decoded = result;
            next();
          }


          // Let's pass back the decoded token to the request object
          
          // We call next to pass execution to the subsequent middleware
        } catch (err) {
          // Throw an error just in case anything goes wrong with verification
          result = { 
              error: `Authentication error. Token invalid.`,
              status: 401
            };
            res.status(401).send(result);
          //throw new Error(err);
        }
      } else {
        result = { 
          error: `Authentication error. Token required.`,
          status: 401
        };
        res.status(401).send(result);
      }
    }else{
      next();
    }
    }
  
}
