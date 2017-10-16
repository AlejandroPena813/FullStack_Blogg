const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

let titleLengthChecker = (title) => { //Validation, tied to authentication.js
    if(!title){
        return false;
    } else{
        if(title.length < 5 || title.length > 50){
            return false;
        } else{
            return true;
        }
    }
};

let alphaNumericTitleChecker = (title) => {
    if(!title){
        return false;
    } else {
        // Regular expression to test for a valid e-mail, tests to see that email has all proper characters
        const regExp = new RegExp(/^[a-zA-Z0-9 ]+$/);
        return regExp.test(title); // Return regular expression test results (true or false)
    }
};

const titleValidators = [
    {//calls in function above and returns err message. This is then called below in validate field of schema.
        validator: titleLengthChecker, message: 'Title must be at least 5 characters but no more than 50'
    },
  {
    validator: alphaNumericTitleChecker,
    message: 'Must be a valid alphanumeric title'
  }
];
////////////////////////////////////////////////28'
//username validator
let bodyLengthChecker = (body) => {
    if(!body){
        return false;
    } else{
        if(body.length < 5 || body.body > 500){ 
            return false;
        } else{
            return true;
        }
    }

};

const bodyValidators = [ 
    {
        validator: bodyLengthChecker,
        message: 'Body must be no less than 5 characters and no more than 500'
    }
];

////////////////////////all validators above schema, END of username validators

let commentLengthChecker = (comment) => {
    if(!comment[0]){ //different than others bc its an Array
        return false;
    }else{
        if(comment[0].length <1 || comment[0].length >200){
            return false;
        } else{
            return true;
        }
    }
};

const commentValidators = [{
        validator: commentLengthChecker,
        message: 'Comments may not exceed 200 characters'
    }
];


////////////////////////////////////////

const blogSchema = new Schema({
    title: {type: String, required: true, validate: titleValidators},
    body: {type: String, required: true, validate: bodyValidators},
    createdBy: {type: String},
    createdAt: {type: Date, default: Date.now()},
    likes: {type: Number, default: 0},
    likedBy: {type: Array},
    dislikes: {type: Number, default: 0},
    dislikedBy: {type: Array},
    comments: [//array
        {
            comment: {type: String, validate: commentValidators},//array obj
            commentator: {type: String}//19:48
        }
    ]
});

module.exports = mongoose.model('Blog', blogSchema);//export statement, also model collection 'User' is created from schema 'userSchema'