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

export default router;
