import jwt from 'jsonwebtoken'
import { config } from '../config/index.js'

export const createJWT = async (user) => {
    const newToken = await jwt.sign(user, config.SECRETTOKEN, { expiresIn: '1h' })
    return newToken
}

export const verifyJWT = async (token) => {
    const verifyToken = await jwt.verify(token, config.SECRETTOKEN)
    return verifyToken
}