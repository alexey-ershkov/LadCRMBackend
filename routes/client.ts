import Router from 'express';
import bodyParser from "body-parser";
import {ClientDbModel} from "../dbModels/clientDbModel";
import Client from "../models/client";
import {SubscriptionDbModel} from "../dbModels/subscriptionDbModel";

const router = Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}))

router.get('/clients', async (req, res) => {
    const clients = await ClientDbModel.find({}).limit(10);
    res.send(clients);
})

router.get('/client/:id', async (req, res) => {
    const client = await ClientDbModel.findById(req.params.id);
    res.send(client);
})

router.get('/clients/search/:search', async (req, res) => {
    const regex = new RegExp(req.params.search, 'ig');

    const found = await ClientDbModel.find({$or: [{'name': regex}, {'surname': regex}, {'lastName': regex}]}).limit(10);
    res.send(found);
})

router.get('/clients/searchUuid/:search', async (req, res) => {
    const found = await ClientDbModel.find({'uuidStr': new RegExp(req.params.search, 'ig')}).limit(10);
    res.send(found);
})

router.get('/clients/check/uuid/:uuid', async (req, res) => {
    const found = await ClientDbModel.find({'uuidStr':req.params.uuid});
    if (found.length === 0) {
        res.status(200).send({exists:false});
    } else {
        res.status(200).send({exists:true});
    }
})

router.post('/addChild', async (req, res) => {
    const childDb = new ClientDbModel(req.body);
    childDb.save()
        .then(() => {
            res.send(childDb._id);
        })
        .catch(err => {
            console.log(err);
            res.status(500).send(err);
        })
})

router.post('/modifyClient', async (req, res) => {
    let client = req.body as Client;
    await ClientDbModel.findByIdAndUpdate(client._id, client);
    res.sendStatus(200);
})

router.post('/addClient', async (req, resp) => {
    let client = req.body as Client

    if (client.isChild) {
        const parentClient: Client = {
            name: client.parentName,
            surname: client.parentSurname,
            lastName: client.parentLastName,
            dateOfBirth: client.parentDateOfBirth,
            uuid: client.parentUuid,
            uuidStr: client.parentUuidStr,
            created: client.created,
            isChild: false,
            orderNumber: client.orderNumber,
            phone: client.phone
        }
        const parentDbClient = new ClientDbModel(parentClient);
        let obj = await parentDbClient.save();
        client.parentId = obj._id;
    }

    const dbClient = new ClientDbModel(client)
    dbClient.save().then(() => {
        resp.sendStatus(200);
    })
        .catch(err => {
            console.log(err)
            resp.status(500).send(err)
        })

})

export default router;
