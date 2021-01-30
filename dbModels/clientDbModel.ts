import {Schema, model} from 'mongoose'

const clientSchema = new Schema({
    name: String,
    surname: String,
    lastName: String,
    dateOfBirth: Date,
    isChild: Boolean,
    parentName: String,
    parentSurname: String,
    parentLastName: String,
    parentDateOfBirth: Date,
    uuid: Number,
    uuidStr: String,
    phone: String,
    orderNumber: Number,
    created: Date
}, {collection: 'Clients'})

let ClientDbModel = model('clientModel', clientSchema);

export {ClientDbModel, clientSchema}
