//node crypto lib
const crypto = require('crypto').randomBytes(256).toString('hex');//used in secret

module.exports = {
    uri: 'mongodb://localhost:27017' + this.db,//mongoose.connect() tying index.js, 27017 is port shown during mongod 
    secret: crypto,//for tokens etc, our server will know proper encryption through this
    db: 'mean-angular-2'

}