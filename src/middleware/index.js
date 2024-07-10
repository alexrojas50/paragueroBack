import User from "../models/user.js"
import { verifyJWT } from "../utils/jwt.js"

export const authVerify = async (req, res, next) => {
    const { authorization } = req.headers
    if (!authorization) return res.status(400).json({ status: false })

    const infoUser = await verifyJWT(authorization)
    if (!infoUser || !infoUser.email) return res.status(400).json({ status: false })

    const user = await User.findOne({ email: infoUser.email }, { password: 0 })
    if (!user) return res.status(400).json({ status: false })

    req.user = user
    next()
}

export const getInfo = async (req, res, next) => {
    const { authorization } = req.headers
    if (!authorization) return next()

    const infoUser = await verifyJWT(authorization)
    const user = await User.findOne({ email: infoUser.email }, { password: 0 })
    req.user = user
    next()
}