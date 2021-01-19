import Router from 'express';
import bodyParser from "body-parser";
import SubTypeDbModel from "../dbModels/subTypeDbModel";

const router = Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:true}))

router.get('/subTypes', async (req, res) => {
    const subTypes = await SubTypeDbModel.find({});
    res.send(subTypes);
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

export default router;
