import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface TicketAttrs {
    title: string;
    price: number;
    userId: string;
}

interface TicketDoc extends mongoose.Document {
    title: string;
    price: number;
    userId: string;
    version: number;
    orderId?: string;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
    createTicket(attrs: TicketAttrs): TicketDoc;
}

let ticketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    orderId: {
        type: String,
        required: false
    }
}, {
    toJSON: {
        transform (doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

ticketSchema.statics.createTicket = (attrs: TicketAttrs) => {
    return new Tickets(attrs);
};

ticketSchema.set('versionKey', 'version');
ticketSchema.plugin(updateIfCurrentPlugin);

let Tickets = mongoose.model<TicketDoc, TicketModel>('Tickets', ticketSchema);

export { Tickets };