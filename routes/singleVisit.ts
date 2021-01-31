import Router from 'express';
import bodyParser from "body-parser";
import {SingleVisitTypeDbModel} from "../dbModels/singleVisitTypeDbModel";
import VisitJournalDbModel from '../dbModels/visitJournalDbModel'
import SingleVisit from '../models/singleVisit';
import {ClientDbModel} from "../dbModels/clientDbModel";
import {SubTypeDbModel} from "../dbModels/subTypeDbModel";
import SingleVisitType from "../models/singleVisitType";

const router = Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}))

router.get('/singleVisitTypes', async (req, res) => {
    const visitTypes = await SingleVisitTypeDbModel.find({});
    res.send(visitTypes);
})

router.post('/addSingleVisit', async (req, resp) => {
    const typeInfo = req.body as SingleVisitType;
    console.log(typeInfo);
    if (typeInfo._id) {
        const obj = await SingleVisitTypeDbModel.findById(typeInfo._id)
        obj.visitName = typeInfo.visitName;
        obj.cost = typeInfo.cost;
        obj.save().then(() => {
            resp.sendStatus(200);
        })
            .catch(err => {
                resp.status(500).send(err)
            })
    } else {
        const dbSingleVisit = new SingleVisitTypeDbModel(typeInfo);
        dbSingleVisit.save().then(() => {
            resp.sendStatus(200);
        })
            .catch(err => {
                resp.status(500).send(err)
            })
    }
})

router.get('/getSingleVisitType/:id', async (req, res) => {
    const type = await SingleVisitTypeDbModel.findById(req.params.id);
    res.send(type);
})

router.post('/saveSingleVisit', async (req, res) => {
    const singleVisit = req.body;

    const singleVisitTyped = singleVisit as SingleVisit
    const client = await ClientDbModel.findById(singleVisitTyped.user)
    const visitInfo = await SingleVisitTypeDbModel.findById(singleVisitTyped.visitType)

    const singleJournalVisit = new VisitJournalDbModel({
        client,
        visitInfo,
        visitTime: singleVisitTyped.visitTime,
        isSub: false
    });

    singleJournalVisit.save()
        .then(() => {
            res.sendStatus(200);
        })
        .catch(err => {
            console.log(err);
            res.status(500).send(err);
        })

})

router.delete('/deleteType/:id', async (req, res) => {
    await SingleVisitTypeDbModel.findByIdAndRemove(req.params.id);
    await SubTypeDbModel.findByIdAndRemove(req.params.id);
    res.sendStatus(200);
})

export default router;
