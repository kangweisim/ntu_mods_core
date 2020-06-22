const { Router } = require("express");
const router = Router();
const { crudscope } = require("app/middlewares")

router.use("/module", require("./module"));
router.use("/topic", require("./topic"));
router.use("/prerequisite", require("./prerequisite"));

module.exports = router;