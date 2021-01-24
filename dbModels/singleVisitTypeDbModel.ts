import {Schema, model} from 'mongoose';

const singleVisitScheme = new Schema({
    visitName: String,
    cost: Number
}, {collection: 'SingleVisitTypes'});

let SingleVisitTypeDbModel = model('SingleVisitType', singleVisitScheme)

export  {SingleVisitTypeDbModel, singleVisitScheme};
