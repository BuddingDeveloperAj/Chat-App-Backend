const {addMsg, getAllMsg} = require("../controllers/MessagesController")

const router = require("express").Router();

router.post("/addmsg", addMsg)
router.post("/getmsg", getAllMsg)

module.exports = router;