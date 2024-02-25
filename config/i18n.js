const i18n = require("i18n");
const path = require("path");

i18n.configure({
  locales: ["en", "ru"],
  defaultLocale: "en",
  directory: path.join(__dirname, "/locales"),
  autoReload: true,
  cookie: "lang",
});

module.exports = i18n
