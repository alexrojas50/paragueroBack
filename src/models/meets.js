import mongoose, { Schema, model } from 'mongoose'

const Meets = new Schema({
    course: {
        type: Schema.Types.ObjectId,
        ref: 'courses',
        required: true
    },
    room: {
        type: Schema.Types.ObjectId,
        ref: 'rooms',
        required: true
    },
    status: {
        type: String,
        default: 'pending'
    },
    fullDate: {
        type: Date,
        required: true
    },
    users: [{
        type: Schema.Types.ObjectId,
        ref: 'users',
    }]
})

const Meet = model("meet", Meets)

export default Meet
