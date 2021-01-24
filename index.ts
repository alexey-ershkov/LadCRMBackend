import express from "express";
import {default as clientRouter} from './routes/client';
import {default as subRouter} from './routes/sub';
import {default as singleVisitRouter} from './routes/singleVisit';
import {default as journalRouter} from './routes/journal';
import mongoose from 'mongoose';

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

app.use((req, res, next) => {
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    } else {
        next();
    }
})

app.use(clientRouter);
app.use(subRouter);
app.use(singleVisitRouter);
app.use(journalRouter);

const PORT = process.env.PORT || 3001;
mongoose.connect(dbUrl, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify:false,
    useCreateIndex: true
}).then(() => app.listen(PORT, async () => {
    console.log(`Server started on  http://localhost:${PORT}`)
}))
    .catch(err => console.log(err))

