const User = require('../models/user');//importing user schema
const jwt = require('jsonwebtoken');//maintains user login sess?? in login f(x)
const config = require('../config/database');

//express router

module.exports = (router) => {

    router.post('/register', (req, res)=> {

        if(!req.body.email){
            res.json({ success: false, message: 'You must provide an e-mail'});
        } else{
            if(!req.body.username){
                res.json({success: false, message: 'You must provide a username'});
            } else{
                if(!req.body.password){
                    res.json({success: false, message: 'You must provide a password'})
                } else{
                    let user = new User({
                        email: req.body.email.toLowerCase(),//enforcing lowercase
                        username: req.body.username.toLowerCase(),
                        password: req.body.password
                    });
 user.save((err) => {
            // Check if error occured
            if (err) {
              // Check if error is an error indicating duplicate account
              if (err.code === 11000) {
                res.json({ success: false, message: 'Username or e-mail already exists' }); // Return error
              } else {
                // Check if error is a validation rror
                if (err.errors) {
                  // Check if validation error is in the email field
                  if (err.errors.email) {
                    res.json({ success: false, message: err.errors.email.message }); // Return error
                  } else {
                    // Check if validation error is in the username field
                    if (err.errors.username) {
                      res.json({ success: false, message: err.errors.username.message }); // Return error
                    } else {
                      // Check if validation error is in the password field
                      if (err.errors.password) {
                        res.json({ success: false, message: err.errors.password.message }); // Return error
                      } else {
                        res.json({ success: false, message: err }); // Return any other error not already covered
                      }
                    }
                  }
                } else {
                  res.json({ success: false, message: 'Could not save user. Error: ', err }); // Return error if not related to validation
                }
              }
            } else {
              res.json({ success: true, message: 'Acount registered!' }); // Return success
            }
          });
        }
      }
    }
  });
  /////////////////
  ////////THESE EQUATIONS CHECK FOR ERRORS WHILE USER TYPES IN REG PAGE, called in auth.service.ts
  router.get('/checkEmail/:email', (req, res) => {
    if(!req.params.email){
      res.json({success: false, message: 'Email not provided'});
    } else{
      User.findOne({email: req.params.email}, (err, user) => {
        if(err){
          res.json({succes: false, message: err});
        } else{
          if(user){
            res.json({success: false, message: 'E-mail is already taken'});
          } else{
            res.json({ success: true, message:'E-mail is available'});
          }
        }
      });
    }
  });

  router.get('/checkUsername/:username', (req, res) => {
    if(!req.params.username){
      res.json({success: false, message: 'Username not provided'});
    } else{
      User.findOne({username: req.params.username}, (err, user) => {
        if(err){
          res.json({succes: false, message: err});
        } else{
          if(user){
            res.json({success: false, message: 'Username is already taken'});
          } else{
            res.json({ success: true, message:'Username is available'});
          }
        }
      });
    }
  });

/////////////////////////////////////login backend
  router.post('/login', (req, res) => {
    //res.send('test');
    if(!req.body.username){
      res.json({ success: false, message: 'No username was provided'});
    } else{
      if(!req.body.password){
        res.json({ success: false, message: 'No password was provided'});
      } else{
        User.findOne({ username: req.body.username.toLowerCase() }, (err, user) => {
          if(err){
            res.json({ success: false, message: err});
          } else{
            if(!user){
              res.json({success: false, message: 'Username not found'});
            } else{//user found, now auth passw
              //comparePassw is from users.js, decrypt
              const validPassword = user.comparePassword(req.body.password);
              if(!validPassword) {
                res.json({ success: false, message: 'Password invalid' });
              } else{//success
                //token encrypts user id, along with 'secret' bcrypt passw
                const token = jwt.sign({
                  userId: user._id//user obj create in findOne
                }, config.secret, {expiresIn: '24h'});//logged out after 24h
//ties user to token according to chosen _id, and 'secret' version password
//Also Mongoose gives _id to any object.
                res.json({success: true, message: 'Success', token: token, user: {username: user.username} });
              }
            }
          } //14:37
        });
      }
    }

  });
////////////////////////

////////Profile page, display user data
  //middleware, grab header info and then display it in view
  router.use((req, res, next) => {
    const token = req.headers['authorization'];//variable from auth.service with token info
    if(!token){
      res.json({success: false, message: 'No token provided'});
    } else{
      jwt.verify(token, config.secret, (err, decoded) => {
        if(err){
          res.json({success: false, message: 'Token invalid: '+ err});
        } else{//token passed verification
          req.decoded = decoded; //decoded is the secret, decrypted value of token and passw
          next();
        }
      });
    }
  }); //any routes that come after this middleware, will use this middleware


  router.get('/profile', (req, res) => {
    User.findOne({_id: req.decoded.userId}).select('username email').exec((err, user) => {
      if(err){
        res.json({ success: false, message: err });
      } else {
        if(!user){
          res.json({success: false, message: 'User not found'});
        } else{
          res.json({success: true, user: user});
        }
      }
    });
  });

////////////

router.get('/publicProfile/:username', (req, res) => {
  if(!req.params.username){ //username above in url, to grab in params
    res.json({success: false, message: 'No username was provided'});
  } else{
    User.findOne({username: req.params.username}).select('username email').exec((err, user) => {
      if(err){
        res.json({success: false, message: 'Something went wrong'});
      } else{
        if(!user){
          res.json({success: false, message: 'Username not found'});
        } else{
          res.json({success: true, user: user});
        }
      }
    });
  }
});

  return router; // Return router object to main index.js
}