var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');

var session = require('express-session');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

var http = require('http');

var server = http.createServer(app);

var socket = require('socket.io');
var port = normalizePort(process.env.PORT || '3000');
var io = socket.listen(app.listen(port));

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }

  if (port >= 0) {
    return port;
  }

  return false;
}

// var app = express();

// var port = normalizePort(process.env.PORT || '3000');
// app.set('port', port);
// var http = require('http');

// var server = http.createServer(app);

// server.listen(port);

// function normalizePort(val) {
//   var port = parseInt(val, 10);

//   if (isNaN(port)) {
//     // named pipe
//     return val;
//   }

//   if (port >= 0) {
//     // port number
//     return port;
//   }

//   return false;

// }

const db = require('./server/db');
db.setUpConnection();

// view engine setup
app.set('views', path.join(__dirname, 'dist'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'dist/assets')));

app.use(session({
  secret: 'mysecret',
  key: 'NODESESSION',
  cookie: {
      "path":"/",
      "maxAge": null,
      "httpOnly": true
    }
}))

// const postroutes = require('./routes/index');

app.use('/', index);

// chatroom ----------------------------------------------------- START

var users = {};

function getUsers(users){
  var tmp = users;
  var result = [];
  for (i in tmp){
    result.push(tmp[i])
  }
  // result = result.join(', ')
  return result;
}

function boldText(text){
  return '<strong>'+text+'</strong>'
}

io.sockets.on('connection',function(client){

    console.log(users);

    client.on('hello',function(data){

        users[client.id] = data.name;

        // client.emit('message', {image: data.image, name: data.name, text: ' Добро пожаловать в чат, '+data.name});
        
        client.emit('users', {users: getUsers(users), type: 'NEW_USER'});

        client.broadcast.emit('message', {image: data.image, name: data.name, text: data.name+' присоединился к чату', user: data.name});
        client.broadcast.emit('users', {users: data.name, type: 'UPDATE_USERS'});

        console.log(users);

    })

    client.on('message',function(data){
        console.log(data)
        var getText = data.text.replace('<','&lt;').replace('>','&gt;');
        io.sockets.emit('message', {image: data.image, name: data.name, text: getText});
    })

    client.on('left',function(data){
        console.log('LEFT------------------------->>>')
        io.sockets.emit('message', {image: data.image, name: data.name, text: data.name+' покинул чат:('});
    })

    client.on('disconnect',function(data){

        var userName;

        for (i in users){
            if (client.id == i){
                userName = users[i];
                delete users[i];
                break;
            }
        }

        io.sockets.emit('users', {users: userName, type: 'LEFT_USER'});

        console.log(users)

    })

        // if (Object.keys(users).length>0){
        //     client.emit('hello','В чате уже: '+boldText(getUsers(users)));
        //     client.emit('users',{name: getUsers(users), type: 2});
        // } else {
        //     client.emit('hello','Кроме вас в чате никого нет :(');
        // }

        // // users[data.id] = data.name;

        // var newName = true;

        // for (i in users){
        //     if (data.name == i){
        //         newName = false;
        //     }
        // }

        // if (newName){
        //     io.sockets.emit('users',{name: data.name, type: 1});
        // }

        // users[data.name] = {
        //     ClientID: client.id,
        //     ID: data.id
        // }

        // client.emit('hello','Добро пожаловать в чат '+boldText(data.name));
        // client.broadcast.emit('hello','В чате появился '+boldText(data.name));

        // io.sockets.emit('users',getUsers(users));

        // console.log(users);

    // client.on('disconnect',function(data){

    //     var isUser = false;

    //     for (i in users){
    //         var tmp = i;
    //         console.log(tmp)
    //         for (item in users[i]){
    //             if (client.id == users[i][item]){
    //                 isUser = true;
    //                 io.sockets.emit('disconnect',boldText(tmp)+' покинул чат :(');
    //                 io.sockets.emit('users',{name: tmp, type: 0});
    //                 delete users[tmp];
    //                 break;
    //             }
    //         }
    //     }

    // })

})

// chatroom ----------------------------------------------------- END

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
