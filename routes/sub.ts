import Router from 'express';
import bodyParser from "body-parser";
import SubscriptionSell from "../models/subscriptionSell";
import {ClientDbModel} from "../dbModels/clientDbModel";
import {SubTypeDbModel} from "../dbModels/subTypeDbModel";
import {SubscriptionDbModel} from '../dbModels/subscriptionDbModel'
import SubVisit from "../models/subVisit";
import VisitJournalDbModel from "../dbModels/visitJournalDbModel";


const router = Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}))

router.get('/subTypes', async (req, res) => {
    const subTypes = await SubTypeDbModel.find({});
    res.send(subTypes);
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

    if (sub.visitsLeft === 0) {
        sub.isArchived = true;

    }

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

router.get('/getUserSubs/:id', async (req, res) => {
    const subs = await SubscriptionDbModel.find({'client._id': req.params.id, 'isArchived': false});
    res.send(subs);
})

router.get('/sub/:id', async (req, res) => {
    const sub = await SubscriptionDbModel.findById(req.params.id);
    res.send(sub);
})

router.post('/addSub', async (req, resp) => {
    const sub = req.body;
    const dbSubType = new SubTypeDbModel(sub);
    dbSubType.save().then(() => {
        resp.sendStatus(200);
    })
        .catch(err => {
            resp.send(err)
            resp.status(500)
        })

})

router.get('/archive', async (req, res) => {
    const archived = await SubscriptionDbModel.find({'isArchived': true});
    res.send(archived);
})

router.post('/archiveSub', async  (req, resp) => {
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
