import Router from 'express';
import bodyParser from "body-parser";
import ClientDbModel from "../dbModels/clientDbModel";

const router = Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:true}))

router.post('/addClient', async (req, resp) => {
    const client = req.body
    const dbClient = new ClientDbModel(client)
    await dbClient.save()
    resp.sendStatus(200);
})

export default router;
