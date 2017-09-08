const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

let emailLengthChecker = (email) => { //Validation, tied to authentication.js
    if(!email){
        return false;
    } else{
        if(email.length < 5 || email.length > 30){
            return false;
        } else{
            return true;
        }
    }
};

let validEmailChecker = (email) => {
    if(!email){
        return false;
    } else {
        // Regular expression to test for a valid e-mail, tests to see that email has all proper characters
        const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        return regExp.test(email); // Return regular expression test results (true or false)
    }
};

const emailValidators = [
    {//calls in function above and returns err message. This is then called below in validate field of schema.
        validator: emailLengthChecker, message: 'E-mail must be at least 5 characters but no more than 30'
    },
  {
    validator: validEmailChecker,
    message: 'Must be a valid e-mail'
  }
];
////////////////////////////////////////////////28'
//username validator
let usernameLengthChecker = (username) => {
    if(!username){
        return false;
    } else{
        if(username.length < 3 || username.length > 15){
            return false;
        } else{
            return true;
        }
    }

};

let validUsername = (username) =>{
    if(!username){
        return false;
    }
    else{
        const regExp = new RegExp(/^[a-zA-Z0-9]+$/);
        return regExp.test(username);
    }
};

const usernameValidators = [
    {
        validator: usernameLengthChecker,
        message: 'Username must be no less than 3 characters and no more than 15'
    },
    {
        validator: validUsername,
        message: 'Must be a valid username, with no special characters'
    }
]

////////////////////////all validators above schema, END of username validators

let passwordLengthChecker = (password) => {
    if(!password){
        return false;
    }else{
        if(password.length <8 || password.length >35){
            return false;
        } else{
            return true;
        }
    }
};

let validPassword = (password) => {
    if(!password){
        return false;
    } else{ //google javascript password reg expressions
        const regExp = new RegExp(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/);
        return regExp.test(password);
    }
};

const passwordValidators = [{
        validator: passwordLengthChecker,
        message: 'Password ust be at least 8 characters but no more than 35'
    }, {
        validator: validPassword,
        message: 'Must have at least one uppercase, lowercase, special character, and number'
    }];


////////////////////////////////////////

const userSchema = new Schema({
    email: {type: String, required: true, unique: true, lowercase: true, validate: emailValidators},
    username: {type: String, required: true, unique: true, lowercase: true, validate: usernameValidators},
    password: {type: String, required: true, validate: passwordValidators}
});

//before any schema saved, this middleware is processed--> encrypt passw
userSchema.pre('save', function(next) { //=> not supported yet
    if(!this.isModified('password')){
        return next();
    }
    bcrypt.hash(this.password, null, null, (err, hash) => { //this is to encrypt, need way to decrypt for user logging in
        if(err) return next(err);
        this.password = hash; //turn password into hash
        next();//exit middleware
    });
});

userSchema.methods.comparePassword = (password) => {//this will compare password hash and return bool, must implement actually logging in
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);//export statement, also model collection 'User' is created from schema 'userSchema'