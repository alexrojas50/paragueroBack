import mongoose from 'mongoose'
import { config } from './index.js'

export const startDb = async () => {
    try {
        await mongoose.connect(config.DBURI)
        console.log('DB CONNECTED');
    } catch (error) {
        console.log("ERROR CONNECTING DB: ", error);
    }
}