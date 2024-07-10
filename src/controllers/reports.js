import Course from '../models/courses.js'
import User from '../models/user.js'
import Report from '../models/reports.js'
import Meet from '../models/meets.js'


export class reportController {
    static async getReport(req, res) {
        try {
            const reportFind = await Report.find({}).populate([
                {
                    path: 'meet', populate: [
                        {
                            path: 'course',
                            populate: { path: 'teacher', select: '-password' }
                        }
                    ]
                },
                {
                    path: 'reports.user', select: '-password'
                }])

            return res.send(reportFind)
        } catch (error) {
            if (error.message) return res.status(400).json({ error: error.message })
            return res.status(400).json({ error })
        }
    }

    static async createReport(req, res) {
        try {
            const { meetId, report } = req.body
            if (!meetId || !report) return res.status(400).json({ error: 'Completa todos los campos' })

            const meetFind = await Meet.findOne({ _id: meetId })
            if (!meetFind) return res.status(400).json({ error: 'No se ha encontrado este encuentro' })

            const reportFind = await Report.findOne({ meet: meetId })

            if (!reportFind) {
                const newReport = new Report({
                    meet: meetFind._id, reports: [{
                        user: req.user._id, description: report
                    }]
                })
                await newReport.save()
            } else {
                await Report.updateOne({ _id: reportFind }, {
                    $push: {
                        reports: {
                            user: req.user._id, description: report
                        }
                    }
                })
            }
            return res.status(202).json({ message: "Se ha creado el reporte correctamente" })
        } catch (error) {
            if (error.message) return res.status(400).json({ error: error.message })
            return res.status(400).json({ error })
        }
    }

}