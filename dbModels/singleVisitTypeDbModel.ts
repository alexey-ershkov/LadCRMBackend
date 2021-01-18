import {Schema, model} from 'mongoose';

const singleVisitScheme = new Schema({
    visitName: String,
    cost: Number
}, {collection: 'SingleVisitTypes'});

export default model('SingleVisitType', singleVisitScheme);
