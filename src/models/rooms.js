import { Schema, model } from 'mongoose'

const Rooms = new Schema({
    number: {
        type: Number,
        required: true
    },
    status: {
        type: Boolean,
        default: true,
        required: true
    },
    active: {
        type: Boolean,
        default: true,
        required: true
    }

})

const Room = model("rooms", Rooms)

export default Room
