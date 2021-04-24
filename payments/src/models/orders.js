"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Orders = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var mongoose_update_if_current_1 = require("mongoose-update-if-current");
var common_1 = require("@amp-tickets/common");
var orderSchema = new mongoose_1.default.Schema({
    version: {
        type: Number,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: Object.values(common_1.OrderStatus)
    },
    price: {
        type: Number,
        required: true
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
    return new Orders({
        _id: attrs.id,
        version: attrs.version,
        userId: attrs.userId,
        status: attrs.status,
        price: attrs.price
    });
};
var Orders = mongoose_1.default.model('orders', orderSchema);
exports.Orders = Orders;
