import Router from "express";
import bodyParser from "body-parser";
import {AccountDbModel} from "../dbModels/accountDbModel";
import Account from "../models/account";
import {SessionDbModel} from "../dbModels/sessionDbModel";
import CryptoJS from "crypto-js";
import cookieParser from "cookie-parser";

const router = Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));
router.use(cookieParser('test'))

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

router.post('/login', async (req, res) => {
    const userInfo = req.body as Account;
    const hash = CryptoJS.MD5(new Date().toISOString()).toString();

    res.cookie('lad', hash, {
        maxAge: 900000,
        httpOnly: true,
        secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
    });

    const session = new SessionDbModel({'cookie': hash})
    await session.save();
    const user = await AccountDbModel.find({'login': userInfo.login, 'password': userInfo.password});
    if (user.length !== 0) {
        res.sendStatus(200);
        return;
    }
    res.sendStatus(403);

})

export default router;
