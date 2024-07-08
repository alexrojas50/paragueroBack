import Room from "../models/rooms.js"

export class roomController {
    static async getRoom(req, res) {
        try {
            const { roomId, status, isForMeets } = req.query

            const filter = { active: true }

            if (roomId) {
                filter._id = roomId
                const roomFind = await Room.findOne(filter)
                if (!roomFind) return res.status(400).json({ error: 'Curso no encontrado' })
                return res.send(roomFind)
            }

            if (status) {
                filter.status = status
            }

            let roomsFind = await Room.find(filter)

            if (isForMeets) {
                roomsFind = roomsFind.map((e) => {
                    // return { label: e.number, value: e.number, id: e._id }
                    return { label: `${e.number}`, id: e._id }
                })
            }
            return res.send(roomsFind)
        } catch (error) {
            if (error.message) return res.status(400).json({ error: error.message })
            return res.status(400).json({ error })
        }
    }

    static async createRoom(req, res) {
        try {

            const nextRoom = await Room.find().count()
            const newRoom = new Room({ number: nextRoom + 1 })
            await newRoom.save()

            return res.status(202).json({ message: "Se ha creado el aula correctamente" })

        } catch (error) {
            if (error.message) return res.status(400).json({ error: error.message })
            return res.status(400).json({ error })
        }
    }

    static async editRoom(req, res) {
        try {
            const { roomId } = req.query

            if (!roomId) return res.status(400).json({ error: 'Debes de enviar un aula a actualizar' })

            const roomFind = await Room.findOne({ _id: roomId })

            if (!roomFind) return res.status(400).json({ error: 'No se ha encontrado el aula' })

            // Realizar validaciones para username and password

            await Room.updateOne({ _id: roomId }, { $set: { status: !roomFind.status } })

            return res.status(202).json({ message: "Se ha cambiadlo el estado del aula correctamente" })

        } catch (error) {
            if (error.message) return res.status(400).json({ error: error.message })
            return res.status(400).json({ error })
        }
    }


    static async deleteRoom(req, res) {
        try {
            const { roomId } = req.query;
            if (!roomId) return res.status(400).json({ error: 'Debes de enviar el curso a eliminar' });

            const roomToDelete = Room.findOne({ _id: roomId });

            if (!roomToDelete) return res.status(400).json({ error: 'No se ha encontrado a este curso' });

            await Room.updateOne({ _id: roomId }, { $set: { active: false } });
            return res.status(202).json({ message: 'Usuario Actualizado' });

        } catch (error) {
            console.log('ERROR DELETE ROOM ', error);
            if (error.message) return res.status(400).json({ error: error.message });
            return res.status(400).json({ error });
        }
    }

}