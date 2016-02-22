/*const debug = require('./debug');*/
const debug = require('debug');
const config = require('./config');
const authController = require('./api/auth.js');
const Koa = require('koa');
const mount = require('./med-mount');

console.log(authController);

/*
debug.then(() => {
  console.log('done');
}, (e) => {console.log(e);});
*/


const app = new Koa();

 // response
app.use(mount('/auth', authController));

module.exports = app;
