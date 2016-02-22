const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const db = require('../db');
const config = require('../config');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');
const koaJwt = require('koa-jwt');
const convert = require('koa-convert');
const debug = require('debug')('auth');


const app = new Koa();
const router = new Router();
app.use(bodyParser());

debug('body parsed');

router.post('/login', async (ctx, next) => {
    debug('enter login');
    let currentUser = {};

    let user = await db.User.findOne({
        where: {
          $or: [
            {login: ctx.request.body.login},
            {email: ctx.request.body.email}
          ]
        }
    });

    if(!user || !bcrypt.compareSync(ctx.request.body.password, user.dataValues.password)){
      debug('not valid user', user.dataValues.id);
      ctx.throw('Incorrect user or password', 401);
      return;
    }

    debug('valid user', user.dataValues.id);
    currentUser.id =  user.dataValues.id;
    currentUser.date = new Date();
    let token = jwt.sign(currentUser, config.secret);
    ctx.body = {token: token};
    ctx.status = 200;
});

let handleTestLogin = async function(ctx, next){
  debug('enter test-login', ctx.state.user);
  if (!ctx.state.user.id) {
    return ctx.throw('Bad auth data', 400);
  }
  let user;
  try {
    user = await db.User.findById(ctx.state.user.id);
    debug('trying to find test-login', user.name);
  }
  catch (err) {
    return ctx.throw('User not found', 404);
  }


  ctx.body = {user: user.email};
}

let jwtMiddleware = convert(koaJwt({ secret: config.secret }))

router.get("/test-login", convert.compose(jwtMiddleware, handleTestLogin));

app.use(router.routes());




//app.use(router.allowedMethods());

module.exports = app;



// Auth реализует POST на "/login" , котрый принимает поля {login/email:ddd, password}
// делает запрос в бд, проверяет есть ли такой пользоваеть
//  и если есть - выписывает токен
// {token: сам token}

// создаем коа роутер
// добавляем миддлеваю коа роутера
// регистрируем роуты с постом
// экспортим app из этого модуля
// в основном файле app.js используем koa-mount app.use.mount('/auth', auth) ; auth = require('/api/auth');
// app.use.mount('jwt'); проверит наличие jwt tokena
// app.use.mount('media')


//1 мидлвэар роутер