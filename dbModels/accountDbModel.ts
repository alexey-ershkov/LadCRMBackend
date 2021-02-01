import {Schema, model, Document} from 'mongoose';

interface IAccount extends Document{
    login:string,
    password: string
}

const accountScheme = new Schema({
    login: String,
    password: String
}, {collection: 'Accounts'});

let AccountDbModel = model<IAccount>('Accounts', accountScheme)

export  {AccountDbModel, accountScheme};
