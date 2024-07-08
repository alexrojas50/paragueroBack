import bcrypt from 'bcrypt'
import { config } from '../config/index.js'

export const generateHash = async (textToHash) => {
    try {
        const newHash = await bcrypt.hash(textToHash, Number(config.SALTS))
        return newHash
    } catch (error) {
        throw new Error('Ha occurrido un error')
    }

}

export const verifyPassword = async (password, hashPassword) => {
    return await bcrypt.compare(password, hashPassword)
}