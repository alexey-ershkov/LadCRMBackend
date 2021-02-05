const xlsx = require('node-xlsx');
const worksheet = 1;
let subTypes = new Set();
let workSheetsFromFile: Array<{ name: string; data: Array<Array<string & number & undefined>> }> = xlsx.parse(`${__dirname}/../../dataToMigrate/DB.xlsx`);
workSheetsFromFile[worksheet].data.forEach((value, index) => {
    subTypes.add(value[2]);
});

console.log(subTypes)
