import {Schema, model} from 'mongoose'

const clientSchema = new Schema({
    name:String,
    surname:String,
    lastName:String,
    dateOfBirth: Date,
    phone: String,
    orderNumber: Number,
    created: Date
}, {collection: 'Clients'})

export default model('clientModel',clientSchema)
