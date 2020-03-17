/*var express     	= require("express");
var http        	= require("http");
var serveIndex  	= require("serve-index");
var WebSocket   	= require("ws");
var WebSocketServer	= WebSocket.Server;
var app         	= express();
var server 			  = http.createServer(app);
var shortid       = require('shortid');

// use alternate localhost and the port Heroku assigns to $PORT
const port = process.env.PORT || 4000;

app.get('/',function(req,res){
    res.sendFile(__dirname + "/public/index.html");
});

app.get('/index.html',function(req,res){
      res.sendFile(__dirname + "/public/index.html");
});

//----------- Static Files -----------

app.use('/js', express.static('public/js'));
//app.use('/textes', express.static('public/textes'));
//app.use('/textes', serveIndex(__dirname + '/textes'));

server.listen(port,function() {
    console.log("| Web Server listening port " + port);
});

//-------- USERS ------
var users = [];

function newId() {
  u = shortid.generate();
  users.push(u);
  return u;
}

//----------- WS Server -----------

const wss = new WebSocketServer({
    server: server,
    autoAcceptConnections: true
});

wss.closeTimeout = 180 * 1000;

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('| WebSocket received : %s', message);

    var input = JSON.parse(message);
    
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
      default:
  			console.log('* ignored : '+input);
  			break;
    }
  });
});
//*/

//#!/usr/bin/env node
const fs = require('fs');
const http = require('http');
const body = require('body-parser');
const express = require('express');
const socketio = require('socket.io');
const program = require('commander');
const DMX = require('@node-dmx/dmx-library');
const A = DMX.Animation;

program
  .version('0.0.1')
  .option('-c, --config <file>', 'Read config from file [dmx-web.json]', 'dmx-web.json')
  .parse(process.argv);

const config = JSON.parse(fs.readFileSync(program.config, 'utf8'));

function DMXWeb() {
  const app = express();
  const server = http.createServer(app);
  const io = socketio.listen(server);

  const dmx = new DMX(config);

  for (const universe in config.universes) {
    console.log("Adding universe : "+universe)
    dmx.addUniverse(
      universe,
      config.universes[universe].output.driver,
      config.universes[universe].output.device,
      config.universes[universe].output.options
    );
  }

  const listenPort = config.server.listen_port || 8080;
  const listenHost = config.server.listen_host || '::';

  server.listen(listenPort, listenHost, null, () => {
    if (config.server.uid && config.server.gid) {
      try {
        process.setuid(config.server.uid);
        process.setgid(config.server.gid);
      } catch (err) {
        console.log(err);
        process.exit(1);
      }
    }
  });

  app.use(body.json());

  app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index2.html');
  });

  app.get('/config', (req, res) => {
    const response = {'devices': dmx.devices, 'universes': {}};

    Object.keys(config.universes).forEach(key => {
      response.universes[key] = config.universes[key].devices;
    });

    res.json(response);
  });

  app.get('/state/:universe', (req, res) => {
    if (!(req.params.universe in dmx.universes)) {
      res.status(404).json({'error': 'universe not found'});
      return;
    }

    res.json({'state': dmx.universeToObject(req.params.universe)});
  });

  app.post('/state/:universe', (req, res) => {
    if (!(req.params.universe in dmx.universes)) {
      res.status(404).json({'error': 'universe not found'});
      return;
    }

    dmx.update(req.params.universe, req.body);
    res.json({'state': dmx.universeToObject(req.params.universe)});
  });

  app.post('/animation/:universe', (req, res) => {
    try {
      const universe = dmx.universes[req.params.universe];

      // preserve old states
      const old = dmx.universeToObject(req.params.universe);

      const animation = new A();

      for (const step in req.body) {
        console.log("add animation step "+JSON.stringify(req.body[step].to)+" "+req.body[step].duration+" "+req.body[step].options);
        animation.add(
          req.body[step].to,
          req.body[step].duration || 0,
          req.body[step].options || {}
        );
      }
      animation.add(old, 0);
      console.log("Start animation on universe : "+universe);
      animation.run(universe, function(){
        console.log("Animation finished !");
      });
      res.json({'success': true});
    } catch (e) {
      console.log(e);
      res.json({'error': String(e)});
    }
  });

  io.sockets.on('connection', socket => {
    socket.emit('init', {'devices': dmx.devices, 'setup': config});

    socket.on('request_refresh', () => {
      for (const universe in config.universes) {
        socket.emit('update', universe, dmx.universeToObject(universe));
      }
    });

    socket.on('update', (universe, update) => {
      dmx.update(universe, update);
    });

    dmx.on('update', (universe, update) => {
      socket.emit('update', universe, update);
    });
  });
}

DMXWeb();

console.log("connect to http://localhost:8080");



