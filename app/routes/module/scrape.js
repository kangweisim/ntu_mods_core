const { Module } = require("app/models");
const { controller } = require("app/middlewares");
const axios = require("axios");
const cheerio = require("cheerio");

module.exports = controller.make(async (req, res) => {
  const { acadsem, year, semester, acad } = req.body;

  let params = {
    acadsem, semester, acad, boption: "CLoad", r_course_yr: `CSC;;${year};F;`
  }
  let response = await axios.get("https://wish.wis.ntu.edu.sg/webexe/owa/AUS_SUBJ_CONT.main_display1", {
    params
  });

  const $ = cheerio.load(response.data);
  let tables = $("table");
  let auRegex = /(.+)\sAU/g
  for (let i = 0; i < tables.length; i++) {
    if (i === 0) {
      let table = $(tables[i]);
      let body = $(table.children("tbody"));
      let rows = $(body.children("tr"));
      let info = $(rows.get(0)).children("td");
      let code = $(info.get(0)).text().trim()
      let title = $(info.get(1)).text().trim()
      let auText = $(info.get(2)).text().trim();
      let au = Number(auText.replace(/[^0-9\.]+/g, ""));
      
    }
  }

  res.send(response.data);

});
