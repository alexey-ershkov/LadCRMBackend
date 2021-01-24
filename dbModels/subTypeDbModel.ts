import {Schema, model, Document} from 'mongoose'

interface ISubType extends Document{
    subName: string,
    isInfinite: boolean,
    visitsCount: number,
    daysCount: number,
    cost: number
}

const SubTypeSchema = new Schema({
    subName: String,
    isInfinite: Boolean,
    visitsCount: Number,
    daysCount: Number,
    cost: Number
}, {collection: 'SubTypes'})

const SubTypeDbModel = model<ISubType>('SubType',SubTypeSchema)

export {SubTypeDbModel, SubTypeSchema};
