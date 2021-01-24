import {Schema, model, Document} from 'mongoose';
import {SubTypeSchema} from "./subTypeDbModel";
import {clientSchema} from "./clientDbModel";
import Subscription from "../models/subscription";
import Client from "../models/client";
import subType from "../models/subType";

interface ISub extends Document {
    client: Client,
    subInfo: subType,
    uuid: number
    dateFrom: Date,
    dateTo: Date,
    isArchived: boolean,
    isInfinite: boolean,
    visitsLeft?: number
}

const subDbSchema = new Schema({
    subInfo: SubTypeSchema,
    client: clientSchema,
    uuid: {
        type: Number,
        unique: true
    },
    isArchived: {
        type: Boolean,
        required: true,
        default: false
    },
    dateFrom: {
        type: Date,
        required: true
    },
    dateTo: {
        type: Date,
        required: true
    },
    isInfinite: Boolean,
    visitsLeft: Number

}, {collection: 'Subscriptions'})

const SubscriptionDbModel = model<ISub>('Subscription', subDbSchema)

export {subDbSchema, SubscriptionDbModel}
