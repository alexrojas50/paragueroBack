import { Router } from "express";
import { roomController } from "../controllers/rooms.js";
export const roomRouter = Router()

roomRouter.get('/', roomController.getRoom)
roomRouter.post('/', roomController.createRoom)
roomRouter.put('/', roomController.editRoom)
roomRouter.delete('/', roomController.deleteRoom)