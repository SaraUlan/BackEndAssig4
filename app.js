const express = require("express");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const path = require("path");
const bodyParser = require("body-parser");
const connectToDatabase = require("./config/database/db");
const { port, db, secret } = require("./config/config");
const cookieParser = require("cookie-parser");
const i18n = require("./config/i18n");

let userDefaultRouter = require("./app/routes/default");
let userApiRouter = require("./app/routes/api");
let adminDefaultRouter = require("./app/routes/admin/default");
let adminApiRouter = require("./app/routes/admin/api");

let app = express();
app.use(cookieParser());
app.use(i18n.init);
app.use((req, res, next) => {
  const locale = req.cookies.lang || "en";
  req.setLocale(locale);
  next();
});

app.get("/changeLang/:lang", (req, res) => {
  const lang = req.params.lang || "en";
  res.cookie("lang", lang);
  req.setLocale(lang);
  res.redirect('back');
});


const store = new MongoDBStore({
  uri: db,
  collection: "sessions",
});

app.use(bodyParser.text({ type: "/" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(
  session({
    secret: secret,
    resave: false,
    saveUninitialized: true,
    store: store,
  })
);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use("", userDefaultRouter);
app.use("/api", userApiRouter);
app.use("/admin", adminDefaultRouter);
app.use("/admin", adminApiRouter);


connectToDatabase(db)
  .then(() => {
    console.log("Connection to database established!");
  })
  .catch((err) => {
    console.error(err);
  });

app.listen(port, () => {
  console.log(`Running on http://localhost:${port}`);
});
