import Meets from '../models/meets.js'
import Course from '../models/courses.js'
import Room from '../models/rooms.js'
import moment from 'moment'
export class meetController {
    static async getMeets(req, res) {
        try {
            const { meetId, date, endDate, courseId, isForInscribe, getLasts } = req.query

            const filter = {}

            if (meetId) {
                filter._id = meetId
                const meetFind = await Meets.findOne(filter).populate([
                    {
                        path: 'users',
                        select: 'name phone email'
                    }
                ])
                if (!meetFind) return res.status(400).json({ error: 'Encuentro no encontrado' })
                return res.send(meetFind)
            }

            if (getLasts) {
                const courseIdArray = await Course.find().then((res) => res.map(e => e._id))
                const lastMeets = await Meets.aggregate([
                    {
                        $match: {
                            course: { $in: courseIdArray },
                            fullDate: { $gte: new Date() }
                        }
                    },
                    {
                        $sort: {
                            fullDate: 1
                        }
                    },
                    {
                        $group: {
                            _id: "$course",
                            closestMeet: { $first: "$$ROOT" }
                        }
                    },
                    {
                        $replaceRoot: {
                            newRoot: "$closestMeet"
                        }
                    },
                    {
                        $lookup: {
                            from: "courses",
                            localField: "course",
                            foreignField: "_id",
                            as: "courseData"
                        }
                    },
                    {
                        $lookup: {
                            from: "rooms",
                            localField: "room",
                            foreignField: "_id",
                            as: "roomData"
                        }
                    },
                    {
                        $unwind: "$courseData"
                    },
                    {
                        $unwind: "$roomData"
                    },
                    {
                        $addFields: {
                            date: { $dateToString: { format: "%d/%m/%Y", date: "$fullDate" } },
                            time: { $dateToString: { format: "%H:%M", date: "$fullDate" } }
                        }
                    }
                ])
                return res.send(lastMeets)
            }

            if (courseId) filter.course = courseId

            let meetsFind = (await Meets.find(filter, { users: 0 }).populate([{ path: 'course', populate: {path:'teacher', select: '-password'} }, 'room'])).map(e => {
                return { course: e.course, room: e.room, date: new Date(e.fullDate).toLocaleDateString(), time: new Date(e.fullDate).toLocaleTimeString().toUpperCase(), _id: e._id }
            })

            if (isForInscribe) {
                meetsFind = meetsFind.map((e) => {
                    // return { label: e.name, value: e.name, id: e._id }
                    return { label: `${e.date} - ${e.time}`, data: e }
                })
            }
            return res.send(meetsFind)
        } catch (error) {
            console.log('ERROR ', error);
            if (error.message) return res.status(400).json({ error: error.message })
            return res.status(400).json({ error })
        }
    }

    static async createMeet(req, res) {
        try {
            const { courseId, roomId, date, time } = req.body
            if (!courseId || !roomId || !date || !time) return res.status(400).json({ error: 'Completa todos los campos' })

            const dateTime = moment(date + ' ' + time, 'YYYY/MM/DD HH:mm');
            if (moment().isAfter(dateTime)) return res.status(400).json({ error: 'La hora del encuentro debe de ser mayor que la actual' })

            const courseFind = Course.findOne({ _id: courseId })
            if (!courseFind) return res.status(400).json({ error: 'No se ha encontrando el curso asignado' })

            const roomFind = Room.findOne({ _id: roomId })
            if (!roomFind) return res.status(400).json({ error: 'No se ha encontrando el aula asignada' })

            const newMeet = new Meets({ course: courseId, room: roomId, fullDate: new Date(dateTime) })
            await newMeet.save()

            return res.status(202).json({ message: "Se ha creado el curso correctamente" })

        } catch (error) {
            console.log('ERROR ', error);
            if (error.message) return res.status(400).json({ error: error.message })
            return res.status(400).json({ error })
        }
    }

    static async editMeet(req, res) {
        try {
            const { courseName, courseTeacher, courseHours, courseDescription, courseId } = req.body

            if (!courseId) return res.status(400).json({ error: 'Debes de enviar un curso a actualizar' })

            const courseFind = await Meets.find({ _id: courseId })

            if (!courseFind) return res.status(400).json({ error: 'No se ha encontrado el curso' })
            const update = {}
            if (courseName) filter.name = courseName
            if (courseTeacher) filter.teacher = courseTeacher
            if (courseHours) filter.hours = courseHours
            if (courseDescription) filter.description = courseDescription

            // Realizar validaciones para username and password

            await Meets.updateOne({ _id: courseId }, { $set: update })

            return res.status(202).json({ message: "Se ha creado el curso correctamente" })

        } catch (error) {
            if (error.message) return res.status(400).json({ error: error.message })
            return res.status(400).json({ error })
        }
    }


    static async deleteMeet(req, res) {
        try {
            const { courseId } = req.body;
            if (!courseId) return res.status(400).json({ error: 'Debes de enviar el curso a eliminar' });

            const courseToUpdate = Meets.findOne({ _id: userId });

            if (!courseToUpdate) return res.status(400).json({ error: 'No se ha encontrado a este curso' });

            await Meets.updateOne({ _id: courseId }, { $set: { active: false } });
            return res.status(202).json({ message: 'Usuario Actualizado' });

        } catch (error) {
            if (error.message) return res.status(400).json({ error: error.message });
            return res.status(400).json({ error });
        }
    }

    static async inscribeMeet(req, res) {
        try {
            const { meet } = req.query;
            console.log('REQQ ', req.user);
            if (!meet) return res.status(400).json({ error: 'Debes de enviar el encuentro a inscribir' });

            const meetToInscribe = Meets.findOne({ _id: meet });

            if (!meetToInscribe) return res.status(400).json({ error: 'No se ha encontrado a este encuentro' });

            await Meets.updateOne({ _id: meet }, { $push: { users: req.user._id } });
            return res.status(202).json({ message: 'Inscrito' });

        } catch (error) {
            if (error.message) return res.status(400).json({ error: error.message });
            return res.status(400).json({ error });
        }
    }
}