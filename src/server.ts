import initApp from "./app";
import https from "https";
import http from "http";
import fs from "fs";
import swaggerUI from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";

initApp().then((app) => {
  const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "WatchIt! REST API",
        version: "1.0.1",
        description:
          "REST server including authentication using JWT and refresh token",
      },
      servers: [{ url: "http://localhost:3000" }],
    },
    apis: ["./**/*.ts"],
  };
  const specs = swaggerJsDoc(options);
  app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

  if (process.env.NODE_ENV !== "production") {
    console.log("listen on PORT: " + process.env.PORT);
    http.createServer(app).listen(process.env.PORT);
  } else {
    const options = {
      key: fs.readFileSync("./client-key.pem"),
      cert: fs.readFileSync("./client-cert.pem"),
    };
    console.log("listen on PORT: " + process.env.HTTPS_PORT);
    https.createServer(options, app).listen(process.env.HTTPS_PORT);
  }
});
