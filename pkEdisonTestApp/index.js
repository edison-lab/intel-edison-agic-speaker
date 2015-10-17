'use strict';

/*
 * pkEdisonApp
 *
 * index
 *
 * Copyright (c) 2015
 * Licensed under the MIT license.
 */

var SioProxy = require('./lib/sioproxy');
var LedProxy = require('./lib/pca9685proxy');

var debug = require('debug')('verbose');

var socket = new SioProxy(false);
var led = new LedProxy([0x40]);

// internal use
var _mode = 0;
var _rot = 0;
var _rotm = 0;

socket.connect('http://localhost:8888');

socket
    .on('all', function(data){
        led.writeAll(data.values[0]);
    })
    .on('rot', function(data){
        led.write(_rot, data.values[0]);
        _rotm = (_rotm + 1) % 2;
        if(_rotm === 0){
            _rot = (_rot + 1) % 16;
        }
    })
    .on('para', function(data){
        led.write(0, data.values[0]);
        led.write(1, data.values[0]);
        led.write(2, data.values[0]);
        led.write(3, data.values[1]);
        led.write(4, data.values[1]);

        led.write(5, data.values[1]);
        led.write(6, data.values[2]);
        led.write(7, data.values[2]);
        led.write(8, data.values[2]);
        led.write(9, data.values[3]);
        led.write(10, data.values[3]);
        led.write(11, data.values[3]);
        led.write(12, data.values[4]);

        led.write(13, data.values[4]);
        led.write(14, data.values[4]);
        led.write(15, data.values[4]);
    })
    .on('allon', function(){
        led.writeAll(3000);
        _mode = -99;
    })
    .on('off', function(){
        led.writeAll(0);
        _mode = -99;
    })
    .on('default', function(data){
        if(_mode > 0) led.write(data.ch, data.values[0]);
    })
    .on('mode', function(data){
        _mode = data;
        debug('mode', _mode);
        socket.emit('mode', {id:socket.name, value:_mode});
    });

led.setup();

process.on('SIGINT', function(){
	  console.log("Exiting");
    led.exit();
	  process.exit(0);
});
