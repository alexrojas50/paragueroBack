import { Schema, model } from 'mongoose'

const Users = new Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        unique: true
    },
    level: {
        type: Number,
        required: true
    },
    active: {
        type: Boolean,
        required: true,
        default: true
    }
})

const User = model("users", Users)

export default User
