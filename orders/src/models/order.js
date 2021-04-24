"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderStatus = exports.Order = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var mongoose_update_if_current_1 = require("mongoose-update-if-current");
var common_1 = require("@amp-tickets/common");
Object.defineProperty(exports, "OrderStatus", { enumerable: true, get: function () { return common_1.OrderStatus; } });
var orderSchema = new mongoose_1.default.Schema({
    userId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: Object.values(common_1.OrderStatus)
    },
    expiresAt: {
        type: mongoose_1.default.Schema.Types.Date
    },
    ticket: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'ticket'
    }
}, {
    toJSON: {
        transform: function (doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});
orderSchema.set('versionKey', 'version');
orderSchema.plugin(mongoose_update_if_current_1.updateIfCurrentPlugin);
orderSchema.statics.createOrder = function (attrs) {
    return new Order(attrs);
};
var Order = mongoose_1.default.model('order', orderSchema);
exports.Order = Order;
