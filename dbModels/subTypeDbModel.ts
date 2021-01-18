import {Schema, model} from 'mongoose'

const SubTypeSchema = new Schema({
    subName: String,
    isInfinite: Boolean,
    visitsCount: Number,
    daysCount: Number,
    cost: Number
}, {collection: 'SubTypes'})

export default model('SubType',SubTypeSchema)
