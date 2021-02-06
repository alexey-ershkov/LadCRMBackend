import {SubTypeDbModel} from "./dbModels/subTypeDbModel";
import {Parser} from "json2csv";
import mongoose from "mongoose";
import {AccountDbModel} from "./dbModels/accountDbModel";
import {ClientDbModel} from "./dbModels/clientDbModel";
import JournalDBModel from './dbModels/visitJournalDbModel';
import {SingleVisitTypeDbModel} from "./dbModels/singleVisitTypeDbModel";
import {SubscriptionDbModel} from "./dbModels/subscriptionDbModel";
const {google} = require('googleapis');

const dbUrl = process.env.MONGO_URL;

function getCredentials() {

    if (process.env.CREDENTIALS) {
        return JSON.parse(process.env.CREDENTIALS)
    }
    throw new Error('Unable to load credentials')
}

async function getDrive() {
    const credentials = getCredentials()
    const client = await google.auth.getClient({
        credentials,
        scopes: 'https://www.googleapis.com/auth/drive.file',
    })

    return google.drive({
        version: 'v3',
        auth: client,
    })
}


async function createFolder(drive) {


    const fileMetadata = {
        'name': new Date().toDateString(),
        'mimeType': 'application/vnd.google-apps.folder',
        'parents': ['1iNYPrjrbOFzbDwLtVy1d9ZQIFjboB9ZP']
    };
    const file = await drive.files.create({
        resource: fileMetadata,
        fields: 'id'
    });

    return file.data.id
}


async function backupCSV(drive, csvData, folderId, filename) {
    drive.files.create({
        requestBody: {
            name: filename,
            mimeType: 'text/csv',
            parents: [folderId],
        },
        media: {
            mimeType: 'text/csv',
            body: csvData,
        },
    })
        .then(() => {
            console.log(`${filename} saved`)
        })
        .catch(e => console.error(e))

}

export default async function backup() {
    const drive = await getDrive();
    const id = await createFolder(drive);

    let parser = new Parser();

    const subTypes = await SubTypeDbModel.find({}).lean();
    backupCSV(drive, parser.parse(subTypes), id, 'SubTypes')
        .catch(e => console.log(e))

    parser = new Parser();

    const accounts = await AccountDbModel.find({}).lean()
    backupCSV(drive, parser.parse(accounts), id, 'Accounts')
        .catch(e => console.log(e))

    parser = new Parser();

    const clients = await ClientDbModel.find({}).lean()
    backupCSV(drive, parser.parse(clients), id, 'Clients')
        .catch(e => console.log(e))

    parser = new Parser();

    const journal = await JournalDBModel.find({}).lean()
    backupCSV(drive, parser.parse(journal), id, 'Journal')
        .catch(e => console.log(e))

    parser = new Parser();

    const singleVisitTypes = await SingleVisitTypeDbModel.find({}).lean()
    backupCSV(drive, parser.parse(singleVisitTypes), id, 'SingleVisitTypes')
        .catch(e => console.log(e))

    parser = new Parser();

    const subs = await SubscriptionDbModel.find({}).lean()
    backupCSV(drive, parser.parse(subs), id, 'Subscriptions')
        .catch(e => console.log(e))
}
