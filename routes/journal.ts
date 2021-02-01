import Router from "express";
import bodyParser from "body-parser";
import VisitJournalDbModel from "../dbModels/visitJournalDbModel";

const router = Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}))

const limitVal = 5;

router.get('/journal', async (req, res) => {
    const count = await VisitJournalDbModel.countDocuments();
    const pages = Math.ceil(count / limitVal);
    let currPage = Number(req.query ? req.query.page : 1);
    if (currPage > pages) {
        currPage = pages;
    }
    const journal = await VisitJournalDbModel.find({}).sort({'visitTime': -1})
        .skip((currPage - 1) * limitVal).limit(limitVal);
    res.send({pages, journal})
})

router.get('/journal/search/:search', async (req, res) => {
    const searchRegExp = new RegExp(req.params.search, 'ig');
    const count = await VisitJournalDbModel
        .find({
            $or: [{'client.name': searchRegExp}, {'client.surname': searchRegExp},
                {'subInfo.client.name': searchRegExp}, {'subInfo.client.surname': searchRegExp},
                {'subInfo.subInfo.subName': searchRegExp}]
        }).countDocuments();
    const pages = Math.ceil(count / limitVal);
    let currPage = Number(req.query ? req.query.page : 1);
    if (currPage > pages) {
        currPage = pages;
    }
    const found = await VisitJournalDbModel
        .find({
            $or: [{'client.name': searchRegExp}, {'client.surname': searchRegExp},
                {'subInfo.client.name': searchRegExp}, {'subInfo.client.surname': searchRegExp},
                {'subInfo.subInfo.subName': searchRegExp}]
        }).sort({'visitTime': -1}).skip((currPage - 1) * limitVal).limit(limitVal);
    res.send({pages, found});
})

export default router;
