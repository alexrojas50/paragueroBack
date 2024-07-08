import Course from '../models/courses.js'

export class courseController {
    static async getCourse(req, res) {
        try {
            const { courseId, name, teacher, hours } = req.body
            const { isForMeets } = req.query



            const filter = { active: true }


            if (courseId) {
                filter._id = courseId
                const courseFind = await Course.findOne(filter)
                if (!courseFind) return res.status(400).json({ error: 'Curso no encontrado' })
                return res.send(courseFind)
            }
            if (name) filter.name = courseId
            if (teacher) filter.teacher = courseId
            if (hours) filter.hours = courseId

            let coursesFind = await Course.find(filter)


            if (isForMeets) {
                coursesFind = coursesFind.map((e) => {
                    // return { label: e.name, value: e.name, id: e._id }
                    return { label: `${e.name} - ${e.teacher}`,  id: e._id }
                })
            }
            return res.send(coursesFind)
        } catch (error) {
            if (error.message) return res.status(400).json({ error: error.message })
            return res.status(400).json({ error })
        }
    }

    static async createCourse(req, res) {
        try {
            const { courseName, courseTeacher, courseHours, courseDescription } = req.body
            if (!courseName || !courseTeacher || !courseHours) return res.status(400).json({ error: 'Completa todos los campos' })

            // Realizar validaciones para username and password

            const newCourse = new Course({ name: courseName, teacher: courseTeacher, hours: courseHours, description: courseDescription })
            await newCourse.save()

            return res.status(202).json({ message: "Se ha creado el curso correctamente" })

        } catch (error) {
            if (error.message) return res.status(400).json({ error: error.message })
            return res.status(400).json({ error })
        }
    }

    static async editCourse(req, res) {
        try {
            const { courseName, courseTeacher, courseHours, courseDescription, courseId } = req.body

            if (!courseId) return res.status(400).json({ error: 'Debes de enviar un curso a actualizar' })

            const courseFind = await Course.find({ _id: courseId })

            if (!courseFind) return res.status(400).json({ error: 'No se ha encontrado el curso' })
            const update = {}
            if (courseName) update.name = courseName
            if (courseTeacher) update.teacher = courseTeacher
            if (courseHours) update.hours = courseHours
            if (courseDescription) update.description = courseDescription

            // Realizar validaciones para username and password

            await Course.updateOne({ _id: courseId }, { $set: update })

            return res.status(202).json({ message: "Se ha creado el curso correctamente" })

        } catch (error) {
            console.log('error ', error);
            if (error.message) return res.status(400).json({ error: error.message })
            return res.status(400).json({ error })
        }
    }


    static async deleteCourse(req, res) {
        try {
            const { courseId } = req.query;
            if (!courseId) return res.status(400).json({ error: 'Debes de enviar el curso a eliminar' });

            const courseToUpdate = Course.findOne({ _id: courseId });

            if (!courseToUpdate) return res.status(400).json({ error: 'No se ha encontrado a este curso' });

            await Course.updateOne({ _id: courseId }, { $set: { active: false } });
            return res.status(202).json({ message: 'Usuario Actualizado' });

        } catch (error) {
            if (error.message) return res.status(400).json({ error: error.message });
            return res.status(400).json({ error });
        }
    }

}