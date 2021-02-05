import {Schema, model, Types, Document} from 'mongoose'
import Client from "../models/client";
import subType from "../models/subType";

interface IClient extends Document {
    name: string,
    surname: string,
    lastName: string,
    dateOfBirth: Date,
    isChild: boolean,
    parentId: string,
    uuid: number,
    uuidStr: string,
    phone: string,
    orderNumber: string,
    created: Date
}

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

let ClientDbModel = model<IClient>('clientModel', clientSchema);

export {ClientDbModel, clientSchema}
