import { Router } from "express";
import { courseController } from "../controllers/courses.js";
export const courseRouter = Router()

courseRouter.get('/', courseController.getCourse)
courseRouter.post('/', courseController.createCourse)
courseRouter.put('/', courseController.editCourse)
courseRouter.delete('/', courseController.deleteCourse)