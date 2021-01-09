import express from "express";
import {default as clientRouter} from "./routes/client";
import mongoose from 'mongoose'
import clientDbModel from "./dbModels/clientDbModel";

const app = express();
const allowOrigin = 'http://localhost:3000'
const dbUrl = 'mongodb://127.0.0.1:27017/LadCRM'

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', allowOrigin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
});

app.get('/', async (req, resp) => {
    let model = new clientDbModel({
        name:'a',
        surname:'b',
        lastName:'c',
        dateOfBirth: new Date(),
        orderNumber: 112415,
        created: new Date(),
        phone: '3y158t3185'
    })

    await model.save()
    resp.sendStatus(200)
})
app.use(clientRouter)

const PORT = process.env.PORT || 3001;
mongoose.connect(dbUrl, {
    useUnifiedTopology: true,
    useNewUrlParser: true
}).then(() => app.listen(PORT, async () => {
    console.log(`Server started on  http://localhost:${PORT}`)
}))
    .catch(err => console.log(err))

