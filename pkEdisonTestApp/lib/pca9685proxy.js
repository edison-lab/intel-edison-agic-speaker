'use strict';

var _ = require('lodash');
var debug = require('debug')('verbose');

module.exports.lib = LEDController_lib;
var LEDController_lib = require('../../upm/build/src/pca9685');

module.exports = PCA9685Proxy;

function PCA9685Proxy(addresses, useNextPort){
    this.addresses = [0x40, 0x41, 0x42];
    this.controllers = [];

    if(addresses && addresses instanceof Array){
        this.addresses = addresses;
    }

    this.useNextPort = useNextPort === true ? true : false;

    debug(this.addresses, this.controllers, this.useNextPort);
}

PCA9685Proxy.prototype.setup = function(){
    this.addresses.forEach(function(el, i){
        if(i > 1){
            this.controllers.push(new LEDController_lib.PCA9685(1, el));
        }else{
            this.controllers.push(new LEDController_lib.PCA9685(LEDController_lib.PCA9685_I2C_BUS, el));
        }

        this.controllers[i].setModeSleep(true);
        this.controllers[i].setPrescaleFromHz(50);
        this.controllers[i].setModeSleep(false);

        this.controllers[i].ledOnTime(LEDController_lib.PCA9685_ALL_LED, 0);
        this.controllers[i].ledOffTime(LEDController_lib.PCA9685_ALL_LED, 3000);
    }, this);
};


PCA9685Proxy.prototype.write = function(ch, value){
    if(value > 4095){
        return;
    }
    this.controllers.forEach(function(el){
        el.ledOnTime(ch, 0);
        el.ledOffTime(ch, value);
    });
};

PCA9685Proxy.prototype.writeAll = function(value){
    if(value > 4095){
        return;
    }
    
    this.controllers.forEach(function(el){
        el.ledOnTime(LEDController_lib.PCA9685_ALL_LED, 0);
        el.ledOffTime(LEDController_lib.PCA9685_ALL_LED, value);
    });
};

PCA9685Proxy.prototype.writeToId = function(i, ch, value){
    if(value > 4095){
        return;
    }
    if(i > this.controllers.length - 1) return;

    this.controllers[i].ledOnTime(ch, 0);
    // this.ledOnTime(LEDController_lib.PCA9685_ALL_LED, 0);
    // this.controllers[i].ledOnTime(LEDController_lib.PCA9685_ALL_LED, 0);
    this.controllers[i].ledOffTime(ch, value);
};

PCA9685Proxy.prototype.exit = function(){
    this.controllers.forEach(function(el){
        el.ledFullOff(LEDController_lib.PCA9685_ALL_LED, false);
		    el.ledFullOn(LEDController_lib.PCA9685_ALL_LED, false);
    });
    this.controllers = [];
    LEDController_lib = null;
};
