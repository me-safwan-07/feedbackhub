import mongoose, {Schema, Document} from "mongoose";


export interface Message extends Document{
    content: string;
    createdAt: Date;
};

const MessageSchema: Schema<Message> = new Schema({
    content: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true,
    }
});

export interface User extends Document{
    username: string;
    email: string;
    password: string;
    verifycode: string;
    veifyCodeExpriry: Date;
    isVerified: boolean;
    isAcceptingMessage: boolean;
    messages: Message[];

};

const UserSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        trim: true,
        unique: true,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        match: [/.+\@.+\..+/, "Please use a valid email address"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        // minlength: [8, "Password must be at least 8 characters long"],
    },
    verifycode: {
        type: String,
        required: [true, "verifycode is required"],
    },
    veifyCodeExpriry: {
        type: Date,
        required: [true, 'Verify code Expiry is required'],
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isAcceptingMessage: {
        type: Boolean,
        default: true,
    },
    messages: [MessageSchema],
});


 const UserModel = 
    (mongoose.models.User as mongoose.Model<User> ||
        mongoose.model<User>("User", UserSchema)
    );

export default UserModel;    