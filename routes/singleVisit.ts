import Router from 'express';
import bodyParser from "body-parser";
import {SingleVisitTypeDbModel} from "../dbModels/singleVisitTypeDbModel";
import VisitJournalDbModel from '../dbModels/visitJournalDbModel'
import SingleVisit from '../models/singleVisit';
import {ClientDbModel} from "../dbModels/clientDbModel";

const router = Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:true}))

router.get('/singleVisitTypes', async (req, res) => {
    const visitTypes = await SingleVisitTypeDbModel.find({});
    res.send(visitTypes);
})

router.post('/addSingleVisit', async (req, resp) => {
    const singleVisitType = req.body;
    const dbSingleVisit = new SingleVisitTypeDbModel(singleVisitType);
    dbSingleVisit.save().then(() => {
        resp.sendStatus(200);
    })
        .catch(err => {
            resp.status(500).send(err)
        })

})

router.post('/saveSingleVisit', async (req, res) => {
    const singleVisit = req.body;

    const singleVisitTyped = singleVisit as SingleVisit
    const client = await ClientDbModel.findById(singleVisitTyped.user)
    const visitInfo = await SingleVisitTypeDbModel.findById(singleVisitTyped.visitType)


    const singleJournalVisit = new VisitJournalDbModel({
        client,
        visitInfo,
        isSub: false
    });

    singleJournalVisit.save()
        .then(() => {
            res.sendStatus(200);
        })
        .catch(err => {
            res.status(500).send(err);
        })

})

export default router;
