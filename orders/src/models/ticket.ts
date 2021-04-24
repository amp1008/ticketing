import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

import { Order, OrderStatus } from './order';

interface TicketAttrs {
    title: string;
    price: number;
    id: string;

}

interface TicketDoc extends mongoose.Document {
    title: string;
    price: number;
    version: number;
    isReserved(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
    createTicket(attrs: TicketAttrs): TicketDoc;
}

const ticketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

ticketSchema.set('versionKey', 'version');
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.createTicket = (attrs: TicketAttrs) => {
    return new Ticket({
        _id: attrs.id,
        title: attrs.title,
        price: attrs.price
    });
};

ticketSchema.methods.isReserved = async function () {
    let existingOrder = await Order.findOne({
        ticket: this,
        status: {
            $in: [
                OrderStatus.Completed,
                OrderStatus.Created,
                OrderStatus.PendingPayment
            ]
        }
    });
    return !!existingOrder;
};

const Ticket = mongoose.model<TicketDoc, TicketModel>('ticket', ticketSchema);

export { Ticket, TicketDoc };