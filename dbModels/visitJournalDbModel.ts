import {Schema, model, Document} from 'mongoose'
import {clientSchema} from './clientDbModel'
import {singleVisitScheme} from "./singleVisitTypeDbModel";
import {subDbSchema} from "./subscriptionDbModel";
import Client from "../models/client";
import subType from "../models/subType";

interface IJournal extends Document {
    client: Client,
    visitInfo: {
        visitName: string,
        cost: number
    },
    isArchived:boolean,
    isSub: boolean,
    subInfo: {
        client: Client,
        subInfo: subType,
        uuid: number
        dateFrom: Date,
        dateTo: Date,
        isInfinite: boolean,
        visitsLeft?: number
    },
    visitTime: {
        type: Date
    }
}

const journalSchema = new Schema({
    client: clientSchema,
    visitInfo: singleVisitScheme,
    isSub: Boolean,
    subInfo: subDbSchema,
    visitTime: {
        type: Date
    }
}, {
    collection: 'Journal'
})
export default model<IJournal>('journalDbModel', journalSchema)
