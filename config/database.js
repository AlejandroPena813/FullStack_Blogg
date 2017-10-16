//node crypto lib
const crypto = require('crypto').randomBytes(256).toString('hex');//used in secret

module.exports = {
    //development uri
    //uri: 'mongodb://localhost:27017/mean-angular-2',//mongoose.connect() tying index.js, 27017 is port shown during mongod 
    uri: 'mongodb://alejandro:justsk8s@ds121495.mlab.com:21495/angular-2-app', //production
    secret: crypto,//for tokens etc, our server will know proper encryption through this
    //db: 'mean-angular-2'
    db: 'angular-2-app'//name doesnt matter too much?
}