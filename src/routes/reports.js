import { Router } from "express";
import { reportController } from "../controllers/reports.js";
import { authVerify } from "../middleware/index.js";

export const reportRouter = Router()

reportRouter.get('/', reportController.getReport)
reportRouter.post('/', authVerify, reportController.createReport)