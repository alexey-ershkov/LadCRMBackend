import Router from 'express';
import bodyParser from "body-parser";
import ClientDbModel from "../dbModels/clientDbModel";

const router = Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:true}))

router.get('/clients', async (req, res) => {
    const clients = await ClientDbModel.find({});
    res.send(clients);
})

router.post('/addClient', async (req, resp) => {
    const client = req.body
    const dbClient = new ClientDbModel(client)
    dbClient.save().then(() => {
        resp.sendStatus(200);
    })
        .catch(err => {
            resp.send(err)
            resp.status(500)
        })

})

export default router;
