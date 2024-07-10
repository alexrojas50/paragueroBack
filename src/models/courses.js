import { Schema, model } from 'mongoose';

const Courses = new Schema({
    name: {
        type: String,
        required: true
    },
    teacher: {
        type: Schema.Types.ObjectId,
        ref: 'users',
    },
    hours: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: "",
    },
    active: {
        type: Boolean,
        default: true,
    }
});

const Course = model("courses", Courses);

export default Course;
