import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
        },
        roles: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Role",
            },
        ],
        isActive: {
            type: Boolean,
            default: true,
        },
        lastLogin: {
            type: Date,
        },
        avatarURL: {
            type: String,
            default: null,
        },
        phone: {
            type: String,
            default: null,
        },
        address: {
            street: String,
            city: String,
            district: String,
            ward: String,
            postalCode: String,
        },
    },
    { timestamps: true },
);
// Optional: normalize email
userSchema.pre('save', function (next) {
    if (this.isModified('email') && typeof this.email === 'string') {
        this.email = this.email.trim().toLowerCase();
    }
    next();
});

export default mongoose.model('User', userSchema);

