import {Schema, model, Types} from 'mongoose'

const clientSchema = new Schema({
    name: String,
    surname: String,
    lastName: String,
    dateOfBirth: Date,
    isChild: Boolean,
    parentId: Types.ObjectId,
    uuid: Number,
    uuidStr: String,
    phone: String,
    orderNumber: String,
    created: Date
}, {collection: 'Clients'})

let ClientDbModel = model('clientModel', clientSchema);

export {ClientDbModel, clientSchema}
