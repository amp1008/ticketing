import mongoose from 'mongoose';
import { updateIfCurrentPlugin  } from 'mongoose-update-if-current';
import { OrderStatus } from '@amp-tickets/common';

interface OrderAttrs {
    id: string;
    version: number;
    userId: string;
    status: OrderStatus;
    price: number;
}

interface OrderDoc extends mongoose.Document {
    id: string;
    version: number;
    userId: string;
    status: OrderStatus;
    price: number;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
    createOrder(attrs: OrderAttrs): OrderDoc;
}

const orderSchema = new mongoose.Schema({
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
        enum: Object.values(OrderStatus)
    },
    price: {
        type: Number,
        required: true
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

orderSchema.set('versionKey', 'version');
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.createOrder = (attrs: OrderAttrs) => {
    return new Orders({
        _id: attrs.id,
        version: attrs.version,
        userId: attrs.userId,
        status: attrs.status,
        price: attrs.price
    });
};

const Orders = mongoose.model<OrderDoc, OrderModel>('orders', orderSchema);

export { Orders };