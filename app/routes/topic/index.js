const { Router, json } = require("express");
const { Topic } = require("app/models");
const { cruder } = require("app/middlewares");
const router = Router();

router.get("/list", cruder.list(Topic));
router.post("/create", cruder.create(Topic));
router.post("/:topic_id/update", cruder.update(Topic));
router.get("/:topic_id/detail", cruder.detail(Topic));
router.delete("/:topic_id/delete", cruder.destroy(Topic));

module.exports = router;