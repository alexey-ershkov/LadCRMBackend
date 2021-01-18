import Router from 'express';
import bodyParser from "body-parser";
import SingleVisitTypeDbModel from "../dbModels/singleVisitTypeDbModel";

const router = Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:true}))


router.post('/addSingleVisit', async (req, resp) => {
    const singleVisitType = req.body;
    const dbSingleVisit = new SingleVisitTypeDbModel(singleVisitType);
    dbSingleVisit.save().then(() => {
        resp.sendStatus(200);
    })
        .catch(err => {
            resp.send(err)
            resp.status(500)
        })

})

export default router;
