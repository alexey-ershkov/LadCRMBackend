import Client from "../models/client";
import mongoose from "mongoose";
import {ClientDbModel} from "../dbModels/clientDbModel";

const xlsx = require('node-xlsx');
const worksheet = 0;
let arrayLength = 0;
let globIdx = 0;

const dbUrl = process.env.MONGO_URL;
mongoose.connect(dbUrl, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true
}).then(async () => {
    let workSheetsFromFile: Array<{ name: string; data: Array<Array<string & number & undefined>> }> = xlsx.parse(`${__dirname}/../../dataToMigrate/DB.xlsx`);
    arrayLength = workSheetsFromFile[worksheet].data.length;
    setInterval(() => {
        console.log(`${globIdx}/${arrayLength}`)
    }, 5000)
    // @ts-ignore
    await workSheetsFromFile[worksheet].data.reduce(async (memo, value, idx) => {
        await memo;
        globIdx = idx;
        if (idx === 0) {
            return
        }
        let clientObj: Client;
        const clientNameParsed = String(value[1]).split(' ');
        if (value[2] === "нет" && value[5] !== undefined) {
            let dateBuff = new Date(1900, 0, value[5], 0, 0, 0);
            let dateCreated = new Date(dateBuff.toISOString().substr(0, 10));
            let dateOfBirth;
            if (value[4]) {
                dateBuff = new Date(1900, 0, value[4], 0, 0, 0);
                dateOfBirth = new Date(dateBuff.toISOString().substr(0, 10))
            } else {
                dateOfBirth = new Date();
            }
            clientObj = {
                created: dateCreated,
                dateOfBirth: dateOfBirth,
                isChild: false,
                lastName: clientNameParsed.length > 2 ? clientNameParsed[2] : "",
                name: clientNameParsed[1],
                orderNumber: String(value[0]),
                phone: value[3] ? String(value[3]) : "",
                surname: clientNameParsed[0],
                uuid: Number(value[0]),
                uuidStr: String(value[0])
            };

            const dbClientObj = new ClientDbModel(clientObj);
            await dbClientObj.save();
        } else {
            let parentInfoArray = await ClientDbModel.find({'orderNumber': value[0]});

            if (parentInfoArray.length === 0) {
                console.log(`Can't add ${value[0]}, ${value[1]} child because parent wasn't found or created date is invalid`);
            } else {
                let parentInfo;
                if (parentInfoArray.length === 1) {
                    parentInfo = parentInfoArray[0];
                } else {
                    parentInfoArray = parentInfoArray.filter(value => {
                        return value.isChild === false;
                    });
                    parentInfo = parentInfoArray[0];
                }
                let dateOfBirth
                if (value[4]) {
                    let dateBuff = new Date(1900, 0, value[4], 0, 0, 0);
                    dateOfBirth = new Date(dateBuff.toISOString().substr(0, 10))
                } else {
                    dateOfBirth = new Date();
                }
                clientObj = {
                    created: parentInfo.created,
                    dateOfBirth: dateOfBirth,
                    isChild: true,
                    lastName: clientNameParsed.length > 2 ? clientNameParsed[2] : "",
                    name: clientNameParsed[1],
                    orderNumber: parentInfo.orderNumber,
                    phone: value[3] ? String(value[3]) : parentInfo.phone,
                    surname: clientNameParsed[0],
                    uuid: Number(value[0]),
                    parentId: parentInfo._id,
                    uuidStr: String(value[0])
                };


                const dbClientObj = new ClientDbModel(clientObj);
                await dbClientObj.save();
            }
        }


    }, undefined);


})
    .catch(err => console.log(err))

