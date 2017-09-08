const User = require('../models/users');//importing user schema

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

  

  return router; // Return router object to main index.js
}