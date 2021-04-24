"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.natsWrapper = void 0;
var node_nats_streaming_1 = __importDefault(require("node-nats-streaming"));
var NatsWrapper = /** @class */ (function () {
    function NatsWrapper() {
    }
    Object.defineProperty(NatsWrapper.prototype, "client", {
        get: function () {
            if (!this._client) {
                throw new Error('Cannot access NATS client before connect');
            }
            return this._client;
        },
        enumerable: false,
        configurable: true
    });
    NatsWrapper.prototype.connect = function (clusterID, clientID, url) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this._client = node_nats_streaming_1.default.connect(clusterID, clientID, { url: url });
            _this._client.on('connect', function () {
                resolve();
            });
            _this._client.on('error', function (err) {
                reject(err);
            });
        });
    };
    NatsWrapper.prototype.getClient = function () {
        return this._client;
    };
    return NatsWrapper;
}());
var natsWrapper = new NatsWrapper();
exports.natsWrapper = natsWrapper;
