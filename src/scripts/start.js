import mongoose from "mongoose";
import User from "../models/user.js"
import { generateHash } from "../utils/bcrypt.js";




try {
    console.log('???');
    await mongoose.connect(process.env.DBURI)
    console.log('DB CONNECTED');


    const admin = await User.findOne({ level: 1 })
    if (!admin) {
        const newHashPassword = await generateHash('123456')

        await User.create({
            name: 'admin',
            email: 'admin@admin.com',
            password: newHashPassword,
            level: 1
        })

        console.log('SE HA CREADO EL ADMIN');
    }

} catch (error) {
    console.log("ERROR CONNECTING DB: ", error);
} finally {
    process.exit();
}
