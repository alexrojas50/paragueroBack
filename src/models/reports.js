import { Schema, model } from 'mongoose';

const Reports = new Schema({
    meet: {
        type: Schema.Types.ObjectId,
        ref: 'meet',
        required: true
    },
    reports: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: 'users',
            required: true

        },
        description: {
            type: String,
            required: true
        }

    }],
});

const Report = model("reports", Reports);

export default Report;
