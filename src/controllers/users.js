import User from "../models/user.js";
import { generateHash, verifyPassword } from "../utils/bcrypt.js";
import { createJWT, verifyJWT } from "../utils/jwt.js";

export class usersController {
    static async login(req, res) {
        try {
            const { userEmail, password } = req.body

            if (!userEmail || !password) return res.status(400).json({ error: `Completa todos los campos` })

            const user = await User.findOne({ email: userEmail })

            if (!user) return res.status(400).json({ error: `No existe una cuenta con el email ${userEmail}` })

            if (!await verifyPassword(password, user.password)) return res.status(400).json({ error: `Contraseña Incorrecta` })

            const initToken = await createJWT({ name: user.name, email: user.email })

            return res.send({ token: initToken, username: user.name, email: user.email, level: user.level })
        } catch (error) {
            console.log('Error :', error);
            if (error.message) return res.status(400).json({ error: error.message })
            return res.status(400).json({ error })
        }
    }

    static async getUsers(req, res) {
        try {
            const { userId, level, isForCourse } = req.query

            const filter = { active: true, level: { $nin: [1] } }

            if (userId) {
                filter._id = userId
                const userFind = await User.findOne(filter, { password: 0 })
                if (!userFind) return res.status(400).json({ error: 'Usuario no encontrado' })
                return res.send(userFind)
            }

            if (level == 3) filter.level.$nin.push(2); else filter.level.$nin.push(3);
            console.log('FILTERR ', filter);
            let usersFind = await User.find(filter, { password: 0 })

            if (isForCourse) {
                usersFind = usersFind.map((e) => {
                    return { label: `${e.name} - ${e.CI}`, id: e._id }
                })
            }
            return res.status(202).json(usersFind)
        } catch (error) {
            console.log('ERROR ', error);
            if (error.message) return res.status(400).json({ error: error.message })
            return res.status(400).json({ error })
        }
    }

    static async createUser(req, res) {
        try {
            const { userName, password, userEmail, phone, CIUser, level } = req.body

            if (!userName || !password || !userEmail || !phone || !CIUser) return res.status(400).json({ error: 'Completa todos los campos' })

            if (level && !req.user) return res.status(400).json({ error: 'Solo el adminitrador puede asignar niveles' })

            if (level && req.user.level != 1) return res.status(400).json({ error: 'Solo el adminitrador puede crear profesores' })
            if (level && ![1, 2, 3].includes(level)) return res.status(400).json({ error: 'Nivel de usuario inválido' })
            const newHashPassword = await generateHash(password)

            // Realizar validaciones para username and password

            const newUser = new User({ name: userName, password: newHashPassword, email: userEmail, level: level ? level : 2, phone: phone, CI: CIUser })
            await newUser.save()

            const initToken = await createJWT({ name: newUser.userName, email: newUser.userEmail })
            return res.status(202).json({ token: initToken, name: newUser.userName, email: newUser.userEmail })

        } catch (error) {
            if (error.message) return res.status(400).json({ error: error.message })
            return res.status(400).json({ error })
        }
    }


    static async updateUser(req, res) {
        try {
            const { userName, userPassword, userEmail, userPhone, userId } = req.body;
            console.log('ACTUALIZANDO ', req.body);
            if (!userName && !password && !userEmail) return res.status(400).json({ error: 'No has enviado ningún dato' });
            if (!userId) return res.status(400).json({ error: 'Debes de enviar el usuario a actualizar' });

            const userToUpdate = User.findOne({ _id: userId });

            if (!userToUpdate) return res.status(400).json({ error: 'No se ha encontrado a este usuario' });

            const update = {};

            if (userPassword) update.password = await generateHash(userPassword);
            if (userName) update.name = userName;
            if (userEmail) update.email = userEmail;
            if (userPhone) update.phone = userPhone;

            // Realizar validaciones para username and password

            await User.updateOne({ _id: userId }, { $set: update });
            return res.status(202).json({ message: 'Usuario Actualizado' });

        } catch (error) {
            if (error.message) return res.status(400).json({ error: error.message });
            return res.status(400).json({ error });
        }
    }

    static async deleteUser(req, res) {
        try {
            const { userId } = req.query;
            console.log('REQ ', req.query);
            if (!userId) return res.status(400).json({ error: 'Debes de enviar el usuario a eliminar' });

            const userToUpdate = User.findOne({ _id: userId });

            if (!userToUpdate) return res.status(400).json({ error: 'No se ha encontrado a este usuario' });

            await User.updateOne({ _id: userId }, { $set: { active: false } });
            return res.status(202).json({ message: 'Usuario Actualizado' });

        } catch (error) {
            if (error.message) return res.status(400).json({ error: error.message });
            return res.status(400).json({ error });
        }
    }

    static async verifyToken(req, res) {
        try {

            const { authorization } = req.headers
            if (!authorization) return res.json({ status: false })

            const infoUser = await verifyJWT(authorization)
            if (!infoUser || !infoUser.email) return res.json({ status: false })

            const user = await User.findOne({ email: infoUser.email }, { password: 0 })
            if (!user) return res.json({ status: false })
            return res.json({ status: true, user: user })

        } catch (error) {
            if (error.message) return res.status(400).json({ error: error.message })
            return res.status(400).json({ error })
        }
    }
}