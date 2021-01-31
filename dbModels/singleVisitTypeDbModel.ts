import {Schema, model, Document} from 'mongoose';

interface ISingleVisitType extends Document{
    visitName:string,
    cost: number
}

const singleVisitScheme = new Schema({
    visitName: String,
    cost: Number
}, {collection: 'SingleVisitTypes'});

let SingleVisitTypeDbModel = model<ISingleVisitType>('SingleVisitType', singleVisitScheme)

export  {SingleVisitTypeDbModel, singleVisitScheme};
