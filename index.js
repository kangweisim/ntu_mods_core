(async () => {
  const express = require("express");

  const utilities = require("app/utilities");
  const config = require("config");
  const models = require("app/models");
  const { prepare_request, include_cors } = require("app/middlewares");

  const http_port = process.env.HTTP_PORT || 8181;

  const app = express();

  // removes null values from responses
  app.set("json replacer", utilities.null_omitter);
  app.use(prepare_request());
  app.use(include_cors());
  app.use("/api/v1", require("app/routes"));

  utilities.print_endpoints(app);

  app.listen(http_port, () => {
    utilities.chirp(`server listening on ${http_port}`);
  });
})();
