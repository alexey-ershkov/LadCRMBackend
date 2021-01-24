import {Schema, model} from 'mongoose';
import {SubTypeSchema} from "./subTypeDbModel";
import {clientSchema} from "./clientDbModel";

const subDbSchema = new Schema({
    subInfo: SubTypeSchema,
    client: clientSchema,
    dateFrom: {
        type: Date,
        required: true
    },
    dateTo: {
        type:Date,
        required: true
    },
    isInfinite: Boolean,
    visitsLeft: Number

}, {collection: 'Subscriptions'})

export default model('Subscription',subDbSchema)
