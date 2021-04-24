"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.natsWrapper = void 0;
exports.natsWrapper = {
    client: {
        // publish: (subject: string, data: string, cb: () => void) => {
        //     cb();
        // }
        publish: jest.fn().mockImplementation(function (subject, data, cb) {
            cb();
        })
    }
};
