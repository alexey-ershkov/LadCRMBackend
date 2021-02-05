import mongoose from "mongoose";
import {SubTypeDbModel} from "../dbModels/subTypeDbModel";
import {ClientDbModel} from "../dbModels/clientDbModel";
import client from "../routes/client";
import { SubscriptionDbModel } from "../dbModels/subscriptionDbModel";

const xlsx = require('node-xlsx');
const worksheet = 1;

const dbUrl = process.env.MONGO_URL;
mongoose.connect(dbUrl, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true
}).then(async () => {


    let workSheetsFromFile: Array<{ name: string; data: Array<Array<string & number & undefined>> }> = xlsx.parse(`${__dirname}/../../dataToMigrate/DB.xlsx`);
// @ts-ignore
    await workSheetsFromFile[worksheet].data.reduce(async (prev, value, index) => {
        await prev;
        let buf = String(value[2]).split('(');
        let found;
        if (index === 0) {
            return
        }
        if (buf.length === 2) {
            let name = buf[0].trim();
            let count = buf[1].split(')')[0].trim()
            if (name === 'ОВЗ') {
                return
            }
            if (!isNaN(Number(count))) {
                found = await SubTypeDbModel.find({'subName': name, 'visitsCount': Number(count)})
            } else {
                found = await SubTypeDbModel.find({'subName': name, 'isInfinite': true})
            }


        } else if (buf.length === 1) {
            let name = String(value[2])
            found = await SubTypeDbModel.find({'subName': name, 'isInfinite': true})
        }

        if (found.length !== 1) {
            console.log(`Can't find sub ${value}`)
        }
        let fullname = String(value[1]).split(' ');
        let users
        if (fullname.length === 2) {
            users = await ClientDbModel.find({'surname': fullname[0], 'name': fullname[1]})
        } else if (fullname.length === 3) {
            users = await ClientDbModel.find({'surname': fullname[0], 'name': fullname[1], 'lastName': fullname[2]})
        } else {
            users = await ClientDbModel.find({'surname': fullname[0]})
        }
        if (users.length !== 1) {
            console.log(`Can't find user ${fullname[0]} ${fullname[1]} found ${users.length}`)
            return
        }

        if (Number(value[0]) !== 0) {
            users[0].uuid = Number(value[0]);
            users[0].uuidStr = String(users[0].uuid);
            await users[0].save();
        }

        let dateBuff = new Date(1900, 0, value[4]);
        const dateFrom = new Date(dateBuff.toISOString().substr(0, 10));
        dateBuff = new Date(1900, 0, value[5]);
        const dateTo = new Date(dateBuff.toISOString().substr(0, 10));
        dateBuff = new Date(1900, 0, value[6]);
        const lastVisited = new Date(dateBuff.toISOString().substr(0, 10));

        const subDb = new SubscriptionDbModel({
            client: users[0],
            subInfo: found[0],
            dateFrom,
            dateTo,
            isInfinite: found[0].isInfinite,
            visitsLeft: Number(value[3]),
            lastVisited
        })

        await subDb.save();


    }, undefined);

    console.log('ok')
})
    .catch(err => {
        console.log(err);
    })




