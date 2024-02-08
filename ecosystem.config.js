module.exports = {
  apps: [
    {
      name: "WatchIt backend",
      script: "./dist/src/server.js",
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};
