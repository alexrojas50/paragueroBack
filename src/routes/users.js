import { Router } from "express";
import { usersController } from "../controllers/users.js";
import { authVerify, getInfo } from "../middleware/index.js";

export const usersRoutes = Router()

usersRoutes.post('/login', usersController.login)
usersRoutes.post('/create', getInfo, usersController.createUser)
usersRoutes.get('/verifyToken', usersController.verifyToken)

usersRoutes.get('/', usersController.getUsers)
usersRoutes.put('/', usersController.updateUser)
usersRoutes.delete('/', usersController.deleteUser)
