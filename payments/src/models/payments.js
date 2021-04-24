"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payments = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var mongoose_update_if_current_1 = require("mongoose-update-if-current");
var paymentSchema = new mongoose_1.default.Schema({
    orderId: {
        type: String,
        required: true
    },
    stripeId: {
        type: String,
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
paymentSchema.set('versionKey', 'version');
paymentSchema.plugin(mongoose_update_if_current_1.updateIfCurrentPlugin);
paymentSchema.statics.createPayment = function (attrs) {
    return new Payments(attrs);
};
var Payments = mongoose_1.default.model('payments', paymentSchema);
exports.Payments = Payments;
