import mongoose from 'mongoose';
import { Password } from "../services/password";

interface UserAttrs {
    email: string;
    password: string;
}

interface UserModel extends mongoose.Model<UserDoc> {
    createUser(user: UserAttrs): UserDoc;
}

interface UserDoc extends mongoose.Document {
    email: string;
    password: string;
}

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, {
    toJSON: {
        transform (doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.password;
        }
    },
    versionKey: false
});

UserSchema.pre('save', async function (done) {
    if (this.isModified('password')) {
        let hashedPassword = await Password.hashPassword(this.get('password'));
        this.set('password', hashedPassword);
    }
    done();
})

UserSchema.statics.createUser = (user: UserAttrs) => {
    return new User(user);
};

const User = mongoose.model<UserDoc, UserModel>('User', UserSchema);

export { User };