import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface PaymentAttrs {
    orderId: string;
    stripeId: string;
}

interface PaymentDoc extends mongoose.Document {
    orderId: string;
    stripeId: string;
    version: number;
}

interface PaymentModel extends mongoose.Model<PaymentDoc> {
    createPayment(attrs: PaymentAttrs): PaymentDoc;
}

let paymentSchema = new mongoose.Schema({
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
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

paymentSchema.set('versionKey', 'version');
paymentSchema.plugin(updateIfCurrentPlugin);

paymentSchema.statics.createPayment = (attrs: PaymentAttrs) => {
  return new Payments(attrs);
};

let Payments = mongoose.model<PaymentDoc, PaymentModel>('payments', paymentSchema);

export { Payments };