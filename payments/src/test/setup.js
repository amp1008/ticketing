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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongodb_memory_server_1 = require("mongodb-memory-server");
var mongoose_1 = __importDefault(require("mongoose"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var mongo;
jest.mock('../nats-wrapper');
// jest.mock('../stripe');
process.env.STRIPE_KEY = 'sk_test_51IfimaSI8WqdBX9ivGpyGGo3XwdFnjt2iPcw1vIRSYWMLLjhLCw9XXumZ8jPBBvY7cmxwfepNBWbLeXndZO4lUqB00pZuIeA5b';
beforeAll(function () { return __awaiter(void 0, void 0, void 0, function () {
    var mongoURI;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                process.env.JWT_KEY = 'asdfgh';
                mongo = new mongodb_memory_server_1.MongoMemoryServer();
                return [4 /*yield*/, mongo.getUri()];
            case 1:
                mongoURI = _a.sent();
                return [4 /*yield*/, mongoose_1.default.connect(mongoURI, {
                        useNewUrlParser: true,
                        useUnifiedTopology: true
                    })];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
    var collections, _i, collections_1, collection;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                jest.clearAllMocks();
                return [4 /*yield*/, mongoose_1.default.connection.db.collections()];
            case 1:
                collections = _a.sent();
                _i = 0, collections_1 = collections;
                _a.label = 2;
            case 2:
                if (!(_i < collections_1.length)) return [3 /*break*/, 5];
                collection = collections_1[_i];
                return [4 /*yield*/, collection.deleteMany({})];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 2];
            case 5: return [2 /*return*/];
        }
    });
}); });
afterAll(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, mongo.stop()];
            case 1:
                _a.sent();
                return [4 /*yield*/, mongoose_1.default.connection.close()];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
global.signin = function (id) {
    if (id === void 0) { id = ''; }
    var payload = {
        id: id || new mongoose_1.default.Types.ObjectId().toHexString(),
        email: "test123@test.com"
    };
    var token = jsonwebtoken_1.default.sign(payload, process.env.JWT_KEY);
    var jsonObj = {
        jwt: token
    };
    var base64 = Buffer.from(JSON.stringify(jsonObj)).toString('base64');
    return ["express:sess=" + base64];
};
