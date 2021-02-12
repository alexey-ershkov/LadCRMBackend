import Router from "express";
import bodyParser from "body-parser";
import VisitJournalDbModel from "../dbModels/visitJournalDbModel";
import {ClientDbModel} from "../dbModels/clientDbModel";

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
    if (currPage < 1) {
        currPage = 1;
    }
    const journal = await VisitJournalDbModel.find({}).sort({'visitTime': -1})
        .skip((currPage - 1) * limitVal).limit(limitVal);
    res.send({pages, journal})
})

router.get('/journal/search/:search', async (req, res) => {
    const word = req.params.search.split(' ')
    if (word.length !== 2) {
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
                    {'subInfo.subInfo.subName': searchRegExp},{'visitInfo.visitName': searchRegExp}]
            }).sort({'visitTime': -1}).skip((currPage - 1) * limitVal).limit(limitVal);
        res.send({pages, found});

    } else {
        const searchRegexSurname = new RegExp(word[0], 'ig');
        const searchRegexName = new RegExp(word[1], 'ig');


        const count = await VisitJournalDbModel
            .find({'name': searchRegexName, 'surname': searchRegexSurname}).countDocuments();
        const pages = Math.ceil(count / limitVal);
        let currPage = Number(req.query ? req.query.page : 1);
        if (currPage > pages) {
            currPage = pages;
        }
        const found = await VisitJournalDbModel
            .find({$or: [{
                    'client.name': searchRegexName,
                    'client.surname': searchRegexSurname
                }, {
                    'subInfo.client.name': searchRegexName,
                    'subInfo.client.surname': searchRegexSurname
                }]}).sort({'visitTime': -1}).skip((currPage - 1) * limitVal).limit(limitVal);
        res.send({pages, found});
    }

})

router.delete('/journal/:id', async (req, res) => {
    await VisitJournalDbModel.findByIdAndDelete(req.params.id);
    res.sendStatus(200);
})

export default router;
