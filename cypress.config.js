const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://54.157.237.38",
    supportFile: false
  }
});

