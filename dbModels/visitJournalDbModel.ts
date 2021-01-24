import {Schema, model} from 'mongoose'
import {clientSchema} from './clientDbModel'
import {singleVisitScheme} from "./singleVisitTypeDbModel";

const journalSchema = new Schema({
    client: clientSchema,
    visitInfo: singleVisitScheme,
    isSub: Boolean,
    visitTime: {
        type: Date,
        default: Date.now(),
        required: true
    }
}, {
    collection: 'Journal'
})
export default model('journalDbModel', journalSchema)
