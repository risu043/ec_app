const {setup: setupDevServer} = require("jest-dev-server");

module.exports = async function globalSetup(globalConfig, projectConfig) {
  process.env.API_PORT = projectConfig.globals.API_PORT;
  process.env.API_URL = projectConfig.globals.API_URL;

  globalThis.servers = await setupDevServer({
    command: `PORT=${projectConfig.globals.API_PORT} npm run start:test`,
    port: projectConfig.globals.API_PORT,
    launchTimeout: 30000,
  });
};
