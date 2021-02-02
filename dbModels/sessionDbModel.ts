import {Schema, model, Document} from 'mongoose';

interface ISession extends Document{
    cookie:string
}

const sessionScheme = new Schema({
    cookie:{
        type: String,
        required: true
    }
}, {collection: 'Sessions'});

let SessionDbModel = model<ISession>('Sessions', sessionScheme)

export  {SessionDbModel, sessionScheme};
