const express = require("express");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const path = require("path");
const bodyParser = require("body-parser");
const connectToDatabase = require("./config/database/db");
const { port, db, secret } = require('./config/config');

let app = express();



const store = new MongoDBStore({
  uri: db,
  collection: "sessions",
});


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
