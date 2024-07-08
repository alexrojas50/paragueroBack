import { Router } from "express";
import { meetController } from "../controllers/meets.js";
import { authVerify } from "../middleware/index.js";
export const meetRouter = Router()

meetRouter.get('/', meetController.getMeets)
meetRouter.post('/', meetController.createMeet)
meetRouter.put('/', meetController.editMeet)
meetRouter.delete('/', meetController.deleteMeet)

meetRouter.post('/inscribe', authVerify, meetController.inscribeMeet)
