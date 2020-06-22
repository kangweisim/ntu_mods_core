const { Router, json } = require("express");
const { Prerequisite } = require("app/models");
const { cruder } = require("app/middlewares");
const router = Router();

router.get("/list", cruder.list(Prerequisite));
router.post("/create", cruder.create(Prerequisite));
router.post("/:prerequisite_id/update", cruder.update(Prerequisite));
router.get("/:prerequisite_id/detail", cruder.detail(Prerequisite));
router.delete("/:prerequisite_id/delete", cruder.destroy(Prerequisite));

module.exports = router;