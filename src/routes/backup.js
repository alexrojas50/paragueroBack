import { Router } from "express";
import { backupController } from "../controllers/backup.js";
export const backupRouter = Router()

backupRouter.get('/', backupController.getBackup)
backupRouter.put('/', backupController.restore)
