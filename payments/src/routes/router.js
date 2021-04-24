"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
var express_1 = require("express");
var express_validator_1 = require("express-validator");
var common_1 = require("@amp-tickets/common");
var orders_1 = require("../models/orders");
var payments_1 = require("../models/payments");
var stripe_1 = require("../stripe");
var payment_completed_publisher_1 = require("../events/publishers/payment-completed-publisher");
var nats_wrapper_1 = require("../nats-wrapper");
var router = express_1.Router();
exports.router = router;
router.post('/api/payments', common_1.requireAuth, [
    express_validator_1.body('token').not().isEmpty(),
    express_validator_1.body('orderId').not().isEmpty()
], common_1.validateRequest, makePayment);
function makePayment(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, orderId, token, existingOrder, stripeDetails, payment, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = req.body || {}, orderId = _a.orderId, token = _a.token;
                    return [4 /*yield*/, orders_1.Orders.findById(orderId)];
                case 1:
                    existingOrder = _b.sent();
                    if (!existingOrder) {
                        throw new common_1.NotFoundError();
                    }
                    if (existingOrder.userId !== req.current_user.id) {
                        throw new common_1.NotAuthorizedError();
                    }
                    if (existingOrder.status === common_1.OrderStatus.Cancelled) {
                        throw new common_1.BadRequestError('Cannot pay for cancelled order', 'ORDER');
                    }
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 6, , 7]);
                    console.log(existingOrder.price);
                    console.log("token is " + token);
                    return [4 /*yield*/, stripe_1.stripe.charges.create({
                            amount: existingOrder.price * 100,
                            currency: 'inr',
                            source: token,
                            description: 'Deducting the amount for purchasing ticket'
                        })];
                case 3:
                    stripeDetails = _b.sent();
                    console.log(stripeDetails);
                    payment = payments_1.Payments.createPayment({
                        orderId: orderId,
                        stripeId: stripeDetails.id
                    });
                    return [4 /*yield*/, payment.save()];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, new payment_completed_publisher_1.PaymentCompletedPublisher(nats_wrapper_1.natsWrapper.client).publish({
                            id: payment.id,
                            orderId: payment.orderId,
                            stripeId: payment.stripeId
                        })];
                case 5:
                    _b.sent();
                    res.status(201).send({
                        result: 'success'
                    });
                    return [3 /*break*/, 7];
                case 6:
                    error_1 = _b.sent();
                    console.error(error_1);
                    res.status(500).send({
                        error: ['Failed to make payment']
                    });
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    });
}
