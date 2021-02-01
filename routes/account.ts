import Router from "express";
import bodyParser from "body-parser";
import {AccountDbModel} from "../dbModels/accountDbModel";
import Account from "../models/account";

const router = Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));

router.post('/saveAccount', async (req, res) => {
    const accountInfo = req.body as Account;

    if (accountInfo._id) {
        await AccountDbModel.findByIdAndUpdate(accountInfo._id, accountInfo);
        res.sendStatus(200);
    } else {
        const newAccount = new AccountDbModel(accountInfo);
        newAccount.save()
            .then(() => {
                res.sendStatus(200);
            })
            .catch(err => {
                console.log(err);
                res.status(500).send(err);
            })
    }
})

router.delete('/account/:id', async (req, res) => {
    await AccountDbModel.findByIdAndRemove(req.params.id);
    res.sendStatus(200);
})

router.get('/accounts', async (req, res) => {
    const accounts = await AccountDbModel.find({});
    res.send(accounts);
})

router.get('/account/:id', async (req, res) => {
    const account = await AccountDbModel.findById(req.params.id);
    res.send(account);
})

export default router;
