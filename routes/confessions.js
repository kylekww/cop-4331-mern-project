const express = require('express');
const router = express.Router();

const {addConfession, deleteConfession, searchConfession, changeVote, information} = require("../controllers/confessions");
const {loginRequired} = require("../controllers/auth");

router.post("/addConfession", loginRequired,addConfession);
router.post("/deleteConfession", loginRequired, deleteConfession);
router.post("/searchConfession", loginRequired, searchConfession);
router.get("/information", information);

module.exports = router;