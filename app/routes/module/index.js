const { Router, json } = require("express");
const { Module } = require("app/models");
const { cruder } = require("app/middlewares");
const router = Router();

router.get("/list", cruder.list(Module));
router.post("/create", cruder.create(Module));
router.post("/:module_id/update", cruder.update(Module));
router.get("/:module_id/detail", cruder.detail(Module));
router.delete("/:module_id/delete", cruder.destroy(Module));
router.post("/scrape", json(), require("./scrape"));

module.exports = router;