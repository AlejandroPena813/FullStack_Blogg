//node crypto lib
const crypto = require('crypto').randomBytes(256).toString('hex');//used in secret

module.exports = {//HAD TO FIX URI!!!!
    uri: 'mongodb://localhost:27017/mean-angular-2',//mongoose.connect() tying index.js, 27017 is port shown during mongod 
    secret: crypto,//for tokens etc, our server will know proper encryption through this
    db: 'mean-angular-2'

}