import express from "express";
import {default as clientRouter} from './routes/client';
import {default as subRouter} from './routes/sub';
import {default as singleVisitRouter} from './routes/singleVisit';
import {default as journalRouter} from './routes/journal';
import {default as accountRouter} from './routes/account';
import mongoose from 'mongoose';
import cookieParser from "cookie-parser";
import session from "express-session";
import {SessionDbModel} from "./dbModels/sessionDbModel";

const app = express();
const allowOrigin = process.env.ALLOW_URL;
const dbUrl = process.env.MONGO_URL;

app.enable('trust proxy');

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


app.use(cookieParser())

app.use(session({
    secret: new Date().toISOString(),
    saveUninitialized: true,
    resave: false,
    proxy:true,
    cookie: {
        secure:true,
        httpOnly: true,
        sameSite: 'none'
    }
}))

app.use(async (req, res, next) => {
    let found = []
    console.log(req.session);
    console.log(req.cookies);
    res.cookie("test", "value", {sameSite:false});
    // if (req.cookies['connect.sid']) {
    //     found = await SessionDbModel.find({'cookie': req.cookies['connect.sid']});
    // }
    // if (req.path != '/login' && found.length === 0) {
    //     res.sendStatus(403);
    // } else {
    //     next();
    // }
    next();
})


app.use(clientRouter);
app.use(subRouter);
app.use(singleVisitRouter);
app.use(journalRouter);
app.use(accountRouter);


const PORT = process.env.PORT || 3001;
mongoose.connect(dbUrl, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true
}).then(() => {
    app.listen(PORT, async () => {
        console.log(`Server started on  http://localhost:${PORT}`)
    })
})
    .catch(err => console.log(err))


