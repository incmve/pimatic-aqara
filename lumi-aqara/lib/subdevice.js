'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var events = require('events');

var _require = require('../constants');

var Subdevice = function (_events$EventEmitter) {
    _inherits(Subdevice, _events$EventEmitter);

    function Subdevice(opts) {
        _classCallCheck(this, Subdevice);

        var _this = _possibleConstructorReturn(this, (Subdevice.__proto__ || Object.getPrototypeOf(Subdevice)).call(this));

        _this._sid = opts.sid;
        _this._type = opts.type;

        _this._voltage = null;
        _this._state = null;
        _this._action = false;

        if(_this._type === 'motion') {
            _this._lux = null;
        }
        if(_this._type === 'temperature') {
            _this._temperature = null;
            _this._pressure = null;
            _this._humidity = null;
        }
        if(_this._type === 'cube') {
            _this._rotateDegrees = 0;
        }
        return _this;
    }

    _createClass(Subdevice, [{
        key: '_handleState',
        value: function _handleState(data) {

            this._action = false;
            // Save the battery voltage
            if (typeof data.voltage !== 'undefined') this._voltage = data.voltage;

            // Save the lux value for sensors with a lux sensor
            if (typeof data.lux !== 'undefined') this._lux = data.lux;

            // If no motion
            if (typeof data.no_motion !== 'undefined'){
                this._action = true;
                this._state = false;
            }

            // If rotating cube
            if (typeof data.rotate !== 'undefined'){
                this._state = 'rotate';
                this._rotateDegrees = parseInt(Math.round(data.rotate.replace(',','.')));
                this._action = true;
            } else {
                if(typeof this._rotateDegrees !== 'undefined') {
                    this._rotateDegrees = 0;
                }
            }

            // Get temperature
            if (typeof data.temperature !== 'undefined') this._temperature = Math.round(data.temperature / 10) / 10;

            // Get humidity
            if (typeof data.humidity !== 'undefined') this._humidity = Math.round(data.humidity / 10) / 10;

            // Get pressure
            if (typeof data.pressure !== 'undefined') this._pressure = Math.round(data.pressure / 100) / 10;


            // If receiving a status
            if (typeof data.status !== 'undefined' && data.status !== 'iam'){
                this._action = true;
                // Get the state
                switch (this._type) {
                    case "magnet":
                        this._state = data.status === 'open';
                        break;
                    case "motion":
                        this._state = true;
                        break;
                    case "button":
                    case "cube":
                        this._state = data.status;
                        break;
                    case "leak":
                        this._state = data.status === 'leak';
                        break;
                }
            }
            // If a switch
            if (typeof data.channel_0 !== 'undefined'){
                this._action = true;
                this._state = 'left_click'
            };

            if (typeof data.channel_1 !== 'undefined'){
                this._action = true;
                this._state = 'right_click'
            };

            if (typeof data.dual_channel !== 'undefined'){
                this._action = true;
                this._state = 'both_click'
            };

            this.emit('report');
        }
    }, {
        key: 'getSid',
        value: function getSid() {
            return this._sid;
        }
    }, {
        key: 'getType',
        value: function getType() {
            return this._type;
        }
    }, {
        key: 'getTemperature',
        value: function getTemperature() {
            return this._temperature;
        }
    }, {
        key: 'getHumidity',
        value: function getHumidity() {
            return this._humidity;
        }
    }, {
        key: 'getPressure',
        value: function getPressure() {
            return this._pressure;
        }
    }, {
        key: 'getBatteryVoltage',
        value: function getBatteryVoltage() {
            return this._voltage;
        }

    }, {
        key: 'stateUpdated',
        value: function getState() {
            return this._action;
        }
    }, {
        key: 'getState',
        value: function getState() {
            return this._state;
        }
    }, {
        key: 'isLeaking',
        value: function getLeaking() {
            return this._state;
        }
    }, {
        key: 'isPresent',
        value: function isPresent() {
            return this._state;
        }
    }, {
        key: 'isOpen',
        value: function isOpen() {
            return this._state;
        }
    }, {
        key: 'getLux',
        value: function getLux() {
            return this._lux;
        }
    }, {
        key: 'getRotation',
        value: function getRotation() {
            return this._rotateDegrees;
        }
    }, {
        key: 'getBatteryPercentage',
        value: function getBatteryPercentage(min_volt, max_volt) {
            var perc = 100 - Math.round((max_volt - this._voltage) / (max_volt - min_volt) * 100);
            return Math.min(Math.max(perc, 0), 100);
        }
    }]);

    return Subdevice;
}(events.EventEmitter);

module.exports = Subdevice;
