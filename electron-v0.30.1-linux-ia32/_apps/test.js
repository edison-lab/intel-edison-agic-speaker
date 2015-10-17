'use strict';

var app = require('app');
var BrowserWindow = require('browser-window');
var ipc = require('ipc');

var server = require('http').createServer();
var io = require('socket.io')(server);

require('crash-reporter').start();

var mainWindow = null;

server.listen(8888);

app.on('window-all-closed', function() {
    if (process.platform !== 'darwin'){
        app.quit();
    }
});

app.on('ready', function() {
    mainWindow = new BrowserWindow({width: 640, height: 480});

    mainWindow.loadUrl('file://' + __dirname + '/index.html');

    mainWindow.webContents.on('did-finish-load', function(){
        // console.log('did-finish');
    });

    mainWindow.on('closed', function() {
        mainWindow = null;
    });
});


ipc
    .on('_debug', function(event, arg) {
        console.log(arg);
    })
    .on('_iled', function(event, arg){
        io.emit('para', {values: [
            Math.floor(Math.pow(arg[0], 1.3)),
            Math.floor(Math.pow(arg[1], 1.3)),
            Math.floor(Math.pow(arg[2], 1.3)),
            Math.floor(Math.pow(arg[3], 1.3)),
            Math.floor(Math.pow(arg[4], 1.3))
        ]});
    })
    .on('_rot', function(event, arg){
        io.emit('rot', {values: [
            Math.floor(Math.pow(arg[0], 1.3))
        ]});
    })
    .on('_led', function(event, arg){
        io.emit('all', {values: [Math.floor(Math.pow(arg, 1.3))]});
    });
