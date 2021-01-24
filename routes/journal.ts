import Router from "express";
import bodyParser from "body-parser";
import VisitJournalDbModel from "../dbModels/visitJournalDbModel";

const router = Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:true}))

router.get('/journal', async (req,res) => {
    const journal = await VisitJournalDbModel.find({});
    res.send(journal)
})

export default router;
