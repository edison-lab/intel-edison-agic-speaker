'use strict';

var io = require('socket.io-client');
var _ = require('lodash');
var debug = require('debug')('verbose');
var os = require('os');
var client = null;

module.exports = SioProxy;

function SioProxy(name) {
    this.name = name ? name : os.hostname();
    this.client = client;
}


SioProxy.prototype.test = function(msg){
    debug(this.name, ' >> ', msg);
};

SioProxy.prototype.on = function(channel, func){
    if(client){
        client.on(channel, func);
    }

    return client;
};

SioProxy.prototype.connect = function(url){
    if(client) client = null;

    client = io(url);
    client.emit('init', this.name);

    this.client = client;
};

SioProxy.prototype.emit = function(channel, data){
    client.emit(channel, data);
};
