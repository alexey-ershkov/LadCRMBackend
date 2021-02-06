import Router from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

const router = Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));
router.use(cookieParser());

router.get('/ping', (req, res) => {
    res.send('pong');
})

router.get('/checkAuth', (req, res) => {
    res.sendStatus(200);
})

export default router;
