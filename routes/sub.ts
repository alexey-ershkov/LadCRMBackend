import Router from 'express';
import bodyParser from "body-parser";
import SubscriptionSell from "../models/subscriptionSell";
import {ClientDbModel} from "../dbModels/clientDbModel";
import {SubTypeDbModel} from "../dbModels/subTypeDbModel";
import {SubscriptionDbModel} from '../dbModels/subscriptionDbModel'
import SubVisit from "../models/subVisit";
import VisitJournalDbModel from "../dbModels/visitJournalDbModel";
import SubType from "../models/subType";

const limitVal = 5;

const router = Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}))

router.get('/subTypes', async (req, res) => {
    const subTypes = await SubTypeDbModel.find({}).sort({'subName':1, 'visitsCount':1});
    res.send(subTypes);
})

router.get('/getSubType/:id', async (req, res) => {
    const typeInfo = await SubTypeDbModel.findById(req.params.id);
    res.send(typeInfo);
})

router.post('/sellSub', async (req, res) => {
    const sellInfo = req.body as SubscriptionSell;
    const client = await ClientDbModel.findById(sellInfo.user);
    const subInfo = await SubTypeDbModel.findById(sellInfo.subType)

    const sub = new SubscriptionDbModel({
        client,
        subInfo,
        dateFrom: Date.now(),
        dateTo: Date.now() + subInfo.daysCount * 24 * 60 * 60 * 1000,
        isInfinite: subInfo.isInfinite,
        visitsLeft: subInfo.visitsCount
    })

    sub.save()
        .then(() => {
            res.sendStatus(200);
        })
        .catch(err => {
            res.status(500).send(err);
        })
})

router.post('/saveSubVisit', async (req, res) => {
    const visit: SubVisit = req.body;

    let sub = await SubscriptionDbModel.findById(visit.subId);

    const journalVisit = new VisitJournalDbModel({
        isSub: true,
        subInfo: sub,
        visitTime: visit.visitTime
    })

    if (!sub.isInfinite) {
        sub.visitsLeft -= 1;
    }

    sub.lastVisited = visit.visitTime

    const subPromise = sub.save();

    const journalPromise = journalVisit.save();

    Promise.all([subPromise, journalPromise])
        .then(() => {
            res.sendStatus(200);
        })
        .catch(err => {
            console.log(err)
            res.status(500).send(err);
        })


})

router.post('/addVisitToSub/:id', async (req, res) => {
    const sub = await SubscriptionDbModel.findById(req.params.id);
    if (sub) {
        sub.visitsLeft += 1;
        sub.save().then(() => {
            res.sendStatus(200);
        })
            .catch(err => {
                console.log(err);
                res.status(500).send(err);
            })
    } else {
        res.sendStatus(404);
    }
})

router.post('/removeVisitFromSub/:id', async (req, res) => {
    const sub = await SubscriptionDbModel.findById(req.params.id);
    if (sub) {
        sub.visitsLeft -= 1;
        sub.save().then(() => {
            res.sendStatus(200);
        })
            .catch(err => {
                console.log(err);
                res.status(500).send(err);
            })
    } else {
        res.sendStatus(404);
    }
})

router.delete('/subFromArchive/:id', async (req, res) => {
    await SubscriptionDbModel.findByIdAndDelete(req.params.id);
    res.sendStatus(200);
})

router.get('/getUserSubs/:id', async (req, res) => {
    const subs = await SubscriptionDbModel.find({'client._id': req.params.id, 'isArchived': false});
    res.send(subs);
})

router.get('/sub/:id', async (req, res) => {
    const sub = await SubscriptionDbModel.findById(req.params.id);
    res.send(sub);
})

router.post('/addSub', async (req, resp) => {
    const sub: SubType = req.body;

    if (sub._id) {
        await SubTypeDbModel.findByIdAndUpdate(sub._id, sub);
        resp.sendStatus(200);
    } else {
        sub.subName = sub.subName.trim();
        const dbSubType = new SubTypeDbModel(sub);
        dbSubType.save().then(() => {
            resp.sendStatus(200);
        })
            .catch(err => {
                resp.send(err)
                resp.status(500)
            })
    }
})

router.get('/archive', async (req, res) => {
    const count = await SubscriptionDbModel.countDocuments({'isArchived': true});
    const pages = Math.ceil(count / limitVal);
    let currPage = Number(req.query ? req.query.page : 1);
    if (currPage > pages) {
        currPage = pages;
    }
    if (currPage < 1) {
        currPage = 1;
    }
    const archived = await SubscriptionDbModel.find({'isArchived': true})
        .skip((currPage - 1) * limitVal).limit(limitVal);
    res.send({pages, archived})


})

router.post('/archiveSub', async (req, resp) => {
    const sub = await SubscriptionDbModel.findById(req.body.id);
    sub.isArchived = !sub.isArchived;
    sub.save()
        .then(() => {
            resp.sendStatus(200);
        })
        .catch(err => {
            console.log(err);
            resp.status(500).send(err);
        })
})

export default router;
