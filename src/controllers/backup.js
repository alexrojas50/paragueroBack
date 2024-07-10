import { config } from '../config/index.js'
import { MongoTransferer, MongoDBDuplexConnector, LocalFileSystemDuplexConnector } from 'mongodb-snapshot';
import { mongoose } from 'mongoose'


let id = 0
export class backupController {
    static async getBackup(req, res) {
        try {

            // const mongo_connector = new MongoDBDuplexConnector({
            //     connection: {
            //         uri: config.DBURI,
            //         dbname: 'paraguero_serve',
            //     },
            // });

            // const localfile_connector = new LocalFileSystemDuplexConnector({
            //     connection: {
            //         path: `./src/public/backup${id}.tar`,
            //     },
            // });

            // const transferer = new MongoTransferer({
            //     source: mongo_connector,
            //     targets: [localfile_connector],
            // });

            // for await (const { total, write } of transferer) {
            //     console.log(`remaining bytes to write Create Backup: ${total - write}`);
            // }

            const restore = await backupController.restore()
            if (!restore) return res.status(400).json({ error: "No se ha generado correctamente el backup" })

            res.send({ status: true })


        } catch (error) {
            console.log('ERROR: ', error);
            if (error.message) return res.status(400).json({ error: error.message })
            return res.status(400).json({ error })
        }
    }


    static async restore() {
        try {
            let update = {}

            const mainDataBaseBackup = await mongoose.createConnection(config.DBURI);
            const mainCollections = await mainDataBaseBackup.listCollections();

            const dataBaseBackup = await mongoose.createConnection(config.DBURIBACKUP);
            const collections = await dataBaseBackup.listCollections();

            for (const collection of collections) {
                const data = await dataBaseBackup.collection(collection.name).drop()
            }

            for (const collection of mainCollections) {
                const data = await mainDataBaseBackup.collection(collection.name).find().toArray()
                update[collection.name] = data
                const data3 = await dataBaseBackup.createCollection(collection.name)
                if (data.length > 0) await dataBaseBackup.collection(collection.name).insertMany(data)

            }


            // const mongo_connector = new MongoDBDuplexConnector({
            //     connection: {
            //         uri: config.DBURI,
            //         dbname: 'paraguero_backup',
            //     },
            // });

            // const localfile_connector = new LocalFileSystemDuplexConnector({
            //     connection: {
            //         path: `./src/public/backup${id}.tar`,
            //     },
            // });

            // const transferer = new MongoTransferer({
            //     source: localfile_connector,
            //     targets: [mongo_connector],
            // });

            // for await (const { total, write } of transferer) {
            //     console.log(`remaining bytes to write Inset Backup: ${total - write}`);
            // }

            dataBaseBackup.close()
            return true

            return 0
        } catch (error) {
            console.log('ERROR: ', error);
            return false
        }
    }
}