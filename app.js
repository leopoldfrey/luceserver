var express     	= require("express");
var http        	= require("http");
var serveIndex  	= require("serve-index");
var WebSocket   	= require("ws");
var WebSocketServer	= WebSocket.Server;
var app         	= express();
var server 			  = http.createServer(app);
var shortid       = require('shortid');

/* PARAMETERS */

// use alternate localhost and the port Heroku assigns to $PORT
const port = process.env.PORT || 4000;

app.get('/',function(req,res){
    res.sendFile(__dirname + "/public/index.html");
});

app.get('/index.html',function(req,res){
      res.sendFile(__dirname + "/public/index.html");
});

/*
app.get('/test.html',function(req,res){
      res.sendFile(__dirname + "/public/test.html");
});

app.get('/controller.html',function(req,res){
      res.sendFile(__dirname + "/public/controller.html");
});//*/

/*----------- Static Files -----------*/
app.use('/js', express.static('public/js'));
//app.use('/textes', express.static('public/textes'));
//app.use('/textes', serveIndex(__dirname + '/textes'));

server.listen(port,function() {
    console.log("| Web Server listening port " + port);
});

/*-------- USERS -------*/
var users = [];

function newId() {
  u = shortid.generate();
  users.push(u);
  return u;
}

/*----------- WS Server -----------*/

const wss = new WebSocketServer({
    server: server,
    autoAcceptConnections: true
});

wss.closeTimeout = 180 * 1000;

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('| WebSocket received : %s', message);

    /*var input = JSON.parse(message);
    
    switch(input.command) {
      case "newController":
        id = newId();
        //console.log("New Controller ["+id+"]");
        ws.send(
          JSON.stringify({
            charset : 'utf8mb4', 
            command: "id",
            id: id
        }));
        break;
      case "newUser":
        id = newId();
        //console.log("New User ["+id+"]");
        ws.send(
          JSON.stringify({
            charset : 'utf8mb4', 
            command: "id",
            id: id
        }));
        break;
      case "clear":
        //console.log("TODO Clear");
        if(wss)
        {
          wss.clients.forEach(function each(client) {
            client.send(
              JSON.stringify(
              {
                charset : 'utf8mb4', 
                command: "clear"
              }));
          });
        }
        break;
      case "start":
        //console.log("TODO Start");
        if(wss)
        {
          wss.clients.forEach(function each(client) {
            client.send(
              JSON.stringify(
              {
                charset : 'utf8mb4', 
                command: "start"
              }));
          });
        }
        break;
      case "stop":
        //console.log("TODO Stop");
        if(wss)
        {
          wss.clients.forEach(function each(client) {
            client.send(
              JSON.stringify(
              {
                charset : 'utf8mb4', 
                command: "stop"
              }));
          });
        }
        break;
      case "reset":
        //console.log("TODO Reset");
        if(wss)
        {
          wss.clients.forEach(function each(client) {
            client.send(
              JSON.stringify(
              {
                charset : 'utf8mb4', 
                command: "reset"
              }));
          });
        }
        break;
      case "load":
        //console.log("TODO Load "+input.filename);
        if(wss)
        {
          wss.clients.forEach(function each(client) {
            client.send(
              JSON.stringify(
              {
                charset : 'utf8mb4', 
                command: "load",
                filename: input.filename
              }));
          });
        }
        break;
      case "fontsize":
        //console.log("TODO Fontsize "+input.fontsize);
        if(wss)
        {
          wss.clients.forEach(function each(client) {
            client.send(
              JSON.stringify(
              {
                charset : 'utf8mb4', 
                command: "fontsize",
                fontsize: input.fontsize
              }));
          });
        }
        break;
      case "speed":
        //console.log("TODO Speed "+input.speed);
        if(wss)
        {
          wss.clients.forEach(function each(client) {
            client.send(
              JSON.stringify(
              {
                charset : 'utf8mb4', 
                command: "speed",
                speed: input.speed
              }));
          });
        }
        break;
      case "mode":
        //console.log("TODO mode "+input.mode);
        if(wss)
        {
          wss.clients.forEach(function each(client) {
            client.send(
              JSON.stringify(
              {
                charset : 'utf8mb4', 
                command: "mode",
                mode: input.mode
              }));
          });
        }
        break;
      case "resetTime":
        //console.log("TODO resetTime "+input.time);
        if(wss)
        {
          wss.clients.forEach(function each(client) {
            client.send(
              JSON.stringify(
              {
                charset : 'utf8mb4', 
                command: "resetTime",
                time: input.time
              }));
          });
        }
        break;
      case "waitTime":
        //console.log("TODO waitTime "+input.time);
        if(wss)
        {
          wss.clients.forEach(function each(client) {
            client.send(
              JSON.stringify(
              {
                charset : 'utf8mb4', 
                command: "waitTime",
                time: input.time
              }));
          });
        }
        break;
      case "getUsers":
        //console.log("TODO getUsers");
        if(wss)
        {
          wss.clients.forEach(function each(client) {
            client.send(
              JSON.stringify(
              {
                charset : 'utf8mb4', 
                command: "whosthere",
                replyTo: input.id
              }));
          });
        }
        break;
      case "imthere":
        //console.log("TODO getUsers");
        if(wss)
        {
          wss.clients.forEach(function each(client) {
            client.send(JSON.stringify(input));
          });
        }
        break;
      case "refresh":
        //console.log("TODO getUsers");
        if(wss)
        {
          wss.clients.forEach(function each(client) {
            client.send(JSON.stringify(
              {
                charset : 'utf8mb4', 
                command: "refresh"
              }));
          });
        }
        break;
      case "finished":
        console.log("TODO finished "+input.id);
        break;
      default:
  			console.log('* ignored : '+input);
  			break;
    }//*/
  });
});